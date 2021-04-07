<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "transferCustOpenBal"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $fromdt = $data->fromdt;
    $todt = $data->todt;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "INSERT INTO `client_openingbal`( `clientid`, `openingbal`, `baldate`) SELECT `clientid`, `balanceamt`, '$fromdt' FROM `client_master`";
        $result = $conn->query($sql);
        $ordid = $conn->insert_id;
        // INSERT INTO `client_openingbal`( `clientid`, `openingbal`, `baldate`) VALUES ([value-2],[value-3],[value-4])
       
    }
    $data1= array();
    if($result){
		$sql1 = "UPDATE `current_financialyr` SET `status`='completed' WHERE `transferaccs`='client_open_bal' AND `finanyr`='$fromdt'";
        $result1 = $conn->query($sql1);
		$data1["status"] = 200;
		$data1["data"] = $ordid;
		$log  = "File: transfer.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: transfer.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "transferCashBankAccLedgerBal"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $fromdt = $data->fromdt;
    $todt = $data->todt;
    $prevfromdt = $data->prevfromdt;
    $prevtodt = $data->prevtodt;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sqlyr = "SELECT `latestbal` FROM `account_openingbal` WHERE `yeardt`='$prevfromdt' AND `cashorbank`='BANK'";
		$resultyr = $conn->query($sqlyr);
		$rowyr = $resultyr->fetch_array();
		if($rowyr){
		$bankopenbal = $rowyr["latestbal"];
        $sql = "INSERT INTO `account_openingbal`(`cashorbank`, `amount`, `yeardt`) VALUES ('BANK', '$bankopenbal', '$fromdt')";
        $result = $conn->query($sql);
        $bankopenbalid = $conn->insert_id;
        $tmp[0]["bankopenbalid"] = $bankopenbalid;
		}
		
		$sqlyr = "SELECT `latestbal` FROM `account_openingbal` WHERE `yeardt`='$prevfromdt' AND `cashorbank`='CASH'";
		$resultyr = $conn->query($sqlyr);
		$rowyr = $resultyr->fetch_array();
		if($rowyr){
		$cashopenbal = $rowyr["latestbal"];
        $sql = "INSERT INTO `account_openingbal`(`cashorbank`, `amount`, `yeardt`) VALUES ('CASH', '$cashopenbal', '$fromdt')";
        $result = $conn->query($sql);
        $cashopenbalid = $conn->insert_id;
        $tmp[1]["cashopenbalid"] = $cashopenbalid;
		}
    }
    $data1= array();
    if($result){
		$sql1 = "UPDATE `current_financialyr` SET `status`='completed' WHERE `transferaccs`='cashbank_acc_ledger_bal' AND `finanyr`='$fromdt'";
        $result1 = $conn->query($sql1);
		$data1["status"] = 200;
		$data1["data"] = $tmp;
		$log  = "File: transfer.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: transfer.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "transferStockBal"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $fromdt = $data->fromdt;
    $todt = $data->todt;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        // $sql = "INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) SELECT `stockid`,'IN',`quantity`,'$fromdt','Opening Balance' from `stock_master`";
        $sql = "INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) SELECT `stockid`,'IN',`quantity`,'1617215400000','Opening Balance' from `stock_master`";
        $result = $conn->query($sql);
    }
    $data1= array();
    if($result){
		$sql1 = "UPDATE `current_financialyr` SET `status`='completed' WHERE `transferaccs`='stock_bal_transfer' AND `finanyr`='$fromdt'";
        $result1 = $conn->query($sql1);
		$data1["status"] = 200;
		$data1["data"] = "success";
		$log  = "File: transfer.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: transfer.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}
?>