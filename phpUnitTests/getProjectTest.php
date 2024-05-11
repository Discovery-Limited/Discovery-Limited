<?php

use PHPUnit\Framework\TestCase;

class GetProjectTest extends TestCase
{
    private $pdo;
    private $pdoStatement;

    protected function setUp(): void
    {
        $this->pdo = $this->createMock(PDO::class);
        $this->pdoStatement = $this->createMock(PDOStatement::class);

        $GLOBALS['pdo'] = $this->pdo;

        $this->pdo->method('prepare')->willReturn($this->pdoStatement);
        $this->pdoStatement->method('execute')->willReturn(true);

        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        ob_start();
    }

    protected function tearDown(): void
    {
        ob_end_clean();
        session_unset();
    }

    public function testUserNotLoggedIn()
    {
        $_SESSION = [];

        include __DIR__ . '/../webpages/getProject.php';
        $output = json_decode(ob_get_clean(), true);

        $this->assertArrayHasKey('error', $output);
        $this->assertEquals('User not logged in', $output['error']);
    }

    public function testFetchProjectsForLoggedInUser()
    {
        $_SESSION['user_id'] = 1;

        $projects = [
            ['project_id' => 1, 'project_name' => 'Project Alpha', 'contributors' => 5],
            ['project_id' => 2, 'project_name' => 'Project Beta', 'contributors' => 3]
        ];

        $this->pdoStatement->method('fetchAll')->willReturn($projects);

        include __DIR__ . '/../webpages/getProject.php';
        $output = json_decode(ob_get_clean(), true);

        $this->assertCount(2, $output);
        $this->assertEquals('Project Alpha', $output[0]['project_name']);
    }

    public function testNoProjectsFound()
    {
        $_SESSION['user_id'] = 1;

        $this->pdoStatement->method('fetchAll')->willReturn([]);

        include __DIR__ . '/../webpages/getProject.php';
        $output = json_decode(ob_get_clean(), true);

        $this->assertEmpty($output);
    }
}

