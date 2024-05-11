<?php

use PHPUnit\Framework\TestCase;

class ProjectDeleteTest extends TestCase
{
    protected function setUp(): void
    {
        $_SESSION = [];
        $_SERVER['REQUEST_METHOD'] = 'POST';
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

    public function testProjectSuccessfullyDeleted()
    {
        $_SESSION['user_id'] = 1;
        $input = json_encode(['project_id' => '123']);
        file_put_contents('php://input', $input);
        $this->expectOutputString(json_encode(['success' => "Project successfully deleted."]));

        include __DIR__ . '/../webpages/project_delete.php';
    }

    public function testProjectNotFoundOrAlreadyDeleted()
    {
        $_SESSION['user_id'] = 1;
        $input = json_encode(['project_id' => 'invalid']);
        file_put_contents('php://input', $input);
        $this->expectOutputString(json_encode(['error' => "No project found with that ID or it might already be deleted."]));

        include __DIR__ . '/../webpages/project_delete.php';
    }
}
