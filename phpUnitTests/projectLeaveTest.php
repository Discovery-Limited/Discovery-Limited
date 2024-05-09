<?php

use PHPUnit\Framework\TestCase;

class ProjectLeaveTest extends TestCase
{
    private $pdoMock;
    private $stmtMock;

    protected function setUp(): void
    {
        $_SESSION = [];
        $_SERVER['REQUEST_METHOD'] = 'POST';
        
        $this->pdoMock = $this->createMock(PDO::class);
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $this->pdoMock->method('prepare')->willReturn($this->stmtMock);
        $this->stmtMock->method('execute')->willReturn(true);
    }

    protected function tearDown(): void
    {
        $_SESSION = [];
        unset($_SERVER['REQUEST_METHOD']);
    }

    public function testUserNotLoggedIn()
    {
        $this->expectOutputString(json_encode(['error' => 'User not logged in']));
        include __DIR__ . '/../webpages/project_delete.php';
    }

    public function testMissingProjectId()
    {
        $_SESSION['user_id'] = 1;
        $input = json_encode([]);
        file_put_contents('php://input', $input);

        $this->expectOutputString(json_encode(['error' => 'Project ID is required']));
        include __DIR__ . '/../webpages/project_delete.php';
    }

    public function testSuccessfullyLeftProject()
    {
        $_SESSION['user_id'] = 1;
        $input = json_encode(['project_id' => '123', 'contributors' => 10]);
        file_put_contents('php://input', $input);

        $this->stmtMock->method('rowCount')->willReturn(1);
        $this->expectOutputString(json_encode(['success' => true, 'message' => 'Successfully left the project.']));
        
        include __DIR__ . '/../webpages/project_delete.php';
    }

    public function testFailedToLeaveProject()
    {
        $_SESSION['user_id'] = 1;
        $input = json_encode(['project_id' => '123', 'contributors' => 10]);
        file_put_contents('php://input', $input);

        $this->stmtMock->method('rowCount')->willReturn(0);
        $this->expectOutputString(json_encode(['error' => 'Failed to leave the project or already left.']));

        include __DIR__ . '/../webpages/project_delete.php';
    }
}
