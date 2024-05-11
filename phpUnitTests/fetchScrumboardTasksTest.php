<?php

use PHPUnit\Framework\TestCase;

class FetchScrumboardTasksTest extends TestCase
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

        include require __DIR__ . '/../webpages/fetch_scrumboardTasks.php';
        $output = json_decode(ob_get_clean(), true);

        $this->assertArrayHasKey('error', $output);
        $this->assertEquals('User not logged in', $output['error']);
    }

    public function testFetchScrumboardTasksForLoggedInUser()
    {
        $_SESSION['user_id'] = 1;
        $_GET['project_id'] = 100;

        $tasks = [
            ['task_id' => 1, 'task_name' => 'Task A', 'deadline' => '2024-05-01', 'assignee_id' => 1, 'description' => 'Details here', 'scrumboard_id' => 200],
            ['task_id' => 2, 'task_name' => 'Task B', 'deadline' => '2024-06-01', 'assignee_id' => 2, 'description' => 'Details here', 'scrumboard_id' => 200]
        ];

        $this->pdoStatement->method('fetchAll')->willReturn($tasks);

        require __DIR__ . '/../webpages/fetch_scrumboardTasks.php';
        $output = json_decode(ob_get_clean(), true);

        $this->assertCount(2, $output);
        $this->assertEquals('Task A', $output[0]['task_name']);
    }

    public function testNoTasksFound()
    {
        $_SESSION['user_id'] = 1;
        $_GET['project_id'] = 100;

        $this->pdoStatement->method('fetchAll')->willReturn([]);

        require __DIR__ . '/../webpages/fetch_scrumboardTasks.php';
        $output = json_decode(ob_get_clean(), true);

        $this->assertEmpty($output);
    }
}

