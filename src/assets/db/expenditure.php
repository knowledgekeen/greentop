<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "createAccountHead"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $accheadnm = $data->accheadnm;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `accounthead_master`(`accheadnm`) VALUES ('$accheadnm')";
        $result = $conn->query($sql);
        $accheadid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $accheadid;
		$log  = "File: expenditure.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: expenditure.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getAllAccountHeads"){
	$headers = apache_request_headers();
	authenticate($headers);
	$sql = "SELECT * FROM `accounthead_master` ORDER BY `accheadnm`";
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
			$tmp[$i]['accheadid'] = $row['accheadid'];
			$tmp[$i]['accheadnm'] = $row['accheadnm'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: order.php - Method: $action".PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: order.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data);
}

if($action == "editAccountHead"){
	$headers = apache_request_headers();
    authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
	$accheadid = $data->accheadid;
    $accheadnm = $data->accheadnm;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "UPDATE `accounthead_master` SET `accheadnm`='$accheadnm' WHERE `accheadid`=$accheadid";
        $result = $conn->query($sql);
    }

    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $accheadid;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "deleteAccountHead"){
	$headers = apache_request_headers();
    authenticate($headers);
    $accheadid = $_GET["accheadid"];
    $sql = "DELETE FROM `accounthead_master` WHERE `accheadid`=$accheadid";
    $result = $conn->query($sql);

    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $accheadid;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}
?>