<?php
// Configuration
$db_host = 'localhost';
$db_username = 'root';
$db_password = '';
$db_name = 'blood_donation';

// Connect to database
$conn = new mysqli($db_host, $db_username, $db_password, $db_name);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Generate OTP
function generateOTP() {
    $otp = rand(100000, 999999);
    return $otp;
}

// Send OTP to user's phone number
function sendOTP($phone, $otp) {
    // Use an SMS gateway API or service
    // For demonstration purposes, we'll use a simple echo statement
    echo "OTP sent to $phone: $otp";
}

// Register user
if (isset($_POST['register'])) {
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $otp = generateOTP();
    $query = "INSERT INTO users (name, phone, otp) VALUES ('$name', '$phone', '$otp')";
    $conn->query($query);
    sendOTP($phone, $otp);
    header('Location: otp_verification.php?phone=' . $phone);
    exit;
}

// Verify OTP
if (isset($_POST['verify_otp'])) {
    $phone = $_POST['phone'];
    $otp = $_POST['otp'];
    $query = "SELECT * FROM users WHERE phone = '$phone' AND otp = '$otp'";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        header('Location: login.php');
        exit;
    } else {
        echo "Invalid OTP";
    }
}

// Login user
if (isset($_POST['login'])) {
    $phone = $_POST['phone'];
    $password = $_POST['password'];
    $query = "SELECT * FROM users WHERE phone = '$phone' AND password = '$password'";
    $result = $conn->query($query);
    if ($result->num_rows > 0) {
        header('Location: index.php');
        exit;
    } else {
        echo "Invalid phone or password";
    }
}

