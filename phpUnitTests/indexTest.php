<?php

use PHPUnit\Framework\TestCase;

class IndexTest extends TestCase
{
    private $pdo;

    protected function setUp(): void
    {
        $this->pdo = $this->createMock(PDO::class);
        
        $GLOBALS['config'] = [
            'db' => [
                'host' => 'localhost',
                'dbname' => 'testdb',
                'user' => 'root',
                'pass' => '',
                'charset' => 'utf8mb4',
            ],
            'options' => [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
            ]
        ];
    }

    public function testPdoInitialization()
    {
        $this->pdo->expects($this->once())
            ->method('__construct')
            ->with(
                $this->equalTo("mysql:host=localhost;dbname=testdb;charset=utf8mb4"),
                $this->equalTo('root'),
                $this->equalTo(''),
                $this->equalTo([
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false,
                ])
            );
    }

    public function testSessionManagement()
    {
        session_start();
        $_SESSION['test'] = 'value';
        $this->assertEmpty($_SESSION);

        include __DIR__ . '/../webpages/index.php';
    }

    public function testFileInclusion()
    {
        ob_start();
        $output = ob_get_clean();

        $this->assertStringContainsString('<html>', $output); 
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }
}
