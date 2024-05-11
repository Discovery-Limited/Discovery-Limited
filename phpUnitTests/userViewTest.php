<?php

use PHPUnit\Framework\TestCase;

class UserViewTest extends TestCase {
    private $pdo;
    private $stmt;
    private $projectStmt;

    protected function setUp(): void {
        parent::setUp();

        if (!session_id()) {
            session_start();
        }

        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);
        $this->projectStmt = $this->createMock(PDOStatement::class);

        $this->pdo->method('prepare')
             ->willReturnMap([
                 ['SELECT username FROM user WHERE user_id = :user_id', $this->stmt],
                 ['SELECT p.project_id, p.project_name FROM project p JOIN user_project up ON p.project_id = up.project_id WHERE up.user_id = :user_id', $this->projectStmt]
             ]);

        $GLOBALS['pdo'] = $this->pdo;

        // Redirects and other headers
        $this->headers = [];
        $this->originalHeader = header;
        header == function($string) use (&$headers) {
            $this->headers[] = $string;
        };
    }

    public function testUserLoggedInAndViewLoad() {
        $_SESSION['user_id'] = 1;  

        $this->stmt->method('execute')->willReturn(true);
        $this->stmt->method('fetch')->willReturn(['username' => 'testUser']);

        $this->projectStmt->method('execute')->willReturn(true);
        $this->projectStmt->method('fetchAll')->willReturn([
            ['project_id' => 1, 'project_name' => 'Project One'],
            ['project_id' => 2, 'project_name' => 'Project Two']
        ]);

        ob_start();
        include __DIR__ . '/../webpages/user_view.php';
        $output = ob_get_clean();

        $this->assertContains('testUser', $output);
        $this->assertContains('Project One', $output);
        $this->assertContains('Project Two', $output);
    }

    public function testUserNotLoggedIn() {
        ob_start();
        include __DIR__ . '/../webpages/user_view.php';
        ob_end_clean();

        $this->assertContains('Location: login.php', $this->headers);
    }

    protected function tearDown(): void {
        session_unset();
        session_destroy();

        header == $this->originalHeader;
        unset($GLOBALS['pdo']);

        parent::tearDown();
    }
}

?>
