<?php

use PHPUnit\Framework\TestCase;

class ProjectStorageTest extends TestCase
{
    private $pdoMock;
    private $stmtMock;

    protected function setUp(): void
    {
        $_SESSION = [];
        $_POST = [];
        
        $this->pdoMock = $this->createMock(PDO::class);
        $this->stmtMock = $this->createMock(PDOStatement::class);

        $this->pdoMock->method('prepare')->willReturn($this->stmtMock);
        $this->stmtMock->method('execute')->willReturn(true);
        $this->stmtMock->method('fetch')->willReturn(['user_id' => 123]);
        $this->stmtMock->method('bindParam')->willReturn(true);
        $this->stmtMock->method('rowCount')->willReturn(1);
    }

    public function testUserNotLoggedIn()
    {
        $this->pdoMock->expects($this->never())->method('beginTransaction');
        $_SERVER['REQUEST_METHOD'] = 'POST'; 

        $this->expectOutputRegex('/Location: login.php/'); 
        include __DIR__ . '/../webpages/project_storage.php';
    }

    public function testProjectAndContributorsInsertion()
    {
        $_SESSION['user_id'] = 1; 
        $_POST = [
            'project_name' => 'New Project',
            'emails' => 'test@example.com,test2@example.com'
        ];

        $this->pdoMock->expects($this->once())->method('beginTransaction');
        $this->pdoMock->expects($this->once())->method('commit');
        $this->stmtMock->expects($this->exactly(6))->method('execute');

        $this->expectOutputRegex('/Location: user_view.php/'); 
        include __DIR__ . '/../webpages/project_storage.php';
    }

    public function testDatabaseError()
    {
        $_SESSION['user_id'] = 1;
        $_POST = ['project_name' => 'New Project'];

        $this->pdoMock->expects($this->once())->method('beginTransaction');
        $this->stmtMock->method('execute')->willThrowException(new \PDOException("Error executing query"));
        $this->pdoMock->expects($this->once())->method('rollBack');

        $this->expectOutputRegex('/An error occurred:/');
        include __DIR__ . '/../webpages/project_storage.php';
    }

    protected function tearDown(): void
    {
        $_SESSION = [];
        $_POST = [];
        unset($_SERVER['REQUEST_METHOD']);
    }
}
