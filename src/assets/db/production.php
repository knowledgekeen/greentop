<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "getAllProdRawmats"){
	$prodid=$_GET["prodid"];
	$sql = "SELECT pr.`prodrawid`,pr.`prodid`,pr.`rawmatid`, pr.`defquantity`, rm.`name`, s.`quantity`, s.`stockid` FROM `product_rawmat_register` pr, `raw_material_master` rm, `stock_master` s WHERE pr.`prodid`=$prodid AND pr.`rawmatid`=rm.`rawmatid` AND pr.`rawmatid`=s.`rawmatid`";
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
			$tmp[$i]['prodrawid'] = $row['prodrawid'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['rawmatid'] = $row['rawmatid'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['defquantity'] = $row['defquantity'];
			$tmp[$i]['stockid'] = $row['stockid'];
			$i++;
		}

		//get stock of product
		$tmp1 = array();
		$sqlstk="SELECT `stockid`,`quantity` FROM `stock_master` WHERE `prodid`=$prodid";
		$resultstk = $conn->query($sqlstk);
		$rowstk = $resultstk->fetch_array(MYSQLI_ASSOC);

		$tmp1["quantity"]= $rowstk["quantity"];
		$tmp1["stockid"]= $rowstk["stockid"];
		$data["status"] = 200;
		$data["data"] = $tmp;
		$data["stock"] = $tmp1;
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "addProdRawMaterial"){
    $data = json_decode(file_get_contents("php://input"));
    $prodid = $data->prodid;
    $rawmatid = $data->rawmatid;
    $defqty = $data->defqty;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
			$sql = "INSERT INTO `product_rawmat_register`(`prodid`, `rawmatid`, `defquantity`) VALUES ($prodid, $rawmatid, '$defqty')";
			$result = $conn->query($sql);
			$prodid = $conn->insert_id;
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
    
}

if($action == "getTodaysProductionBatch"){
	//$batchid = $_GET["batchid"];
	$sql = "SELECT `batchmastid` FROM `production_batch_master` ORDER BY `batchmastid` DESC LIMIT 1";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();
	$i = 0;

	if($result){
		$data["status"] = 200;
		$data["data"] = $row["batchmastid"];
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "addProductionBatch"){
    $data = json_decode(file_get_contents("php://input"));
    $batchid = $data->batchid;
    $prodid = $data->prodid;
    $prodtime = $data->prodtime;
    $todaytm = $data->todaytm;
    $qtyproduced = $data->qtyproduced;
    $allrawmat = $data->allrawmat;
		$finalstk = $data->finalstk;
		$stockid = $data->stockid;
	
    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `production_batch_master`(`batchid`, `prodid`, `qtyproduced`, `qtyremained`,`manufacdate`, `status`) VALUES ('$batchid',$prodid,'$qtyproduced','$qtyproduced','$prodtime','open')";
		$result = $conn->query($sql);
		$prodid = $conn->insert_id;
		if($result){
			
			//Updating Stock Master for GTO Product
			$sqlprodupdt="UPDATE `stock_master` SET `quantity`='$finalstk',`lastmodifieddate`='$todaytm' WHERE `stockid`=$stockid";
			$resultprodqty = $conn->query($sqlprodupdt);
			
			for($i=0; $i<count($allrawmat); $i++) {
				$rawmatid = $allrawmat[$i]->rawmatid;
				$qtyrem = $allrawmat[$i]->qtyremained;
				$qtytoadd = $allrawmat[$i]->qty;
				$stkid= $allrawmat[$i]->stockid;

				//Updating Stock Master for raw materials
				$sqlupdt="UPDATE `stock_master` SET `quantity`='$qtyrem',`lastmodifieddate`='$todaytm' WHERE `stockid`=$stkid";
				$resultqty = $conn->query($sqlupdt);

				//Insert into Stock Register for Raw Materials
				$sqlins="INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ($stkid,'OUT','$qtytoadd','$prodtime', 'Updated Stock, created new batch, batchid: $batchid')";
				$resultqty = $conn->query($sqlins);

				//Insert into Production Batch Register
				$sqlbatchins="INSERT INTO `production_batch_register`(`rawmatid`, `rawmatqty`, `batchid`) VALUES ($rawmatid,'$qtytoadd','$batchid')";
				$resultbatchqty = $conn->query($sqlbatchins);
			}//For Loop closed

			//Insert into Stock Register For Finished Product
			$sqlins="INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ($stockid,'IN','$qtyproduced','$prodtime', 'Updated Stock, created new batch, batchid: $batchid')";
			$resultqty = $conn->query($sqlins);
		}
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}
	echo json_encode($data1);

}

if($action == "saveEditRawMaterial"){
	$data = json_decode(file_get_contents("php://input"));
	$prodid = $data->prodid;
	$rawmatid = $data->rawmatid;
	$defqty = $data->defqty;
	
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `product_rawmat_register` SET `defquantity`='$defqty' WHERE `prodid`=$prodid AND `rawmatid`=$rawmatid";
		$result = $conn->query($sql);
	}
		$data1= array();
		if($result){
		$data1["status"] = 200;
		$data1["data"] = $rawmatid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "deassignRawMaterial"){
	$prodrawid = $_GET["prodrawid"];
	$sql = "DELETE FROM `product_rawmat_register` WHERE `prodrawid`=$prodrawid";
	$result = $conn->query($sql);
	$data1= array();
	if($result){
		$data1["status"] = 200;
		$data1["data"] = $prodrawid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getAllProductionBatches"){
	$sql = "SELECT pbm.`batchid`, pbm.`prodid`, pbm.`qtyproduced`, pbm.`qtyremained`, pbm.`manufacdate`, pm.`prodname` FROM `production_batch_master` pbm, `product_master` pm WHERE pbm.`prodid`=pm.`prodid` AND pbm.`status`='open'";
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
			$tmp[$i]['batchid'] = $row['batchid'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['qtyproduced'] = $row['qtyproduced'];
			$tmp[$i]['qtyremained'] = $row['qtyremained'];
			$tmp[$i]['manufacdate'] = $row['manufacdate'];
			$tmp[$i]['prodname'] = $row['prodname'];
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

if($action == "getProductionBatchesFromToDt"){
	$fromdt = $_GET["fromdt"];
	$todt = $_GET["todt"];
	$sql = "SELECT pbm.`batchid`, pbm.`prodid`, pbm.`qtyproduced`, pbm.`qtyremained`, pbm.`manufacdate`, pm.`prodname` FROM `production_batch_master` pbm, `product_master` pm WHERE pbm.`prodid`=pm.`prodid` AND pbm.`status`='open' AND pbm.`manufacdate` BETWEEN '$fromdt' AND '$todt'";
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
			$tmp[$i]['batchid'] = $row['batchid'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['qtyproduced'] = $row['qtyproduced'];
			$tmp[$i]['qtyremained'] = $row['qtyremained'];
			$tmp[$i]['manufacdate'] = $row['manufacdate'];
			$tmp[$i]['prodname'] = $row['prodname'];
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

if($action == "getProductionBatchDetails"){
	$batchid = $_GET["batchid"];
	$sql = "SELECT pbr.`prodregid`,pbr.`rawmatid`,pbr.`rawmatqty`, rm.`name` FROM `production_batch_register` pbr, `raw_material_master` rm WHERE pbr.`batchid`=$batchid AND pbr.`rawmatid`=rm.`rawmatid`";
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
			$tmp[$i]['prodregid'] = $row['prodregid'];
			$tmp[$i]['rawmatid'] = $row['rawmatid'];
			$tmp[$i]['rawmatqty'] = $row['rawmatqty'];
			$tmp[$i]['name'] = $row['name'];
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

if($action == "updateProductionMaster"){
	$data = json_decode(file_get_contents("php://input"));
	$batchid = $data->batchid;
	$quantity = $data->quantity;
	$manufacdate = $data->manufacdate;
	
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `production_batch_master` SET `qtyproduced`='$quantity', `qtyremained`='$quantity',`manufacdate`='$manufacdate' WHERE `batchid`=$batchid";
		$result = $conn->query($sql);
	}
	$data1= array();
	if($result){
		$data1["status"] = 200;
		$data1["data"] = $batchid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "addHistoricBatch"){
	$data = json_decode(file_get_contents("php://input"));
	$batchid = $data->batchid;
	$proddate = $data->proddate;
	$quantity = $data->quantity;
	$prodid = $data->prodid;
	
	if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "INSERT INTO `production_batch_master`(`batchid`, `prodid`, `qtyproduced`, `qtyremained`, `manufacdate`, `status`) VALUES ('$batchid',$prodid,'$quantity','$quantity','$proddate','open')";
		$result = $conn->query($sql);
		$pbmid = $conn->insert_id;
	}
	$data1= array();
	if($result){
	$data1["status"] = 200;
	$data1["data"] = $pbmid;
	header(' ', true, 200);
}
else{
	$data1["status"] = 204;
	header(' ', true, 204);
}

echo json_encode($data1);
	
}
?>