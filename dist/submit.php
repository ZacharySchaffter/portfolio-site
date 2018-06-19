<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $success = false;

    $emailPattern = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

    //Server Side validation
    $errors = [];
    if (empty($name)) {
        $errors['name'] = "Name is required";
    }

    if (empty($email) || !preg_match($emailPattern, $email)){
        $errors['email'] = "Email is invalid";
    } 

    if (empty($message)) {
        $errors['message'] = "Message is require";
    }

    if (!empty($errors)){
        http_response_code(400);
        die($errors);
    }

    //Send email
    $headers = "From: messages@zacharyschaffter.com";
    $message = "$name \r\n\r\n $email \r\n\r\n $message";
    mail("hull4baloo@yahoo.com","Message from: "+$name,$message, $headers);
    echo "Message sent";


?>