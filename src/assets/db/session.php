<?php

function initSession(){
    session_start();
}

function startMySession($key, $value){
    $_SESSION[$key] = $value;
}

function getSession($key){
    echo $_SESSION[$key];
}
?>