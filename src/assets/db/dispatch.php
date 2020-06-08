<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "dispatchOrder"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $addedbatches = $data->addedbatches;
    $advance = $data->advance;
    $amount = $data->amount;
    $dcno = $data->dcno;
    $dispdate = $data->dispdate;
    $orderid = $data->orderid;
    $prodid = $data->prodid;
    $quantity = $data->quantity;
    $paidon = $data->paidon;
    $partytrans = $data->partytrans;
    $rate = $data->rate;
    $vehicalno = $data->vehicalno;
    $todaydt = $data->todaydt;
    $remarks = $data->remarks;
    $packing = $data->packing;
    $noofbags = $data->noofbags;
    $deliveryremarks = mysqli_real_escape_string($conn,$data->deliveryremarks);;
    $dispatchid = -1;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        // Insert into `dispatch_register`
        $sql = "INSERT INTO `dispatch_register`(`orderid`, `dispatchdate`, `dcno`, `vehicalno`, `packingkgs`, `noofbags`, `deliveryremarks`) VALUES ($orderid, '$dispdate', '$dcno', '$vehicalno', '$packing','$noofbags','$deliveryremarks')";
        $result = $conn->query($sql);
        $dispatchid = $conn->insert_id;

        // Insert into `dispatch_transport`
        $_partytrans = mysqli_real_escape_string ($conn, $partytrans);
        $sqldt = "INSERT INTO `dispatch_transport`(`dispatchid`, `rate`, `amount`, `advance`, `paidondate`, `remarks`) VALUES ($dispatchid, '$rate', '$amount', '$advance', '$paidon', '$_partytrans')";
        $resultdt = $conn->query($sqldt);

        for($i=0; $i<count($addedbatches); $i++) {
            $batchmastid = $addedbatches[$i]->batchmastid;
            $batchid = $addedbatches[$i]->batchid;
            $selqty = $addedbatches[$i]->selqty;
            $qtyrem = $addedbatches[$i]->qtyrem;

            // Insert into `dispatches_batches`
            $sqldb = "INSERT INTO `dispatches_batches`(`dispatchid`, `batchmastid`, `quantity`) VALUES ($dispatchid, $batchmastid, $selqty)";
            $resultdb = $conn->query($sqldb);

            // Update into `production_batch_master`
            if((double)$qtyrem == 0){
                $sqlpbm = "UPDATE `production_batch_master` SET `qtyremained`='$qtyrem',`status`='closed' WHERE `batchmastid`=$batchmastid";
                $resultpbm = $conn->query($sqlpbm);
            }
            else{
                $sqlpbm = "UPDATE `production_batch_master` SET `qtyremained`='$qtyrem' WHERE `batchmastid`=$batchmastid";
                $resultpbm = $conn->query($sqlpbm);
            }
        }

        //Update Stock Master
        $sqlSM = "SELECT `stockid`,`quantity` FROM `stock_master` WHERE `prodid`=$prodid";
        $resultSM = $conn->query($sqlSM);
        $rowSM = $resultSM->fetch_array(MYSQLI_ASSOC);
        $stkid = $rowSM['stockid'];
        $qty = $rowSM['quantity'];
        $qtyremaining = (double)$qty - (double)$quantity;
        $sqlUptSM = "UPDATE `stock_master` SET `quantity`='$qtyremaining',`lastmodifieddate`='$todaydt' WHERE `prodid`=$prodid";
        $resultUptSM = $conn->query($sqlUptSM);

        //Insert Stock Register
        $sqlInsSM = "INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ($stkid,'OUT','$quantity','$dispdate', '$remarks')";
        $resultInsSM = $conn->query($sqlInsSM);
        
        //Update Order Master
        $sqlOM = "UPDATE `order_master` SET `status`='dispatched' WHERE `orderid`=$orderid";
        $resultOM = $conn->query($sqlOM);
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $dispatchid;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getBatchDispatches"){
	$headers = apache_request_headers();
	authenticate($headers);
    $batchmastid = $_GET['batchmastid'];
    $sql = "SELECT db.`dispbatid`,db.`dispatchid`,db.`batchmastid`,db.`quantity`, dr.`orderid`, dr.`dispatchdate`, dr.`dcno`, om.`orderno` FROM `dispatches_batches` db, `dispatch_register` dr,`order_master` om WHERE db.`batchmastid`=$batchmastid AND db.`dispatchid`=dr.`dispatchid` AND dr.orderid=om.orderid";
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
			$tmp[$i]['dispbatid'] = $row['dispbatid'];
			$tmp[$i]['dispatchid'] = $row['dispatchid'];
			$tmp[$i]['batchmastid'] = $row['batchmastid'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['orderid'] = $row['orderid'];
			$tmp[$i]['dispatchdate'] = $row['dispatchdate'];
			$tmp[$i]['dcno'] = $row['dcno'];
			$tmp[$i]['orderno'] = $row['orderno'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getDispatchBatches"){
	$headers = apache_request_headers();
	authenticate($headers);
    $dispatchid = $_GET['dispatchid'];
	$sql = "SELECT db.`dispbatid`,db.`quantity`,pbm.`batchid`,pbm.`manufacdate`,pbm.`status` FROM `dispatches_batches` db, `production_batch_master` pbm WHERE db.`dispatchid`=$dispatchid AND db.`batchmastid`=pbm.`batchmastid`";
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
			$tmp[$i]['dispbatid'] = $row['dispbatid'];
			$tmp[$i]['batchid'] = $row['batchid'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['manufacdate'] = $row['manufacdate'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getDispatchDetails"){
	$headers = apache_request_headers();
	authenticate($headers);
    $orderid = $_GET['orderid'];
	$sql = "SELECT * FROM `dispatch_register` WHERE `orderid`=$orderid";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result){		
        $tmp['dispatchid'] = $row['dispatchid'];
        $tmp['dispatchdate'] = $row['dispatchdate'];
        $tmp['dcno'] = $row['dcno'];
        $tmp['vehicalno'] = $row['vehicalno'];
		$data["status"] = 200;
		$data["data"] = $tmp;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getDeliveryChallanDetails"){
	$headers = apache_request_headers();
	authenticate($headers);
    $dcno = $_GET['dcno'];
	$sql = "SELECT dr.`dispatchid`,dr.`orderid`,dr.`dispatchdate`,dr.`dcno`,dr.`vehicalno`,dr.`packingkgs`,dr.`noofbags`,dr.`deliveryremarks`, om.`orderno`, om.`orderdt`, om.`clientid`, om.`prodid`, om.`quantity`, cm.`name`, cm.`address`, cm.`state`, cm.`gstno`, pm.`prodname`, pm.`hsncode`, oc.`consigneename`, oc.`contactperson`,oc.`contactnumber`, oc.`address` as `consigneeaddress`,oc.`state` as `consigneestate`, oc.`city` as `consigneecity`, oc.`deliveryperson`, oc.`deliveryaddress`, oc.`remarks` as `consigneestatus` FROM `dispatch_register` dr, `order_master` om, `client_master` cm, `product_master` pm, `order_consignees` oc WHERE dr.`dcno`='$dcno' AND dr.`orderid`=om.`orderid` AND om.`clientid`=cm.`clientid` AND om.`prodid`=pm.`prodid` AND dr.`orderid`=oc.`orderid`";
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
            $tmp[$i]['dispatchid'] = $row['dispatchid'];
            $tmp[$i]['orderid'] = $row['orderid'];
            $tmp[$i]['dispatchdate'] = $row['dispatchdate'];
            $tmp[$i]['dcno'] = $row['dcno'];
            $tmp[$i]['vehicalno'] = $row['vehicalno'];
            $tmp[$i]['packingkgs'] = $row['packingkgs'];
            $tmp[$i]['noofbags'] = $row['noofbags'];
            $tmp[$i]['deliveryremarks'] = $row['deliveryremarks'];
            $tmp[$i]['orderno'] = $row['orderno'];
            $tmp[$i]['orderdt'] = $row['orderdt'];
            $tmp[$i]['clientid'] = $row['clientid'];
            $tmp[$i]['prodid'] = $row['prodid'];
            $tmp[$i]['quantity'] = $row['quantity'];
            $tmp[$i]['name'] = $row['name'];
            $tmp[$i]['address'] = $row['address'];
            $tmp[$i]['state'] = $row['state'];
            $tmp[$i]['gstno'] = $row['gstno'];
            $tmp[$i]['prodname'] = $row['prodname'];
            $tmp[$i]['hsncode'] = $row['hsncode'];
            $tmp[$i]['consigneename'] = $row['consigneename'];
            $tmp[$i]['contactperson'] = $row['contactperson'];
            $tmp[$i]['contactnumber'] = $row['contactnumber'];
            $tmp[$i]['consigneeaddress'] = $row['consigneeaddress'];
            $tmp[$i]['consigneecity'] = $row['consigneecity'];
            $tmp[$i]['consigneestate'] = $row['consigneestate'];
            $tmp[$i]['deliveryperson'] = $row['deliveryperson'];
            $tmp[$i]['deliveryaddress'] = $row['deliveryaddress'];
            $tmp[$i]['consigneestatus'] = $row['consigneestatus'];

            $dispid = $row['dispatchid'];;
            $subsql = "SELECT db.`dispbatid`,db.`dispatchid`,db.`batchmastid`,db.`quantity`, pbm.`batchid` FROM `dispatches_batches` db, `production_batch_master` pbm WHERE db.`dispatchid`=$dispid AND db.`batchmastid`=pbm.`batchmastid`";
            $subrows = array();
            $subresult = $conn->query($subsql);
            while($subrow = $subresult->fetch_array())
            {
                $subrows[] = $subrow;
            }
            $subtmp = array();
            $subdata = array();
            $j = 0;
            if(count($subrows)>0){ 
                foreach($subrows as $subrow)
                {
                    $subtmp[$j] = $subrow["batchid"];
                    $j++;
                }
            }
            $tmp[$i]['batchdata'] = $subtmp;
            $i++;
        }
		$data["status"] = 200;
		$data["data"] = $tmp;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "getDeliveryChallanDetailsWithOrderno"){
	$headers = apache_request_headers();
	authenticate($headers);
    $dcno = $_GET['dcno'];
    $orderno = $_GET['orderno'];
	$sql = "SELECT dr.`dispatchid`,dr.`orderid`,dr.`dispatchdate`,dr.`dcno`,dr.`vehicalno`,dr.`packingkgs`,dr.`noofbags`,dr.`deliveryremarks`, om.`orderno`, om.`orderdt`, om.`clientid`, om.`prodid`, om.`quantity`, cm.`name`, cm.`address`, cm.`state`, cm.`gstno`, pm.`prodname`, pm.`hsncode`, oc.`consigneename`, oc.`contactperson`,oc.`contactnumber`, oc.`address` as `consigneeaddress`,oc.`state` as `consigneestate`, oc.`city` as `consigneecity`, oc.`deliveryperson`, oc.`deliveryaddress`, oc.`remarks` as `consigneestatus` FROM `dispatch_register` dr, `order_master` om, `client_master` cm, `product_master` pm, `order_consignees` oc WHERE dr.`dcno`=$dcno AND dr.`orderid`=om.`orderid` AND om.`clientid`=cm.`clientid` AND om.`prodid`=pm.`prodid` AND dr.`orderid`=oc.`orderid` AND om.`orderno`='$orderno'";
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
            $tmp[$i]['dispatchid'] = $row['dispatchid'];
            $tmp[$i]['orderid'] = $row['orderid'];
            $tmp[$i]['dispatchdate'] = $row['dispatchdate'];
            $tmp[$i]['dcno'] = $row['dcno'];
            $tmp[$i]['vehicalno'] = $row['vehicalno'];
            $tmp[$i]['packingkgs'] = $row['packingkgs'];
            $tmp[$i]['noofbags'] = $row['noofbags'];
            $tmp[$i]['deliveryremarks'] = $row['deliveryremarks'];
            $tmp[$i]['orderno'] = $row['orderno'];
            $tmp[$i]['orderdt'] = $row['orderdt'];
            $tmp[$i]['clientid'] = $row['clientid'];
            $tmp[$i]['prodid'] = $row['prodid'];
            $tmp[$i]['quantity'] = $row['quantity'];
            $tmp[$i]['name'] = $row['name'];
            $tmp[$i]['address'] = $row['address'];
            $tmp[$i]['state'] = $row['state'];
            $tmp[$i]['gstno'] = $row['gstno'];
            $tmp[$i]['prodname'] = $row['prodname'];
            $tmp[$i]['hsncode'] = $row['hsncode'];
            $tmp[$i]['consigneename'] = $row['consigneename'];
            $tmp[$i]['contactperson'] = $row['contactperson'];
            $tmp[$i]['contactnumber'] = $row['contactnumber'];
            $tmp[$i]['consigneeaddress'] = $row['consigneeaddress'];
            $tmp[$i]['consigneecity'] = $row['consigneecity'];
            $tmp[$i]['consigneestate'] = $row['consigneestate'];
            $tmp[$i]['deliveryperson'] = $row['deliveryperson'];
            $tmp[$i]['deliveryaddress'] = $row['deliveryaddress'];
            $tmp[$i]['consigneestatus'] = $row['consigneestatus'];

            $dispid = $row['dispatchid'];;
            $subsql = "SELECT db.`dispbatid`,db.`dispatchid`,db.`batchmastid`,db.`quantity`, pbm.`batchid` FROM `dispatches_batches` db, `production_batch_master` pbm WHERE db.`dispatchid`=6 AND db.`batchmastid`=pbm.`batchmastid`";
            $subresult = $conn->query($subsql);
            while($subrow = $subresult->fetch_array())
            {
                $subrows[] = $subrow;
            }
            $subtmp = array();
            $subdata = array();
            $j = 0;
            if(count($subrows)>0){ 
                foreach($subrows as $subrow)
                {
                    $subtmp[$j] = $subrow["batchid"];
                    $j++;
                }
            }
            $tmp[$i]['batchdata'] = $subtmp;
            $i++;
        }
		$data["status"] = 200;
		$data["data"] = $tmp;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "checkIfDCPresent"){
	$headers = apache_request_headers();
	authenticate($headers);
    $dcno = $_GET['dcno'];
    $sql = "SELECT * FROM `dispatch_register` WHERE `dcno`='$dcno'";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result && $row['dcno']){
        $tmp['dcno'] = $row['dcno'];
		$data["status"] = 200;
		$data["data"] = $tmp;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "checkIfDCPresentWithOrderNo"){
	$headers = apache_request_headers();
	authenticate($headers);
    $dcno = $_GET['dcno'];
    $orderno = $_GET['orderno'];
    $sql = "SELECT dr.`dispatchid`,dr.`dcno` FROM `dispatch_register` dr, `order_master` om WHERE dr.`dcno`='$dcno' AND om.`orderno`='$orderno' AND dr.`orderid`=om.`orderid`";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();
    if($result && $row['dispatchid']){
        $tmp['dispatchid'] = $row['dispatchid'];
        $tmp['dcno'] = $row['dcno'];
		$data["status"] = 200;
		$data["data"] = $tmp;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL;
        write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
        $log  = "File: dispatch.php - Method: ".$action.PHP_EOL.
        "Error message: ".$conn->error.PHP_EOL.
        "Data: ".json_encode($data).PHP_EOL;
        write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}
?>