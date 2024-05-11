<?php

use PHPUnit\Framework\TestCase;

class ScrumboardTasksDeleteTest extends TestCase {
    private $pdo;
    private $stmt;

    protected function setUp(): void {
        parent::setUp();

        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);

        $this->pdo->method('prepare')->willReturn($this->stmt);

        global $pdo;
        $pdo = $this->pdo;

        ob_start();

        $_SERVER['REQUEST_METHOD'] = 'POST';

        if (!session_id()) {
            session_start();
        }
    }

    public function testDeleteTaskSuccess() {
        $json_input = json_encode(['task_id' => 123]);
        file_put_contents('php://input', $json_input);

        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('rowCount')->willReturn(1);

        include __DIR__ . '/../webpages/scrumboardTasks_delete.php';

        $output = ob_get_contents();
        $response = json_decode($output, true);

        $this->assertTrue($response['success']);
    }

    public function testDeleteTaskFailureNotFound() {
        $json_input = json_encode(['task_id' => 123]);
        file_put_contents('php://input', $json_input);

        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('rowCount')->willReturn(0);

        include __DIR__ . '/../webpages/scrumboardTasks_delete.php';

        $output = ob_get_contents();
        $response = json_decode($output, true);

        $this->assertFalse($response['success']);
        $this->assertEquals('Task not found or could not be deleted', $response['error']);
    }

    protected function tearDown(): void {
        ob_end_clean();
        parent::tearDown();
    }
}
