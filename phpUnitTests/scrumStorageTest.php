<?php

use PHPUnit\Framework\TestCase;

class ScrumStorageTest extends TestCase
{
    private $pdoMock;

    protected function setUp(): void
    {
        $this->pdoMock = $this->createMock(PDO::class);
        $this->pdoMock->expects($this->never())->method('__construct');
    }

    public function testDatabaseConnectionFailure()
    {
        $pdoException = new \PDOException("Database connection failed.");
        $this->pdoMock->method('__construct')->will($this->throwException($pdoException));

        $this->expectOutputString("Database connection failed: Database connection failed.");
        include __DIR__ . '/../webpages/scrum_storage.php';
    }

    public function testInputSanitization()
    {
        $dirtyString = " <script>alert('xss');</script> ";
        $expectedResult = htmlspecialchars(stripslashes(trim($dirtyString)));
        $result = test_input($dirtyString);

        $this->assertEquals($expectedResult, $result);
    }
}
