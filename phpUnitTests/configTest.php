<?php

use PHPUnit\Framework\TestCase;

class DbConfigTest extends TestCase
{
    private $config;

    protected function setUp(): void
    {
        $this->config = require __DIR__ . '/../webpages/config.php';
    }    

    public function testDbConfigStructure()
    {
        $this->assertIsArray($this->config);
        $this->assertArrayHasKey('db', $this->config);
        $this->assertArrayHasKey('options', $this->config);
        
        $dbConfig = $this->config['db'];
        $this->assertIsArray($dbConfig);
        $this->assertCount(5, $dbConfig);
        $this->assertArrayHasKey('host', $dbConfig);
        $this->assertArrayHasKey('dbname', $dbConfig);
        $this->assertArrayHasKey('user', $dbConfig);
        $this->assertArrayHasKey('pass', $dbConfig);
        $this->assertArrayHasKey('charset', $dbConfig);

        $options = $this->config['options'];
        $this->assertIsArray($options);
        $this->assertCount(3, $options);
        $this->assertArrayHasKey(PDO::ATTR_ERRMODE, $options);
        $this->assertArrayHasKey(PDO::ATTR_DEFAULT_FETCH_MODE, $options);
        $this->assertArrayHasKey(PDO::ATTR_EMULATE_PREPARES, $options);

        $this->assertEquals('212.107.17.1', $dbConfig['host']);
        $this->assertEquals('u921949114_discoveria_', $dbConfig['dbname']);
        $this->assertEquals('u921949114_admin_', $dbConfig['user']);
        $this->assertEquals('w4bF&9zDp#q@X6yS', $dbConfig['pass']);
        $this->assertEquals('utf8mb4', $dbConfig['charset']);

        $this->assertEquals(PDO::ERRMODE_EXCEPTION, $options[PDO::ATTR_ERRMODE]);
        $this->assertEquals(PDO::FETCH_ASSOC, $options[PDO::ATTR_DEFAULT_FETCH_MODE]);
        $this->assertFalse($options[PDO::ATTR_EMULATE_PREPARES]);
    }
}
