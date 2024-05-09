<?php

use PHPUnit\Framework\TestCase;

class DeadlineFinishTest extends TestCase
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

        require_once __DIR__ . '/../webpages/deadline_finish.php';
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

    public function testTaskIdRequired()
    {
        $_SESSION['user_id'] = 1;
        ob_start();
        $output = json_decode(ob_get_clean(), true);
        $this->assertEquals(['error' => 'Task ID is required'], $output);
    }

    public function testTaskFinishSuccessful()
    {
        $_SESSION['user_id'] = 1;
        $this->setInput(['task_id' => '123']);

        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('execute')->willReturn(true);
        $stmt->method('rowCount')->willReturn(1);

        $this->pdo->method('prepare')->willReturn($stmt);

        ob_start();
        $output = json_decode(ob_get_clean(), true);
        $this->assertEquals(['success' => "Task successfully finished."], $output);
    }

    public function testNoTaskFound()
    {
        $_SESSION['user_id'] = 1;
        $this->setInput(['task_id' => '123']);

        $stmt = $this->createMock(PDOStatement::class);
        $stmt->method('execute')->willReturn(true);
        $stmt->method('rowCount')->willReturn(0);

        $this->pdo->method('prepare')->willReturn($stmt);

        ob_start();
        $output = json_decode(ob_get_clean(), true);
        $this->assertEquals(['error' => "No task found with that ID or it might already be finished."], $output);
    }

    private function setInput($data)
    {
        file_put_contents('php://input', json_encode($data));
    }
}
