<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    print_r($_POST);
    echo "Sending email from $name @ $email with message: $message";


?>