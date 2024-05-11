<?php

use PHPUnit\Framework\TestCase;

class SetProjectSessionTest extends TestCase {
    protected function setUp(): void {
        parent::setUp();

        if (!session_id()) {
            session_start();
        }

        ob_start();

        $_SERVER['REQUEST_METHOD'] = 'POST';
    }

    public function testSetProjectId() {
        $projectID = 12345;
        $jsonInput = json_encode(['projectID' => $projectID]);
        $this->mockFileGetContents($jsonInput);

        include __DIR__ . '/../webpages/set_project_session.php';

        $this->assertEquals($_SESSION['project_id'], $projectID);

        $output = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertTrue($response['success']);
    }

    public function testMissingProjectId() {
        $this->mockFileGetContents('{}');

        include __DIR__ . '/../webpages/set_project_session.php';

        $output = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertArrayHasKey('error', $response);
        $this->assertEquals('Project ID not provided', $response['error']);
    }

    public function testInvalidRequestMethod() {
        $_SERVER['REQUEST_METHOD'] = 'GET';

        include __DIR__ . '/../webpages/set_project_session.php';

        $output = ob_get_clean();
        $response = json_decode($output, true);

        $this->assertEquals('Invalid request method', $response['error']);
    }

    protected function mockFileGetContents($returnValue) {
        global $file_get_contents;
        $file_get_contents = function() use ($returnValue) {
            return $returnValue;
        };
    }

    protected function tearDown(): void {
        session_unset();
        session_destroy();

        ob_end_clean();

        parent::tearDown();
    }
}
