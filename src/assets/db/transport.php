<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "addTransport"){
    $data = json_decode(file_get_contents("php://input"));
    $transportnm = mysqli_real_escape_string($conn,$data->transportnm);
    $contactno = $data->contactno;
    $address = mysqli_real_escape_string($conn,$data->address);
    
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `transport_master`(`transportname`, `contactno`, `address`, `status`) VALUES ('$transportnm','$contactno','$address', 1)";
        $result = $conn->query($sql);
        $transportid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $transportid;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "updateTransport"){
    $data = json_decode(file_get_contents("php://input"));
    $transportnm = mysqli_real_escape_string($conn,$data->transportnm);
    $transid = $data->transid;
    $contactno = $data->contactno;
    $address = mysqli_real_escape_string($conn,$data->address);
    
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `transport_master` SET `transportname`='$transportnm',`contactno`='$contactno',`address`='$address' WHERE `tmid`=$transid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $transid;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getActiveTransport"){
	$sql = "SELECT * FROM `transport_master` WHERE `status`=1 ORDER BY `transportname`";
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
			$tmp[$i]['tmid'] = $row['tmid'];
			$tmp[$i]['transportname'] = $row['transportname'];
			$tmp[$i]['contactno'] = $row['contactno'];
			$tmp[$i]['address'] = $row['address'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getAllTrucks"){
	$sql = "SELECT tr.`truckid`, tr.`lorryno`, tm.`tmid`, tm.`transportname`, tm.`contactno`, tm.`address` FROM `truck_register` tr, `transport_master` tm WHERE tr.`tmid`=tm.`tmid` ORDER BY tr.`lorryno`";
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
			$tmp[$i]['truckid'] = $row['truckid'];
			$tmp[$i]['lorryno'] = $row['lorryno'];
			$tmp[$i]['tmid'] = $row['tmid'];
			$tmp[$i]['transportname'] = $row['transportname'];
			$tmp[$i]['contactno'] = $row['contactno'];
			$tmp[$i]['address'] = $row['address'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "addTruck"){
    $data = json_decode(file_get_contents("php://input"));
    $tmid = $data->tmid;
    $lorryno = $data->lorryno;
    
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `truck_register`(`tmid`, `lorryno`) VALUES ($tmid,'$lorryno')";
        $result = $conn->query($sql);
        $lorryid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $lorryid;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "updateTruck"){
    $data = json_decode(file_get_contents("php://input"));
    $truckid = $data->truckid;
    $tmid = $data->tmid;
    $lorryno = $data->lorryno;
    
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `truck_register` SET `tmid`=$tmid,`lorryno`='$lorryno' WHERE `truckid`=$truckid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $truckid;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: transport.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}
?>