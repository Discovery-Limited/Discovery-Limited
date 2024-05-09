<?php
use PHPUnit\Framework\TestCase;

class ScrumboardTasksAddTest extends TestCase
{
    private $pdo;
    private $pdoStatement;

    protected function setUp(): void
    {
        // Mock the PDO object and PDOStatement
        $this->pdo = $this->createMock(PDO::class);
        $this->pdoStatement = $this->createMock(PDOStatement::class);
        
        // Stubbing the methods
        $this->pdo->method('prepare')->willReturn($this->pdoStatement);
        $this->pdoStatement->method('execute')->willReturn(true);
        $this->pdoStatement->method('fetch')->willReturn(['user_id' => 1]);
        $this->pdoStatement->method('fetchColumn')->willReturn(1);

        // Global setup
        $_POST = [
            'task_name' => 'Sample Task',
            'deadline' => '2024-01-01',
            'description' => 'A new task description.',
            'scrumboard_id' => 1,
            'status' => 'todo',
            'tag' => 'High',
            'tag_color' => 'red',
            'assignees' => ['example@example.com']
        ];

        $_SESSION['user_id'] = 1;
        $_SESSION['project_id'] = 1;
        
        // Suppress headers already sent warnings
        @$this->setOutputCallback(function() {});
    }

    public function testTaskCreationWithoutSessionUserId()
    {
        unset($_SESSION['user_id']); // simulate not logged in
        $result = $this->runScript();
        $this->assertArrayHasKey('error', $result);
        $this->assertEquals('User not logged in', $result['error']);
    }

    public function testTaskCreationWithoutProjectId()
    {
        unset($_SESSION['project_id']); // simulate project ID not set
        $result = $this->runScript();
        $this->assertArrayHasKey('error', $result);
        $this->assertEquals('Project ID not set in session', $result['error']);
    }

    public function testSuccessfulTaskCreation()
    {
        $this->pdoStatement->method('lastInsertId')->willReturn(10); // simulate last insert ID
        
        $result = $this->runScript();
        $this->assertArrayHasKey('success', $result);
        $this->assertTrue($result['success']);
        $this->assertEquals(10, $result['task_id']);
    }

    private function runScript()
    {
        ob_start();
        include __DIR__ . '/../webpages/scrumboardTasks_add.php';
        return json_decode(ob_get_clean(), true);
    }

    protected function tearDown(): void
    {
        $_POST = [];
        $_SESSION = [];
    }
}
