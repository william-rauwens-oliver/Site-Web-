<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST["name"];
    $email = $_POST["email"];
    $message = $_POST["message"];

    $to = "williamrauwenso@gmail.com"; // Remplacez par l'adresse e-mail de votre sophrologue
    $subject = "Nouveau message de contact de $name";
    $headers = "From: $email";

    mail($to, $subject, $message, $headers);
}

// Redirection vers la page de confirmation
header("Location: confirmation.html");
exit();
?>
