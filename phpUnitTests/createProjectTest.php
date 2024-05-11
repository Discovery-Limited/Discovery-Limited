<?php

use PHPUnit\Framework\TestCase;

class CreateProjectTest extends TestCase
{
    private $pdo;
    private $config;

    protected function setUp(): void
    {
        $this->config = require __DIR__ . '/../webpages/config.php';
        $this->pdo = $this->createMock(PDO::class);

        if (!session_id()) {
            session_start();
        }
    }

    function redirect($url) {
        throw new Exception("Redirect to $url");
    }

    public function testProjectCreationSuccess() {
        $_SESSION['user_id'] = 1; 
        $_POST['project_name'] = 'New Project'; 

        $this->expectExceptionMessage("Redirect to user_view.php");
        include __DIR__ . '/../webpages/createProject.php';
    }

    public function testProjectCreationFailNoSession() {
        $this->expectExceptionMessage("Redirect to login.php");
        include __DIR__ . '/../webpages/createProject.php';
    }
    
}

?>
