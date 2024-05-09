<?php

use PHPUnit\Framework\TestCase;

class ScrumboardTasksModifyTest extends TestCase {
    private $pdo;
    private $stmt;

    protected function setUp(): void {
        parent::setUp();

        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);

        $this->pdo->method('prepare')->willReturn($this->stmt);

        global $pdo;
        $pdo = $this->pdo;

        $_SERVER['REQUEST_METHOD'] = 'POST';

        ob_start();

        if (!session_id()) {
            session_start();
        }

        $_SESSION['user_id'] = 1; 
    }

    public function testModifyTaskSuccess() {
        $_POST = [
            'task_id' => 1,
            'task_title' => 'Updated Task',
            'description' => 'Updated Description',
            'deadline' => '2024-12-31',
            'tag' => 'High',
            'tag_color' => '#FF0000'
        ];

        $this->stmt->expects($this->once())
                   ->method('execute')
                   ->willReturn(true);

        include __DIR__ . '/../webpages/scrumboardTasks_modify.php';

        $output = ob_get_contents();
        $response = json_decode($output, true);

        $this->assertTrue($response['success']);
    }

    public function testUserNotLoggedIn() {
        $_SESSION = [];

        include __DIR__ . '/../webpages/scrumboardTasks_modify.php';

        $output = ob_get_contents();
        $response = json_decode($output, true);

        $this->assertArrayHasKey('error', $response);
        $this->assertEquals('User not logged in', $response['error']);
    }

    protected function tearDown(): void {
        ob_end_clean();

        unset($_SERVER['REQUEST_METHOD'], $_POST, $_SESSION);
        parent::tearDown();
    }
}
