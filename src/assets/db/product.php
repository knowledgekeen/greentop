<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "addProduct"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $pname = mysqli_real_escape_string($conn, $data->pname);
    $brandname = mysqli_real_escape_string($conn, $data->brandname);
    $hsncode = $data->hsncode;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        //Status: 1 == 'active'
		$sql = "INSERT INTO `product_master`(`prodname`, `brandname`, `hsncode`, `status`) VALUES ('$pname', '$brandname', '$hsncode', 1)";
        $result = $conn->query($sql);
        $prodid = $conn->insert_id;
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
    
}

if($action == "getActiveProducts"){
	$headers = apache_request_headers();
	authenticate($headers);
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
			$tmp[$i]['brandname'] = $row['brandname'];
			$tmp[$i]['hsncode'] = $row['hsncode'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: product.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getDeactiveProducts"){
	$headers = apache_request_headers();
	authenticate($headers);
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
			$tmp[$i]['brandname'] = $row['brandname'];
			$tmp[$i]['hsncode'] = $row['hsncode'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: product.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "updateProduct"){
	$headers = apache_request_headers();
	authenticate($headers);
	$data = json_decode(file_get_contents("php://input"));
	$prodid = $data->prodid;
	$prodname = mysqli_real_escape_string($conn, $data->prodname);
	$brandname = mysqli_real_escape_string($conn, $data->brandname);
	$hsncode = $data->hsncode;
	$status = $data->status;
	$result = false;
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `product_master` SET `prodname`='$prodname',`brandname`='$brandname', `hsncode`='$hsncode', `status`=$status WHERE `prodid`=$prodid";
		$result = $conn->query($sql);
	}
	$data1= array();
	if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);	
}

if($action == "deactivateProduct"){
	$headers = apache_request_headers();
	authenticate($headers);
	$prodid = $_GET["prodid"];
	$result = false;
	$sql = "UPDATE `product_master` SET `status`=0 WHERE `prodid`=$prodid";
	$result = $conn->query($sql);
	$data1= array();
	if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "activateProduct"){
	$headers = apache_request_headers();
	authenticate($headers);
	$prodid = $_GET["prodid"];
	$result = false;
	$sql = "UPDATE `product_master` SET `status`=1 WHERE `prodid`=$prodid";
	$result = $conn->query($sql);
	$data1= array();
	if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data1).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: product.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}
?>