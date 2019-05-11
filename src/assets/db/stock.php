<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "newProductInStock"){
    $data = json_decode(file_get_contents("php://input"));
	$prodid = $data->prodid;
	$moddt = $data->moddt;
	$openbal = $data->openbal;
	$openbaldt = $data->openbaldt;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `stock_master`(`prodid`, `quantity`, `lastmodifieddate`) VALUES ($prodid,'$openbal','$moddt')";
        $result = $conn->query($sql);
		$stkid = $conn->insert_id;
		
		//Add opening Stock in Stock Register
		$sqlreg = "INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ('$stkid','IN','$openbal','$openbaldt','Opening Balance')";
        $resultreg = $conn->query($sqlreg);
        $stkregid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $stkid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "newRawMaterialInStock"){
    $data = json_decode(file_get_contents("php://input"));
	$rawmatid = $data->rawmatid;
	$moddt = $data->moddt;
	$openbal = $data->openbal;
	$openbaldt = $data->openbaldt;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `stock_master`(`rawmatid`, `quantity`, `lastmodifieddate`) VALUES ($rawmatid,'$openbal','$moddt')";
        $result = $conn->query($sql);
        $stkid = $conn->insert_id;
		//Add opening Stock in Stock Register
		$sqlreg = "INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ('$stkid','IN','$openbal','$openbaldt','Opening Balance')";
        $resultreg = $conn->query($sqlreg);
        $stkregid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $stkid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "updateStockRawMaterial"){
    $data = json_decode(file_get_contents("php://input"));
    $billdt = $data->billdt;
    $addedmaterials = $data->addedmaterials;
    $remark = $data->remark;
    $purchid = $data->purchid;

    for($i=0; $i<count($addedmaterials); $i++) {
        $rawmatid=$addedmaterials[$i]->rawmatid;
        $qty=$addedmaterials[$i]->qty;
        $sql = "SELECT `stockid`,`rawmatid`,`quantity` FROM `stock_master` WHERE `rawmatid`=$rawmatid";
        $result = $conn->query($sql);
        $row = $result->fetch_array(MYSQLI_ASSOC);
        $totalqty = floatval($row["quantity"]) + floatval($qty);

        $sqlupdt = "UPDATE `stock_master` SET `quantity`='$totalqty',`lastmodifieddate`='$billdt' WHERE `rawmatid`=$rawmatid";
        $resultqty = $conn->query($sqlupdt);

        $stkid = $row["stockid"];
        $sqlregins = "INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ($stkid,'IN','$qty','$billdt', '$remark')";
        $resultins = $conn->query($sqlregins);
    }

    $data1= array();
    if($result){
        $data1["status"] = 200;
        $data1["data"] = $stkid;
        header(' ', true, 200);
    }
    else{
        $data1["status"] = 204;
		header(' ', true, 204);
    }
    echo json_encode($data1);
}

if($action == "updateOpeningStock"){
    $data = json_decode(file_get_contents("php://input"));
    $stockid = $data->stockid;
    $quantity = $data->quantity;
    $stkdt = $data->stkdt;
    $openbaldt = $data->openbaldt;

	// $sqlupdt = "UPDATE `stock_master` SET `quantity`='$quantity',`lastmodifieddate`='$stkdt' WHERE `stockid`=$stockid";
	// $resultqty = $conn->query($sqlupdt);
	$sqlregupdt = "UPDATE `stock_register` SET `quantity`='$quantity',`date`='$openbaldt' WHERE `stockid`=$stockid AND `remarks`='Opening Balance'";
	$resultregqty = $conn->query($sqlregupdt);
	
    $data1= array();
    if($result){
        $data1["status"] = 200;
        $data1["data"] = $stockid;
        header(' ', true, 200);
    }
    else{
        $data1["status"] = 204;
		header(' ', true, 204);
    }
    echo json_encode($data1);
}

