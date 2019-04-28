<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "getAllPayModes"){
	$sql = "SELECT * FROM `paymode_master` ORDER BY `paymode`";
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
			$tmp[$i]['paymodeid'] = $row['paymodeid'];
			$tmp[$i]['paymode'] = $row['paymode'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "addPayMode"){
    $data = json_decode(file_get_contents("php://input"));
    $paymode = $data->paymode;
    
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `paymode_master`(`paymode`) VALUES ('$paymode')";
        $result = $conn->query($sql);
        $paymodeid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $paymodeid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "updatePayMode"){
    $data = json_decode(file_get_contents("php://input"));
    $paymodeid = $data->paymodeid;
    $paymode = $data->paymode;
    
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `paymode_master` SET `paymode`='$paymode' WHERE `paymodeid`=$paymodeid";
        $result = $conn->query($sql);
        $paymodeid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $paymodeid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}
?>