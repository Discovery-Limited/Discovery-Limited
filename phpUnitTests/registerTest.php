<?php

use PHPUnit\Framework\TestCase;

class RegisterTest extends TestCase
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
        $this->stmtMock->method('fetch')->willReturn(false); 
        $this->stmtMock->method('bindParam')->willReturn(true);
        $this->stmtMock->method('rowCount')->willReturn(1);
        $_SERVER['REQUEST_METHOD'] = 'POST'; 
    }

    public function testInvalidEmail()
    {
        $_POST = [
            'username' => 'testuser',
            'email' => 'invalid-email',
            'password' => 'password123',
            'confirmpassword' => 'password123'
        ];

        $this->expectOutputString("Invalid email format.");
        include __DIR__ . '/../webpages/register.php';
    }

    public function testPasswordMismatch()
    {
        $_POST = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'confirmpassword' => 'password'
        ];

        $this->expectOutputString("Passwords don't match.");
        include __DIR__ . '/../webpages/register.php';
    }

    public function testEmailAlreadyExists()
    {
        $_POST = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'confirmpassword' => 'password123'
        ];

        $this->stmtMock->method('fetch')->willReturn(true); 
        $this->expectOutputString("Email already exists.");
        include __DIR__ . '/../webpages/register.php';
    }

    public function testSuccessfulRegistration()
    {
        $_POST = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'confirmpassword' => 'password123'
        ];

        $this->stmtMock->method('lastInsertId')->willReturn(1);
        $this->expectOutputRegex('/Location: user_view.php/'); 
        include __DIR__ . '/../webpages/register.php';

        $this->assertEquals(1, $_SESSION['user_id']); 
    }

    public function testDatabaseInsertionError()
    {
        $_POST = [
            'username' => 'testuser',
            'email' => 'test@example.com',
            'password' => 'password123',
            'confirmpassword' => 'password123'
        ];

        $this->stmtMock->method('execute')->will($this->throwException(new \PDOException("Insert failed")));
        $this->expectOutputRegex('/An error occurred:/'); 
        include __DIR__ . '/../webpages/register.php';
    }

    protected function tearDown(): void
    {
        $_SESSION = [];
        $_POST = [];
        unset($_SERVER['REQUEST_METHOD']);
    }
}
 