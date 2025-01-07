<?php
// Database connection configuration
$host = 'localhost';        // Hostname
$username = 'root';         // Database username
$password = '';             // Database password (empty for XAMPP by default)
$database = 'barangaydb';   // Your database name

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
