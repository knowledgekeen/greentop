<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];
if($action == "getLastOFormId"){
	$headers = apache_request_headers();
	authenticate($headers);
    $sql = "SELECT `oformid`, oformno FROM `oform_master` ORDER BY `oformid` DESC LIMIT 1";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["oformid"]= $row["oformid"];
            $tmp[$i]["oformno"]= $row["oformno"];
        }

        $data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "getClientOForms"){
	$headers = apache_request_headers();
	authenticate($headers);
	$clientid = ($_GET["clientid"]);
    $sql = "SELECT * FROM `oform_master` Where `clientid`=$clientid ORDER BY `oformid` DESC";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["oformid"]= $row["oformid"];
            $tmp[$i]["oformno"]= $row["oformno"];
            $tmp[$i]["oformdt"]= $row["oformdt"];
            $i++;
        }

        $data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "getOformDetails"){
	$headers = apache_request_headers();
	authenticate($headers);
	$oformid = ($_GET["oformid"]);
    $sql = "SELECT * FROM `oform_master` Where `oformid`=$oformid";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["oformid"]= $row["oformid"];
            $tmp[$i]["oformno"]= $row["oformno"];
            $tmp[$i]["oformdt"]= $row["oformdt"];
            $tmp[$i]["oformstatus"]= $row["oformstatus"];
            $tmp[$i]["oformpurpose"]= $row["oformpurpose"];
            $tmp[$i]["productsselected"]= $row["productsselected"];
            $i++;
        }

        $data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "getAllOForms"){
	$headers = apache_request_headers();
	authenticate($headers);
    $sql = "SELECT om.*, cm.name FROM `oform_master` om, `client_master` cm WHERE om.`clientid`=cm.`clientid` ORDER By om.`oformno`";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["oformid"]= $row["oformid"];
            $tmp[$i]["oformno"]= $row["oformno"];
            $tmp[$i]["oformdt"]= $row["oformdt"];
            $tmp[$i]["clientid"]= $row["clientid"];
            $tmp[$i]["oformstatus"]= $row["oformstatus"];
            $tmp[$i]["oformpurpose"]= $row["oformpurpose"];
            $tmp[$i]["productsselected"]= $row["productsselected"];
            $tmp[$i]["name"]= $row["name"];
            $i++;
        }

        $data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "issueOForm"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $oformno = $data->oformno;
    $formdt = $data->formdt;
    $custid = $data->custid;
    $status = $data->status;
    $purpose = $data->purpose;
	$products = $data->products;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "INSERT INTO `oform_master`(`clientid`, `oformno`, `oformdt`, `oformstatus`, `oformpurpose`, `productsselected`) VALUES ($custid,'$oformno','$formdt','$status','$purpose','$products')";
        $result = $conn->query($sql);
        $ordid = $conn->insert_id;
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $ordid;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 400;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 400);
	}
	echo json_encode($data1);
}

if($action == "deleteOForm"){
	$headers = apache_request_headers();
	authenticate($headers);
	$oformid = ($_GET["oformid"]);
    $sql = "DELETE FROM `oform_master` WHERE `oformid`='$oformid'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $data["status"] = 200;
		$data["data"] = $oformid;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}
?>