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
	$sql = "SELECT * FROM `production_batch_master`";
	$result = $conn->query($sql);
	while($row = $result->fetch_array())
	{
		$rows[] = $row;
	}

	$tmp = array();
	$data = array();
	$i = 0;

	if(count($rows)>0){
		$data["status"] = 200;
		$data["data"] = count($rows);
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

				//Insert into Stock Register
				$sqlins="INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ($stkid,'OUT','$qtytoadd','$todaytm', 'Updated Stock, created new batch, batchid: $prodid')";
				$resultqty = $conn->query($sqlins);

				//Insert into Production Batch Register
				$sqlbatchins="INSERT INTO `production_batch_register`(`rawmatid`, `rawmatqty`, `batchid`) VALUES ($rawmatid,'$qtytoadd','$batchid')";
				$resultbatchqty = $conn->query($sqlbatchins);
			}
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
	$sql = "SELECT * FROM `production_batch_master` WHERE `status`='open'";
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