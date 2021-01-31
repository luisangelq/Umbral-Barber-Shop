<?php

$db = mysqli_connect("localhost", "root", "Ex367336", "umbralbarbershop");

if(!$db){
    echo "Error to database connection";
    exit;
} 

// echo "Correct Connection to database";