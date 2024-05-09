<?php

use PHPUnit\Framework\TestCase;

class FetchProjectsTest extends TestCase
{
    private $pdo;
    private $config;

    protected function setUp(): void
    {
        $this->config = [
            'db' => [
                'host' => 'localhost',
                'dbname' => 'testdb',
                'user' => 'root',
                'pass' => '',
                'charset' => 'utf8mb4',
            ],
            'options' => [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        ];

        $this->pdo = $this->createMock(PDO::class);

        if (session_id() === '') {
            session_start();
        }
        $_SESSION = [];

        require_once __DIR__ . '/../webpages/fetch_project.php';
    }

    protected function tearDown(): void
    {
        if (session_id() !== '') {
            session_destroy();
        }
        parent::tearDown();
    }

    public function testUserNotLoggedIn()
    {
        ob_start();
        $output = json_decode(ob_get_clean(), true);
        $this->assertEquals(['error' => 'User not logged in'], $output);
    }

    public function testFetchProjects()
    {
        $_SESSION['user_id'] = 1;

        $projects = [
            ['project_id' => 1, 'project_name' => 'Project X', 'contributors' => 5, 'admin_id' => 1]
        ];

        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('execute')->willReturn(true);
        $stmt->method('fetchAll')->willReturn($projects);

        $this->pdo->method('prepare')->willReturn($stmt);

        ob_start();
        $output = json_decode(ob_get_clean(), true);
        $this->assertIsArray($output);
        $this->assertCount(1, $output); 
        $this->assertEquals(1, $output[0]['project_id']); 
    }

    private function mockProjectDetails($projects)
    {
        foreach ($projects as &$project) {
            $stmt = $this->createMock(PDOStatement::class);
            $stmt->method('execute')->willReturn(true);
            $stmt->method('fetchAll')->willReturn([
                ['status' => 'inProgress']
            ]);
            $this->pdo->method('prepare')->willReturn($stmt);
            $project['tasks'] = $stmt->fetchAll();
        }
        unset($project);
    }
}
