<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "saveBillDetails"){
    $data = json_decode(file_get_contents("php://input"));
    $orderid = $data->orderid;
    $clientid = $data->clientid;
    $billno = $data->billno;
    $billdt = $data->billdt;
    $amount = $data->amount;
    $discount = $data->discount;
    $rate = $data->rate;
    $cgst = $data->cgst;
    $sgst = $data->sgst;
    $igst = $data->igst;
    $roundoff = $data->roundoff;
    $totalamount = $data->totalamount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `order_taxinvoice`(`orderid`, `clientid`, `billno`, `billdt`, `amount`, `discount`, `rate`, `cgst`, `sgst`, `igst`, `roundoff`, `totalamount`) VALUES ($orderid,$clientid,'$billno','$billdt','$amount','$discount','$rate','$cgst','$sgst','$igst','$roundoff', '$totalamount')";
        $result = $conn->query($sql);
        $billid = $conn->insert_id;

        //Closing order once billing is done
        $sqlupt = "UPDATE `order_master` SET `status`='closed' WHERE `orderid`=$orderid";
        $resultupt = $conn->query($sqlupt);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $billid;
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getLastBillId"){
    $sql = "SELECT `billno` FROM `order_taxinvoice` ORDER BY `otaxinvoiceid` DESC LIMIT 1";
    $result = $conn->query($sql);
    $row = $result->fetch_array(MYSQLI_ASSOC);

    if($result && $row['billno']){
        $data["status"] = 200;
		$data["data"] = $row['billno'];
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "getInvoicesFromToDt"){
	$fromdt = $_GET["fromdt"];
	$todt = $_GET["todt"];
	$sql = "SELECT ot.`otaxinvoiceid`,ot.`orderid`,ot.`clientid`,ot.`billno`,ot.`billdt`,ot.`amount`,ot.`discount`,ot.`rate`,ot.`cgst`,ot.`sgst`,ot.`igst`,ot.`roundoff`,ot.`totalamount`, om.`orderno`,om.`orderdt`,om.`prodid`,om.`quantity`, pm.`prodname`, cm.`name`,dr.`dcno` FROM `order_taxinvoice` ot, `order_master` om, `product_master` pm, `client_master` cm, `dispatch_register` dr WHERE om.`status`='closed' AND om.`prodid`=pm.`prodid` AND ot.`orderid`=om.`orderid` AND ot.`clientid`=cm.`clientid` AND ot.`orderid` = dr.`orderid` AND ot.`billdt` BETWEEN '$fromdt' AND '$todt'";
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
			$tmp[$i]['otaxinvoiceid'] = $row['otaxinvoiceid'];
			$tmp[$i]['billno'] = $row['billno'];
			$tmp[$i]['billdt'] = $row['billdt'];
			$tmp[$i]['amount'] = $row['amount'];
            $tmp[$i]['discount'] = $row['discount'];
            $tmp[$i]['rate'] = $row['rate'];
            $tmp[$i]['cgst'] = $row['cgst'];
            $tmp[$i]['sgst'] = $row['sgst'];
            $tmp[$i]['igst'] = $row['igst'];
            $tmp[$i]['roundoff'] = $row['roundoff'];
            $tmp[$i]['totalamount'] = $row['totalamount'];
			$tmp[$i]['orderid'] = $row['orderid'];
			$tmp[$i]['orderno'] = $row['orderno'];
			$tmp[$i]['orderdt'] = $row['orderdt'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['prodname'] = $row['prodname'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['dcno'] = $row['dcno'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "updateBillDetails"){
    $data = json_decode(file_get_contents("php://input"));
    $otaxinvoiceid = $data->otaxinvoiceid;
    $billdt = $data->billdt;
    $amount = $data->amount;
    $discount = $data->discount;
    $rate = $data->rate;
    $cgst = $data->cgst;
    $sgst = $data->sgst;
    $igst = $data->igst;
    $roundoff = $data->roundoff;
    $totalamount = $data->totalamount;

   	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `order_taxinvoice` SET `billdt`='$billdt',`amount`='$amount',`discount`='$discount',`rate`='$rate',`cgst`='$cgst',`sgst`='$sgst',`igst`='$igst',`roundoff`='$roundoff',`totalamount`='$totalamount' WHERE `otaxinvoiceid`=$otaxinvoiceid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $otaxinvoiceid;
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: taxinvoice.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}
?>