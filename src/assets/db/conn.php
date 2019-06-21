<?php
//Create a connection
header('Access-Control-Allow-Origin: *');
//$conn = new mysqli("localhost", "assasate_gto", "Assasa@123", "assasate_greentop");
$conn = new mysqli("localhost", "root", "", "greentop");

function write_log($log, $flag, $errorval){
    date_default_timezone_set("Asia/Calcutta");
    $log = "User: ".$_SERVER['REMOTE_ADDR'].' - '.date("F j, Y, H:i:s").PHP_EOL.$log;
    $log = $log. "\n*******************************************************************************".PHP_EOL;
    "******************************************************************\n".PHP_EOL;
    if($flag == "success"){
        file_put_contents('./logs/log_'.date("j.n.Y").'.log', $log, FILE_APPEND);
    }
    else{
        if($errorval != NULL){
            file_put_contents('./logs/error_log_'.date("j.n.Y").'.log', $log, FILE_APPEND);
        }
    }
}
?>