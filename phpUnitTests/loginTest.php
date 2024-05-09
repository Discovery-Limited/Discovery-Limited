<?php

use PHPUnit\Framework\TestCase;

class LoginTest extends TestCase
{
    private $pdo;

    protected function setUp(): void
    {
        $this->pdo = $this->createMock(PDO::class);
        $this->stmt = $this->createMock(PDOStatement::class);
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

    public function testInvalidEmailFormat()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST['email'] = 'invalidemail';
        $_POST['password'] = 'password123';

        $this->expectExceptionMessage("Invalid email format.");

        include __DIR__ . '/../webpages/login.php';
    }

    public function testValidLogin()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST['email'] = 'valid@example.com';
        $_POST['password'] = 'password123';

        $this->pdo->method('prepare')
            ->willReturn($this->stmt);

        $this->stmt->method('execute')
            ->willReturn(true);

        $this->stmt->method('fetch')
            ->willReturn([
                'user_id' => 1,
                'username' => 'JohnDoe',
                'password' => password_hash('password123', PASSWORD_DEFAULT)
            ]);

        $this->expectOutputString('Location: user_view.php');
        $this->expectException(\Exception::class);
    }

    public function testInvalidLogin()
    {
        $_SERVER['REQUEST_METHOD'] = 'POST';
        $_POST['email'] = 'valid@example.com';
        $_POST['password'] = 'wrongpassword';

        $this->pdo->method('prepare')
            ->willReturn($this->stmt);

        $this->stmt->method('execute')
            ->willReturn(true);

        $this->stmt->method('fetch')
            ->willReturn([
                'user_id' => 1,
                'username' => 'JohnDoe',
                'password' => password_hash('password123', PASSWORD_DEFAULT)
            ]);

        $this->expectExceptionMessage("Invalid email or password.");
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }
}
