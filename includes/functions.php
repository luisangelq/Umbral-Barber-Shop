<?php
header('Content-Type: text/html; charset=UTF-8');
function getServices()
{
    try {
        //import conection
        require "database.php";
        $db->set_charset("utf8");

        //write sql code
        $sql = "SELECT * FROM services";
        $consult = mysqli_query($db, $sql);

        //get result

        $services = [];
        $i = 0;
        while($row = mysqli_fetch_assoc($consult)) {
            $services[$i]["id"] = $row["id"];
            $services[$i]["name"] = $row["name"];
            $services[$i]["price"] = $row["price"];

            $i++;
        }
        return $services;
        
    } catch (\Throwable $th) {
        var_dump($th);
    }
}

getServices();
