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
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
    }
    else{
        $datares["status"] = 204;
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
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
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
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
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data1);
}

if($action == "getDBSettings"){
	$sql = "SELECT * FROM `dbsetting_master`";
	$result = $conn->query($sql);
	while($row = $result->fetch_array())
	{
		$rows[] = $row;
	}

	$tmp = array();
	$data = array();
	$i = 0;

	if(count($rows)>0){
		foreach($rows as $row)
		{
			$tmp[$i]['dbsettingid'] = $row['dbsettingid'];
			$tmp[$i]['dbsettingtitle'] = $row['dbsettingtitle'];
			$tmp[$i]['state'] = $row['state'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "updateDBSettings"){
	$data = json_decode(file_get_contents("php://input"));
	$dbsettingid = $data->dbsettingid;
	$state = $data->state;
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `dbsetting_master` SET `state`=$state WHERE `dbsettingid`=$dbsettingid";
		$result = $conn->query($sql);
	}
	$data1 = array();
    if($result){
        $data1["status"] = 200;
		$data1["data"] = $dbsettingid;
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data1);
}
?>