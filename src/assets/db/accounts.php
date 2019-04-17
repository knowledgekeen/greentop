<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "checkLogin"){
    $data = json_decode(file_get_contents("php://input"));
	$email = $data->email;
	$passwd = md5($data->passwd);
	$sql = "select * from `user_register` where email='$email' AND password='$passwd'";
	$result = $conn->query($sql);
	$row = $result->fetch_array();
	$tmp = array();
	$datares = array();

	if(count($row)>0){
        $tmp[0]['userid'] = $row['userid'];
        $tmp[0]['fullname'] = $row['fullname'];
        $tmp[0]['email'] = $row['email'];
        $datares["status"] = 200;
		$datares["data"] = $tmp;
		header(' ', true, 200);
    }
    else{
        $datares["status"] = 204;
		header(' ', true, 204);
    }
    echo json_encode($datares);
}

if($action == "checkOldPass"){
	$data = json_decode(file_get_contents("php://input"));
	$uid = $data->uid;
	$oldpass = md5($data->oldpass);
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "SELECT * FROM `user_register` WHERE `userid`=1 AND `password`='$oldpass'";
		$result = $conn->query($sql);
		$row = $result->fetch_array(MYSQLI_ASSOC);
	}
	$data1 = array();
    if($result){
        $data1["status"] = 200;
		$data1["data"] = $row['userid'];
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
    }
	echo json_encode($data1);
}

if($action == "changePassword"){
	$data = json_decode(file_get_contents("php://input"));
	$uid = $data->uid;
	$newpass = md5($data->newpass);
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `user_register` SET `password`='$newpass' WHERE `userid`=$uid";
		$result = $conn->query($sql);
	}
	$data1 = array();
    if($result){
        $data1["status"] = 200;
		$data1["data"] = $uid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
    }
	echo json_encode($data1);
}
?>