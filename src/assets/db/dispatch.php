<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "dispatchOrder"){
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
            $batchid = $addedbatches[$i]->batchid;
            $selqty = $addedbatches[$i]->selqty;
            $qtyrem = $addedbatches[$i]->qtyrem;

            // Insert into `dispatches_batches`
            $sqldb = "INSERT INTO `dispatches_batches`(`dispatchid`, `batchid`, `quantity`) VALUES ($dispatchid, $batchid, $selqty)";
            $resultdb = $conn->query($sqldb);

            // Update into `production_batch_master`
            if((double)$qtyrem == 0){
                $sqlpbm = "UPDATE `production_batch_master` SET `qtyremained`='$qtyrem',`status`='closed' WHERE `batchid`=$batchid";
                $resultpbm = $conn->query($sqlpbm);
            }
            else{
                $sqlpbm = "UPDATE `production_batch_master` SET `qtyremained`='$qtyrem' WHERE `batchid`=$batchid";
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
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

?>