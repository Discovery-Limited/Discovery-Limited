<?php

use PHPUnit\Framework\TestCase;

class ScrumBoardTest extends TestCase {
    private $backupGlobalsBlacklist = ['_SESSION']; 

    protected function setUp(): void {
        parent::setUp();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        $_SESSION['user_id'] = 1;
        $_SESSION['project_id'] = 1;

        ob_start();
    }

    public function testSessionVariables() {
        $this->assertEquals(1, $_SESSION['user_id']);
        $this->assertEquals(1, $_SESSION['project_id']);
    }

    public function testPageContent() {
        include __DIR__ . '/../webpages/scrumBoard.php';
        
        $output = ob_get_contents();
        
        $this->assertStringContainsString('<title>Scrum Board</title>', $output);
        $this->assertStringContainsString('<div class="dashboard">', $output);
        $this->assertStringContainsString('id="add-task-form"', $output);
        $this->assertStringContainsString('name="task"', $output);
    }

    protected function tearDown(): void {
        ob_end_clean();
        if (session_status() !== PHP_SESSION_NONE) {
            session_destroy();
        }
        parent::tearDown();
    }
}
