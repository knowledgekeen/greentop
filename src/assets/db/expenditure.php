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

if($action == "addExpenditure"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $expdate = $data->expdate;
    $exptype = $data->exptype;
    $acchead = $data->acchead;
    $particulars = $data->particulars;
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `expenditure_register`(`expdate`, `exptype`, `accheadid`, `particulars`, `amount`) VALUES ('$expdate',$exptype,$acchead,'$particulars', '$amount')";
        $result = $conn->query($sql);
        $expid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $expid;
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

if($action == "getExpendituresFromTo"){
	$headers = apache_request_headers();
    authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
	$sql = "SELECT er.`expid`,er.`expdate`,er.accheadid,er.`exptype`,er.`particulars`,er.`amount`,am.`accheadnm` FROM `expenditure_register` er, `accounthead_master` am WHERE er.`accheadid`=am.`accheadid` AND er.`expdate` BETWEEN '$fromdt' AND '$todt' ORDER BY er.`expdate`";
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
			$tmp[$i]['expid'] = $row['expid'];
			$tmp[$i]['expdate'] = $row['expdate'];
			$tmp[$i]['accheadid'] = $row['accheadid'];
			$tmp[$i]['exptype'] = $row['exptype'];
			$tmp[$i]['particulars'] = $row['particulars'];
			$tmp[$i]['amount'] = $row['amount'];
			$tmp[$i]['accheadnm'] = $row['accheadnm'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data);
}

if($action == "updateExpenditure"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $expid = $data->expid;
    $expdate = $data->expdate;
    $exptype = $data->exptype;
    $acchead = $data->acchead;
    $particulars = $data->particulars;
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `expenditure_register` SET `expdate`='$expdate',`exptype`=$exptype,`accheadid`=$acchead,`particulars`='$particulars',`amount`='$amount' WHERE `expid`=$expid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $expid;
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

if($action == "deleteExpenditure"){
	$headers = apache_request_headers();
    authenticate($headers);
    $expid = $_GET["expid"];

    $sql = "DELETE FROM `expenditure_register` WHERE `expid`=$expid";
    $result = $conn->query($sql);
	
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $expid;
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

if($action == "addReceipt"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $receiptdate = $data->receiptdate;
    $receipttype = $data->receipttype;
    $acchead = $data->acchead;
    $particulars = $data->particulars;
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `receipt_register`(`receiptdate`, `receipttype`, `accheadid`, `particulars`, `amount`) VALUES ('$receiptdate',$receipttype,$acchead,'$particulars', '$amount')";
        $result = $conn->query($sql);
        $expid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $expid;
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

if($action == "getReceiptsFromTo"){
	$headers = apache_request_headers();
    authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
	$sql = "SELECT er.`receiptid`,er.`receiptdate`,er.accheadid,er.`receipttype`,er.`particulars`,er.`amount`,am.`accheadnm` FROM `receipt_register` er, `accounthead_master` am WHERE er.`accheadid`=am.`accheadid` AND er.`receiptdate` BETWEEN '$fromdt' AND '$todt' ORDER BY er.`receiptdate`";
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
			$tmp[$i]['receiptid'] = $row['receiptid'];
			$tmp[$i]['receiptdate'] = $row['receiptdate'];
			$tmp[$i]['accheadid'] = $row['accheadid'];
			$tmp[$i]['receipttype'] = $row['receipttype'];
			$tmp[$i]['particulars'] = $row['particulars'];
			$tmp[$i]['amount'] = $row['amount'];
			$tmp[$i]['accheadnm'] = $row['accheadnm'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: expenditure.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data);
}

if($action == "updateReceipt"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $receiptid = $data->receiptid;
    $receiptdate = $data->receiptdate;
    $receipttype = $data->receipttype;
    $acchead = $data->acchead;
    $particulars = $data->particulars;
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `receipt_register` SET `receiptdate`='$receiptdate',`receipttype`=$receipttype,`accheadid`=$acchead,`particulars`='$particulars',`amount`='$amount' WHERE `receiptid`=$receiptid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $receiptid;
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

if($action == "deleteReceipt"){
	$headers = apache_request_headers();
    authenticate($headers);
    $receiptid = $_GET["receiptid"];

    $sql = "DELETE FROM `receipt_register` WHERE `receiptid`=$receiptid";
    $result = $conn->query($sql);
	
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $receiptid;
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
?>