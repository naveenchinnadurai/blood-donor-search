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
// Donate blood or organ
if (isset($_POST['donate'])) {
    $user_id = $_POST['user_id'];
    $blood_group = $_POST['bloodGroup'];
    $district = $_POST['district'];
    $donation_type = $_POST['donationType'];
    $query = "INSERT INTO donations (user_id, blood_group, district, donation_type) VALUES ('$user_id', '$blood_group', '$district', '$donation_type')";
    $conn->query($query);
    header('Location: index.php');
    exit;
}

if (isset($_POST['search'])) {
    $district = $_POST['district'];
    $blood_group = $_POST['bloodGroup'];
    $donation_type = $_POST['donationType'];

    $query = "SELECT * FROM donations 
              WHERE district LIKE '%$district%' 
              AND blood_group LIKE '%$blood_group%' 
              AND donation_type LIKE '%$donation_type%' 
              GROUP BY user_id";

    $result = $conn->query($query);
    $search_results = array();

    while ($row = $result->fetch_assoc()) {
        // Get donor information from users table
        $user_id = $row['user_id'];
        $user_query = "SELECT * FROM users WHERE id = '$user_id'";
        $user_result = $conn->query($user_query);
        $user_row = $user_result->fetch_assoc();

        $search_results[] = array(
            'name' => $user_row['name'],
            'phone' => $user_row['phone'],
            'district' => $row['district'],
            'blood_group' => $row['blood_group'],
            'donation_type' => $row['donation_type']
        );
    }

    // Display search results
    foreach ($search_results as $result) {
        echo '<div class="donor-profile">';
        echo '<h2>' . $result['name'] . '</h2>';
        echo '<p>Phone: ' . $result['phone'] . '</p>';
        echo '<p>District: ' . $result['district'] . '</p>';
        echo '<p>Blood Group: ' . $result['blood_group'] . '</p>';
        echo '<p>Donation Type: ' . $result['donation_type'] . '</p>';
        echo '</div>';
    }
}
$conn->close();
?>

<?php
// OTP Verification

if (isset($_GET['phone'])) {
    $phone = $_GET['phone'];
    ?>
    <form action="" method="post">
        <input type="hidden" name="phone" value="<?php echo $phone; ?>">
        <label>Enter OTP:</label>
        <input type="number" name="otp">
        <button type="submit" name="verify_otp">Verify</button>
    </form>
    <?php
}
?>