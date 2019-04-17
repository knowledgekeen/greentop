<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "addProduct"){
    $data = json_decode(file_get_contents("php://input"));
    $pname = mysqli_real_escape_string($conn, $data->pname);
    $hsncode = $data->hsncode;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        //Status: 1 == 'active'
		$sql = "INSERT INTO `product_master`(`prodname`, `hsncode`, `status`) VALUES ('$pname', '$hsncode', 1)";
        $result = $conn->query($sql);
        $prodid = $conn->insert_id;
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
    
}

if($action == "getActiveProducts"){
	$sql = "SELECT * FROM `product_master` WHERE `status` = 1 ORDER BY `prodname`";
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
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['prodname'] = $row['prodname'];
			$tmp[$i]['hsncode'] = $row['hsncode'];
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

if($action == "getDeactiveProducts"){
	$sql = "SELECT * FROM `product_master` WHERE `status` = 0 ORDER BY `prodname`";
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
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['prodname'] = $row['prodname'];
			$tmp[$i]['hsncode'] = $row['hsncode'];
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

if($action == "updateProduct"){
	$data = json_decode(file_get_contents("php://input"));
	$prodid = $data->prodid;
	$prodname = mysqli_real_escape_string($conn, $data->prodname);
	$hsncode = $data->hsncode;
	$status = $data->status;
	$result = false;
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `product_master` SET `prodname`='$prodname', `hsncode`='$hsncode', `status`=$status WHERE `prodid`=$prodid";
		$result = $conn->query($sql);
	}
	$data1= array();
	if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);	
}
?>