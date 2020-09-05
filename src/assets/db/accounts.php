<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'constants.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "getFinanYrAccOpeningBalance"){
	$headers = apache_request_headers();
    authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT * FROM `account_openingbal` WHERE `yeardt` BETWEEN '$fromdt' AND '$todt' ORDER BY `cashorbank`";
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
    $sql = "SELECT * FROM `personal_account_master` WHERE NOT `personalaccnm`='$NA' ORDER BY `personalaccnm`";
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
		$sqlsel = "SELECT * FROM `personal_account_master` WHERE `personalaccnm`='$NA'";
		$resultsel = $conn->query($sqlsel);
		$rowsel = $resultsel->fetch_array();
		$count = mysqli_num_rows($resultsel);
		if($resultsel && $count==0){
			$sqlins = "INSERT INTO `personal_account_master`(`personalaccid`,`personalaccnm`) VALUES (0,'$NA')";
			$resultins = $conn->query($sqlins);
			$tmpid = $conn->insert_id;
			$sqlupt = "UPDATE `personal_account_master` SET `personalaccid`=0 WHERE `personalaccid`=$tmpid";
			$resultupt = $conn->query($sqlupt);
		}

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

if($action == "getCashAccountExpenditure"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT er.*, am.* FROM `expenditure_register` er, `accounthead_master` am WHERE er.`accheadid`=am.`accheadid` AND am.`accheadnm`='$CASH_ACCOUNT' AND er.`exptype`='2' AND er.`expdate` BETWEEN '$fromdt' AND '$todt'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["expid"]= $row["expid"];
            $tmp[$i]["expdate"]= $row["expdate"];
            $tmp[$i]["exptype"]= $row["exptype"];
            $tmp[$i]["particulars"]= $row["particulars"];
            $tmp[$i]["amount"]= $row["amount"];
            $tmp[$i]["accheadnm"]= $row["accheadnm"];
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

if($action == "getDistinctPersonalAccs"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT DISTINCT(er.`personalaccid`),pam.`personalaccnm` as name FROM `expenditure_register` er, `personal_account_master` pam WHERE NOT er.`personalaccid`='0' AND er.`personalaccid`=pam.`personalaccid` AND er.`expdate` BETWEEN '$fromdt' AND '$todt'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["personalaccid"]= $row["personalaccid"];
            $tmp[$i]["name"]= $row["name"];
            $i++;
        }

		$sql1 = "SELECT DISTINCT(rr.`personalaccid`),pam.`personalaccnm` as name FROM `receipt_register` rr, `personal_account_master` pam WHERE NOT rr.`personalaccid`='0' AND rr.`personalaccid`=pam.`personalaccid` AND rr.`receiptdate` BETWEEN '$fromdt' AND '$todt'";
		$result1 = $conn->query($sql1);
		if($result1){
			while($row1 = $result1->fetch_array())
			{
				$tmp[$i]["personalaccid"]= $row1["personalaccid"];
				$tmp[$i]["name"]= $row1["name"];
				$i++;
			}
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

if($action == "getExpendituresOfPersonalAcc"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $personalaccid = $_GET["personalaccid"];
    $sql = "SELECT * FROM `expenditure_register` WHERE `personalaccid`='$personalaccid' AND `expdate` BETWEEN '$fromdt' AND '$todt'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["expid"]= $row["expid"];
            $tmp[$i]["expdate"]= $row["expdate"];
            $tmp[$i]["exptype"]= $row["exptype"];
            $tmp[$i]["personalaccid"]= $row["personalaccid"];
            $tmp[$i]["particulars"]= $row["particulars"];
            $tmp[$i]["amount"]= $row["amount"];
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

if($action == "getReceiptsOfPersonalAcc"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $personalaccid = $_GET["personalaccid"];
    $sql = "SELECT * FROM `receipt_register` WHERE `personalaccid`='$personalaccid' AND `receiptdate` BETWEEN '$fromdt' AND '$todt'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["receiptid"]= $row["receiptid"];
            $tmp[$i]["receiptdate"]= $row["receiptdate"];
            $tmp[$i]["receipttype"]= $row["receipttype"];
            $tmp[$i]["personalaccid"]= $row["personalaccid"];
            $tmp[$i]["particulars"]= $row["particulars"];
            $tmp[$i]["amount"]= $row["amount"];
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

if($action == "getAllCustMakePayments"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT mcp.*,cm.`name`,pm.`paymode` FROM `make_cust_payments` mcp, `client_master` cm, `paymode_master` pm WHERE mcp.`clientid` = cm.`clientid` AND mcp.`paymodeid`=pm.`paymodeid` AND `paydate` BETWEEN '$fromdt' AND '$todt'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["makecustpayid"]= $row["makecustpayid"];
            $tmp[$i]["clientid"]= $row["clientid"];
            $tmp[$i]["paydate"]= $row["paydate"];
            $tmp[$i]["amountpaid"]= $row["amountpaid"];
            $tmp[$i]["paymodeid"]= $row["paymodeid"];
            $tmp[$i]["particulars"]= $row["particulars"];
            $tmp[$i]["name"]= $row["name"];
            $tmp[$i]["paymode"]= $row["paymode"];
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

if($action == "getAllReceiveSupplierPayments"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT rsp.*,cm.`name`,pm.`paymode` FROM `receive_supplier_payments` rsp, `client_master` cm, `paymode_master` pm WHERE rsp.`clientid` = cm.`clientid` AND rsp.`paymodeid`=pm.`paymodeid` AND `paydate` BETWEEN '$fromdt' AND '$todt'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["receivesupppayid"]= $row["receivesupppayid"];
            $tmp[$i]["clientid"]= $row["clientid"];
            $tmp[$i]["paydate"]= $row["paydate"];
            $tmp[$i]["amountpaid"]= $row["amountpaid"];
            $tmp[$i]["paymodeid"]= $row["paymodeid"];
            $tmp[$i]["particulars"]= $row["particulars"];
            $tmp[$i]["name"]= $row["name"];
            $tmp[$i]["paymode"]= $row["paymode"];
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

if($action == "addPersonalAccAdjustment"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $adjustdt = $data->adjustdt;
    $personalacc = $data->personalacc;
    $creditdebit = $data->creditdebit;
    $amount = $data->amount;
    $particulars = mysqli_real_escape_string($conn,$data->particulars);
    $tmp = array();
    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `personal_account_adjustment`(`personalaccid`, `adjustdate`,`creddebt`, `amount`, `particulars`) VALUES ($personalacc,'$adjustdt','$creditdebit','$amount','$particulars')";
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

if($action == "getAllPersonalAccAdjustments"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $personalaccid = $_GET["personalaccid"];
    $sql = "SELECT * FROM `personal_account_adjustment` WHERE `personalaccid`='$personalaccid' AND `adjustdate` BETWEEN '$fromdt' AND '$todt'";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["personalaccadjid"]= $row["personalaccadjid"];
            $tmp[$i]["personalaccid"]= $row["personalaccid"];
            $tmp[$i]["adjustdate"]= $row["adjustdate"];
            $tmp[$i]["creddebt"]= $row["creddebt"];
            $tmp[$i]["amount"]= $row["amount"];
            $tmp[$i]["particulars"]= $row["particulars"];
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
?>