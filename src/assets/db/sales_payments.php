<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "getAllOrderMastPayments"){
    $clientid= $_GET["clientid"];
    $fromdt= $_GET["fromdt"];
    $todt= $_GET["todt"];
	$sql = "SELECT * FROM `order_master` WHERE `clientid`=$clientid AND `orderdt` BETWEEN '$fromdt' AND '$todt'";
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
			$tmp[$i]['orderid'] = $row['orderid'];
			$tmp[$i]['orderno'] = $row['orderno'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['totalamount'] = $row['totalamount'];
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

if($action == "getAllOrderPayments"){
    $clientid= $_GET["clientid"];
    $fromdt= $_GET["fromdt"];
    $todt= $_GET["todt"];
	$sql = "SELECT op.`orderpayid`, op.`paydate`, op.`clientid`, op.`amount`, op.`paymodeid`, op.`particulars`, pm.paymode FROM `order_payments` op, `paymode_master` pm WHERE pp.`paymodeid`=pm.`paymodeid` AND `clientid`=$clientid AND `paydate` BETWEEN '$fromdt' AND '$todt'";
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
			$tmp[$i]['orderpayid'] = $row['orderpayid'];
			$tmp[$i]['paydate'] = $row['paydate'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['amount'] = $row['amount'];
			$tmp[$i]['paymodeid'] = $row['paymodeid'];
			$tmp[$i]['particulars'] = $row['particulars'];
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
?>