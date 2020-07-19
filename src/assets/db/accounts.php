<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "getFinanYrAccOpeningBalance"){
	$headers = apache_request_headers();
    authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $sql = "SELECT * FROM `account_openingbal` WHERE `yeardt`='$fromdt' ORDER BY `cashorbank`";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["acc_openbalid"]= $row["acc_openbalid"];
            $tmp[$i]["cashorbank"]= $row["cashorbank"];
            $tmp[$i]["amount"]= $row["amount"];
            $tmp[$i]["yeardt"]= $row["yeardt"];
            $i++;
        }

        $data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "addAccOpeningBalance"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $bankopenbal = $data->bankopenbal;
    $cashopenbal = $data->cashopenbal;
    $curryr = $data->curryr;
    $tmp = array();
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "INSERT INTO `account_openingbal`(`cashorbank`, `amount`, `yeardt`) VALUES ('BANK', '$bankopenbal', '$curryr')";
        $result = $conn->query($sql);
        $bankopenbalid = $conn->insert_id;
        $tmp[0]["bankopenbalid"] = $bankopenbalid;
        
        $sql = "INSERT INTO `account_openingbal`(`cashorbank`, `amount`, `yeardt`) VALUES ('CASH', '$cashopenbal', '$curryr')";
        $result = $conn->query($sql);
        $cashopenbalid = $conn->insert_id;
        $tmp[1]["cashopenbalid"] = $cashopenbalid;
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $tmp;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "updateAccOpeningBalance"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $bankopenbal = $data->bankopenbal;
    $cashopenbal = $data->cashopenbal;
    $curryr = $data->curryr;
    $tmp = array();
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "UPDATE `account_openingbal` SET `amount`='$bankopenbal' WHERE `cashorbank`='BANK' AND `yeardt`=$curryr";
        $result = $conn->query($sql);
        $tmp[0]["bankopenbalupt"] = "success";
        
        $sql = "UPDATE `account_openingbal` SET `amount`='$cashopenbal' WHERE `cashorbank`='CASH' AND `yeardt`=$curryr";
        $result = $conn->query($sql);
        $tmp[1]["cashopenbalupt"] = "success";
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $tmp;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "getAllPersonalAccounts"){
	$headers = apache_request_headers();
    authenticate($headers);
    $sql = "SELECT * FROM `personal_account_master`";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["personalaccid"]= $row["personalaccid"];
            $tmp[$i]["personalaccnm"]= $row["personalaccnm"];
            $i++;
        }

        $data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "createPersonalAccount"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $personalaccnm = $data->personalaccnm;
    $tmp = array();
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "INSERT INTO `personal_account_master`(`personalaccnm`) VALUES ('$personalaccnm')";
        $result = $conn->query($sql);
        $personalaccnmid = $conn->insert_id;
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $personalaccnmid;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "updatePersonalAccount"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $personalaccid = $data->personalaccid;
    $personalaccnm = $data->personalaccnm;
    $tmp = array();
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "UPDATE `personal_account_master` SET `personalaccnm`='$personalaccnm' WHERE `personalaccid`=$personalaccid";
        $result = $conn->query($sql);
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $personalaccid;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "deletePersonalAccount"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $personalaccid = $data->personalaccid;
    $tmp = array();
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "DELETE FROM `personal_account_master` WHERE `personalaccid`=$personalaccid";
        $result = $conn->query($sql);
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $personalaccid;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: accounts.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}
?>