if($action == "getRawMatOpeningStock"){
	$rawmatid = ($_GET["rawmatid"]);
	$fromdt = ($_GET["fromdt"]);
	$todt = ($_GET["todt"]);
	$sql = "SELECT * FROM `stock_register` WHERE `remarks`='Opening Balance' AND `stockid`= (SELECT `stockid` FROM `stock_master` WHERE `rawmatid`= $rawmatid) AND `date` BETWEEN '$fromdt' AND '$todt'";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result && $row){
		$tmp['stockid'] = $row['stockid'];
		$tmp['quantity'] = $row['quantity'];
		$tmp['date'] = $row['date'];
		
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

if($action == "getProductStock"){
	$prodid = ($_GET["prodid"]);
	$sql = "SELECT * FROM `stock_master` WHERE `prodid`=$prodid";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result){
		$tmp['stockid'] = $row['stockid'];
		$tmp['prodid'] = $row['prodid'];
		$tmp['quantity'] = $row['quantity'];
		
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

if($action == "getRawMatStock"){
	$rawmatid = ($_GET["rawmatid"]);
	$sql = "SELECT * FROM `stock_master` WHERE `rawmatid`=$rawmatid";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result){
		$tmp['stockid'] = $row['stockid'];
		$tmp['rawmatid'] = $row['rawmatid'];
		$tmp['quantity'] = $row['quantity'];
		
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

if($action == "getProdOpeningStock"){
	$prodid = ($_GET["prodid"]);
	$fromdt = ($_GET["fromdt"]);
	$todt = ($_GET["todt"]);
	$sql = "SELECT * FROM `stock_register` WHERE `remarks`='Opening Balance' AND `stockid`= (SELECT `stockid` FROM `stock_master` WHERE `prodid`= $prodid) AND `date` BETWEEN '$fromdt' AND '$todt'";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result && $row){
		$tmp['stockid'] = $row['stockid'];
		$tmp['quantity'] = $row['quantity'];
		$tmp['date'] = $row['date'];
		
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

if($action == "getStockHistory"){
	$stockid = $_GET["stockid"];
	$fromdt = ($_GET["fromdt"]);
	$todt = ($_GET["todt"]);
	
	$sql = "SELECT * FROM `stock_register` WHERE `stockid`=$stockid AND `date` BETWEEN '$fromdt' AND '$todt' ORDER BY `date`";
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
			$tmp[$i]['stockregid'] = $row['stockregid'];
			$tmp[$i]['stockid'] = $row['stockid'];
			$tmp[$i]['INorOUT'] = $row['INorOUT'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['date'] = $row['date'];
			$tmp[$i]['remarks'] = $row['remarks'];
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

//Check if there is any opening balance created for current financial year
if($action == "checkRawMatOpenStockForCrntFinanYear"){
	$rawmatid = $_GET["rawmatid"];
	$fromdt = $_GET["fromdt"];
	$todt = $_GET["todt"];
	$sql = "SELECT * FROM `stock_register` WHERE `remarks`='Opening Balance' AND `stockid`= (SELECT `stockid` FROM `stock_master` WHERE `rawmatid`= $rawmatid) AND `date` BETWEEN '$fromdt' AND '$todt'";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result and $row){
		$tmp['stockid'] = $row['stockid'];
		$tmp['quantity'] = $row['quantity'];
		$tmp['date'] = $row['date'];
		
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

if($action == "updateCurrentStock"){
    $data = json_decode(file_get_contents("php://input"));
    $stockid = $data->stockid;
    $quantity = $data->quantity;
    $openbaldt = $data->openbaldt;

	$sql = "SELECT * FROM `stock_master` WHERE `stockid`=$stockid";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);
	$totalqty = floatval($row["quantity"]) + floatval($quantity);
	$sqlregupdt = "UPDATE `stock_master` SET `quantity`='$totalqty',`lastmodifieddate`='$openbaldt' WHERE `stockid`=$stockid";
	$resultregqty = $conn->query($sqlregupdt);
	
    $data1= array();
    if($result){
        $data1["status"] = 200;
        $data1["data"] = $stockid;
        header(' ', true, 200);
    }
    else{
        $data1["status"] = 204;
		header(' ', true, 204);
    }
    echo json_encode($data1);
}

if($action == "updateStockUsingProdid"){
    $data = json_decode(file_get_contents("php://input"));
    $prodid = $data->prodid;
    $quantity = $data->quantity;
    $qtydt = $data->qtydt;

    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "SELECT * FROM `stock_master` WHERE `prodid`=$prodid";
		$result = $conn->query($sql);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		$totalqty = floatval($row["quantity"]) + floatval($quantity);
		$sqlregupdt = "UPDATE `stock_master` SET `quantity`='$totalqty',`lastmodifieddate`='$qtydt' WHERE `prodid`=$prodid";
		$resultregqty = $conn->query($sqlregupdt);
	}

    $data1= array();
    if($result){
        $data1["status"] = 200;
        $data1["data"] = $row["stockid"];
        header(' ', true, 200);
    }
    else{
        $data1["status"] = 204;
		header(' ', true, 204);
    }
    echo json_encode($data1);
}

if($action == "updateStockRegQuantity"){
    $data = json_decode(file_get_contents("php://input"));
    $stockid = $data->stockid;
    $quantity = $data->quantity;
    $manufacdate = $data->manufacdate;
    $newdate = $data->newdate;

    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sqlregupdt = "UPDATE `stock_register` SET `quantity`='$quantity', `date`='$newdate' WHERE `stockid`=$stockid AND `date`=$manufacdate";
		$resultregqty = $conn->query($sqlregupdt);
	}

    $data1= array();
    if($resultregqty){
        $data1["status"] = 200;
        $data1["data"] = $stockid;
        header(' ', true, 200);
    }
    else{
        $data1["status"] = 204;
		header(' ', true, 204);
    }
    echo json_encode($data1);
}


if($action == "getStockidFromRawMatId"){
	$rawmatid = $_GET["rawmatid"];
	$sql = "SELECT `stockid`, `quantity` FROM `stock_master` WHERE `rawmatid`=$rawmatid";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result && $row){
		$tmp['stockid'] = $row['stockid'];
		$tmp['quantity'] = $row['quantity'];
		
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