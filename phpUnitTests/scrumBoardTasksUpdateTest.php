<?php

use PHPUnit\Framework\TestCase;

class ScrumboardTasksUpdateTest extends TestCase {
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

        $jsonInput = json_encode(['taskId' => 123, 'status' => 'Completed']);
        $this->mockGlobalFunction('file_get_contents', $jsonInput);
    }

    protected function mockGlobalFunction($functionName, $returnValue) {
        $function = new class($returnValue) {
            public $returnValue;
            public function __construct($returnValue) {
                $this->returnValue = $returnValue;
            }
            public function __invoke() {
                return $this->returnValue;
            }
        };

        global $$functionName;
        $$functionName = $function;
    }

    public function testUpdateTaskSuccess() {
        $this->stmt->expects($this->once())
                   ->method('execute')
                   ->willReturn(true);

        include __DIR__ . '/../webpages/scrumboardTasks_update.php';

        $output = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertTrue($response['success']);
    }

    public function testUserNotLoggedIn() {
        $_SESSION = [];

        include __DIR__ . '/../webpages/scrumboardTasks_update.php';

        $output = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertArrayHasKey('error', $response);
        $this->assertEquals('User not logged in', $response['error']);
    }

    public function testInvalidRequestMethod() {
        $_SERVER['REQUEST_METHOD'] = 'GET';

        include __DIR__ . '/../webpages/scrumboardTasks_update.php';

        $output = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertEquals('Invalid request method', $response['error']);
    }

    protected function tearDown(): void {
        ob_end_clean();

        unset($_SERVER['REQUEST_METHOD'], $_POST, $_SESSION, $GLOBALS['file_get_contents']);
        parent::tearDown();
    }
}
