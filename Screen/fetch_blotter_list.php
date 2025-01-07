<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *'); // Allow all origins (modify as needed)

// Database connection details
$hostname = "lesterintheclouds.com";
$username = "IT112-24-M";
$password = "W2Bq@EV[SFEV";
$database = "db_brgy_app";

// Create connection
$conn = mysqli_connect($hostname, $username, $password, $database);

// Check connection
if (!$conn) {
    die(json_encode(['error' => 'Connection failed: ' . mysqli_connect_error()]));
}

// SQL query to fetch data from the blotter_list table
$sql = "SELECT id, date, type, status, reported_by FROM blotter_list";
$result = mysqli_query($conn, $sql);

// Check for query errors
if (!$result) {
    die(json_encode(['error' => 'Query failed: ' . mysqli_error($conn)]));
}

// Fetch data and prepare the response
$data = array();
while ($row = mysqli_fetch_assoc($result)) {
    // Add the row data to the data array
    $data[] = array(
        'id' => $row['id'],               // Ensure column names match your database schema
        'date' => $row['date'],
        'type' => $row['type'],
        'status' => $row['status'],
        'reported_by' => $row['reported_by']
    );
}

// Close the database connection
mysqli_close($conn);

// Output the data as JSON
echo json_encode($data);
?>
