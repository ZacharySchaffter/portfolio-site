<?php
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];
    $status = [];

    $emailPattern = '/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/';

    //Server Side validationwg
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
        $status = [
            "success"=>false,
            "errors"=>$errors
        ];
        die($status);
    }

    //Send email
    $headers = "From: messages@zacharyschaffter.com";
    $subject = "Message from: $name";
    $message = "$name \r\n\r\n $email \r\n\r\n $message";
    mail("hull4baloo@yahoo.com", $subject, $message, $headers);
    
    $status = [
        "success" => true
    ];

    print_r(json_encode($status));


?>