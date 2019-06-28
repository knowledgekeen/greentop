<?php

function startMySession($key, $value){
    $_SESSION[$key] = $value;
}

function getMySession($key){
    return $_SESSION[$key];
}
?>