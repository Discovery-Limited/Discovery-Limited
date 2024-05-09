<?php

use PHPUnit\Framework\TestCase;

class FetchDeadlineTest extends TestCase
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

        require_once __DIR__ . '/../webpages/fetch_deadline.php';
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

    public function testFetchTasks()
    {
        $_SESSION['user_id'] = 1;

        $tasks = [
            ['task_id' => '101', 'task_name' => 'Write Report', 'status' => 'inProgress'],
            ['task_id' => '102', 'task_name' => 'Prepare Slides', 'status' => 'toDo']
        ];

        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('execute')->willReturn(true);
        $stmt->method('fetchAll')->willReturn($tasks);

        $this->pdo->method('prepare')->willReturn($stmt);

        ob_start();
        $output = json_decode(ob_get_clean(), true);
        $this->assertEquals(['tasks' => $tasks], $output);
    }

    private function mockFetchUsersForEachTask($tasks)
    {
        foreach ($tasks as &$task) {
            $stmt = $this->createMock(PDOStatement::class);
            $stmt->method('execute')->willReturn(true);
            $stmt->method('fetchAll')->willReturn([
                ['email' => 'user@example.com']
            ]);
            $this->pdo->method('prepare')->willReturn($stmt);
            $task['users'] = $stmt->fetchAll();
        }
        unset($task);  
    }
}
