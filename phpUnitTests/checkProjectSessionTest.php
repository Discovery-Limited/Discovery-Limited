<?php

use PHPUnit\Framework\TestCase;

class CheckProjectSessionTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        if (session_id() === '') {
            session_start();
        }
        $_SESSION = [];
    }

    protected function tearDown(): void
    {
        if (session_id() !== '') {
            session_destroy();
        }
        parent::tearDown();
    }

    public function testProjectIDInSession()
    {
        $_SESSION['project_id'] = '12345';
        ob_start();
        include __DIR__ . '/../webpages/check_project_session.php';
        $output = ob_get_clean();

        $expectedOutput = json_encode(['projectID' => '12345']);
        $this->assertEquals($expectedOutput, $output);
    }

    public function testProjectIDNotInSession()
    {
        unset($_SESSION['project_id']);

        ob_start();
        include __DIR__ . '/../webpages/check_project_session.php';
        $output = ob_get_clean();

        $expectedOutput = json_encode(['error' => 'Project ID not set in session']);
        $this->assertEquals($expectedOutput, $output);
    }
}
