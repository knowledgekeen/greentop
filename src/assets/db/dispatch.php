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
    $dispatchid = -1;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        // Insert into `dispatch_register`
        $sql = "INSERT INTO `dispatch_register`(`orderid`, `dispatchdate`, `dcno`, `vehicalno`) VALUES ($orderid, '$dispdate', '$dcno', '$vehicalno')";
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
?>