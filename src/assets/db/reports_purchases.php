<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "getFromToPurchases"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT pm.`purcmastid`,pm.`clientid`,pm.`vehicalno`,pm.`dcno`,pm.`billno`,pm.`billdt`,pm.`arrivaldt`,pm.`totalamount`,pm.`totaldiscount`,cm.`name`,cm.`city`,cm.`gstno`, pr.`rawmatid`, pr.`quantity`, pr.`rate`, pr.`cgst`, pr.`sgst`, pr.`igst`, pr.`discount`, pr.`roundoff`, pr.`amount` , rm.`name` as `rawmatname`,rm.`hsncode` FROM `purchase_master` pm, `client_master` cm, `purchase_register` pr, `raw_material_master` rm WHERE pm.`clientid`=cm.`clientid` AND pr.`purcmastid`=pm.`purcmastid` AND pr.`rawmatid`=rm.`rawmatid` AND `billdt` BETWEEN '$fromdt' AND '$todt' ORDER BY pm.`arrivaldt`";
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
			$tmp[$i]['purcmastid'] = $row['purcmastid'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['vehicalno'] = $row['vehicalno'];
			$tmp[$i]['dcno'] = $row['dcno'];
			$tmp[$i]['billno'] = $row['billno'];
			$tmp[$i]['billdt'] = $row['billdt'];
			$tmp[$i]['arrivaldt'] = $row['arrivaldt'];
			$tmp[$i]['totaldiscount'] = $row['totaldiscount'];
			$tmp[$i]['totalamount'] = $row['totalamount'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['city'] = $row['city'];
			$tmp[$i]['gstno'] = $row['gstno'];
			$tmp[$i]['rawmatid'] = $row['rawmatid'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['rate'] = $row['rate'];
			$tmp[$i]['cgst'] = $row['cgst'];
			$tmp[$i]['sgst'] = $row['sgst'];
			$tmp[$i]['igst'] = $row['igst'];
			$tmp[$i]['discount'] = $row['discount'];
			$tmp[$i]['amount'] = $row['amount'];
			$tmp[$i]['rawmatname'] = $row['rawmatname'];
			$tmp[$i]['hsncode'] = $row['hsncode'];
			$tmp[$i]['roundoff'] = $row['roundoff'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: reports_purchases.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: reports_purchases.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getFromToPurchasesForAccounts"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT pp.*, cm.*, pm.* FROM `purchase_payments` pp, `client_master` cm, `paymode_master` pm WHERE pp.`clientid`=cm.`clientid` AND pp.`paymodeid`=pm.`paymodeid` AND `paydate` BETWEEN '$fromdt' AND '$todt'";
	$result = $conn->query($sql);
	$tmp = array();
	$data = array();
	$i = 0;
	while($row = $result->fetch_array())
	{
		$tmp[$i]["purchpayid"] = $row["purchpayid"];
		$tmp[$i]["paydate"] = $row["paydate"];
		$tmp[$i]["amount"] = $row["amount"];
		$tmp[$i]["particulars"] = $row["particulars"];
		$tmp[$i]["paymode"] = $row["paymode"];
		$tmp[$i]["name"] = $row["name"];
		$i++;
	}


	if(count($tmp)>0){
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: reports_purchases.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: reports_purchases.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getFromToPurchaseReturns"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT prts.*, pm.`purcmastid`,pm.`clientid`,pm.`billno`,pm.`billdt`,cm.`name`,pr.`rawmatid`, rm.`name` as `rawmatname` FROM `purchase_returns` prts, `purchase_master` pm, `client_master` cm, `purchase_register` pr, `raw_material_master` rm WHERE prts.`purcmastid`=pm.`purcmastid` AND pm.`clientid`=cm.`clientid` AND pr.`purcmastid`=pm.`purcmastid` AND pr.`rawmatid`=rm.`rawmatid` AND `returnsdate` BETWEEN '$fromdt' AND '$todt' ORDER BY prts.`returnsdate`";
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
			$tmp[$i]['purchreturnsid'] = $row['purchreturnsid'];
			$tmp[$i]['debitnoteno'] = $row['debitnoteno'];
			$tmp[$i]['returnsdate'] = $row['returnsdate'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['amount'] = $row['amount'];
			$tmp[$i]['particulars'] = $row['particulars'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['billno'] = $row['billno'];
			$tmp[$i]['billdt'] = $row['billdt'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['rawmatid'] = $row['rawmatid'];
			$tmp[$i]['rawmatname'] = $row['rawmatname'];
			$tmp[$i]['purcmastid'] = $row['purcmastid'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: reports_purchases.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: reports_purchases.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}
?>