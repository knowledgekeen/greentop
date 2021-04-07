<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'constants.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "createAccountHead"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $accheadnm = mysqli_real_escape_string($conn,$data->accheadnm);

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sqlsel = "SELECT * FROM `accounthead_master` WHERE `accheadnm`='$CASH_ACCOUNT'";
		$resultsel = $conn->query($sqlsel);
		$rowsel = $resultsel->fetch_array();
		$count = mysqli_num_rows($resultsel);
		if($resultsel && $count==0){
			$sqlins = "INSERT INTO `accounthead_master`(`accheadnm`) VALUES ('$CASH_ACCOUNT')";
			$resultins = $conn->query($sqlins);
		}

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
	if($rows && count($rows)>0){
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
    $accheadnm = mysqli_real_escape_string($conn,$data->accheadnm);
    
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
    $personalaccid = $data->personalaccid;
    $particulars = mysqli_real_escape_string($conn,$data->particulars);
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `expenditure_register`(`expdate`, `exptype`, `accheadid`, `personalaccid`, `particulars`, `amount`) VALUES ('$expdate',$exptype,$acchead,$personalaccid,'$particulars', '$amount')";
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
	$sql = "SELECT er.*,am.`accheadnm`,pam.`personalaccnm` FROM `expenditure_register` er, `accounthead_master` am, `personal_account_master` pam WHERE er.`accheadid`=am.`accheadid` AND er.`personalaccid`=pam.`personalaccid` AND er.`expdate` BETWEEN '$fromdt' AND '$todt' ORDER BY er.`expdate`,er.`amount`";
	$result = $conn->query($sql);
	while($row = $result->fetch_array())
	{
		$rows[] = $row;
	}

	$tmp = array();
	$data = array();
	$i = 0;
	if($rows && count($rows)>0){
		foreach($rows as $row)
		{
			$tmp[$i]['expid'] = $row['expid'];
			$tmp[$i]['expdate'] = $row['expdate'];
			$tmp[$i]['accheadid'] = $row['accheadid'];
			$tmp[$i]['exptype'] = $row['exptype'];
			$tmp[$i]['particulars'] = $row['particulars'];
			$tmp[$i]['amount'] = $row['amount'];
			$tmp[$i]['personalaccnm'] = $row['personalaccnm'];
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
	$personalaccid = $data->personalaccid;
    $particulars = $data->particulars;
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `expenditure_register` SET `expdate`='$expdate',`exptype`=$exptype,`accheadid`=$acchead,`personalaccid`=$personalaccid,`particulars`='$particulars',`amount`='$amount' WHERE `expid`=$expid";
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
    $personalaccid = $data->personalaccid;
    $particulars = mysqli_real_escape_string($conn,$data->particulars);
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `receipt_register`(`receiptdate`, `receipttype`, `accheadid`, `personalaccid`, `particulars`, `amount`) VALUES ('$receiptdate',$receipttype,$acchead,$personalaccid,'$particulars', '$amount')";
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
	$sql = "SELECT er.*,am.`accheadnm`,pam.`personalaccnm` FROM `receipt_register` er, `accounthead_master` am,`personal_account_master` pam WHERE er.`accheadid`=am.`accheadid` AND er.`personalaccid`=pam.`personalaccid` AND er.`receiptdate` BETWEEN '$fromdt' AND '$todt' ORDER BY er.`receiptdate`,er.`amount`";

	$result = $conn->query($sql);
	while($row = $result->fetch_array())
	{
		$rows[] = $row;
	}

	$tmp = array();
	$data = array();
	$i = 0;
	if($rows && count($rows)>0){
		foreach($rows as $row)
		{
			$tmp[$i]['receiptid'] = $row['receiptid'];
			$tmp[$i]['receiptdate'] = $row['receiptdate'];
			$tmp[$i]['accheadid'] = $row['accheadid'];
			$tmp[$i]['receipttype'] = $row['receipttype'];
			$tmp[$i]['particulars'] = $row['particulars'];
			$tmp[$i]['personalaccnm'] = $row['personalaccnm'];
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
	$personalaccid = $data->personalaccid;
    $particulars = mysqli_real_escape_string($conn,$data->particulars);
    $amount = $data->amount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `receipt_register` SET `receiptdate`='$receiptdate',`receipttype`=$receipttype,`accheadid`=$acchead,`personalaccid`=$personalaccid,`particulars`='$particulars',`amount`='$amount' WHERE `receiptid`=$receiptid";
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