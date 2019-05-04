<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "addClient"){
    $data = json_decode(file_get_contents("php://input"));
	$fname = mysqli_real_escape_string($conn,$data->fname);
	$cno = $data->cno;
	$gstno = $data->gstno;
	$email = $data->email;
	$cperson1 = $data->cperson1;
	$cno1 = $data->cno1;
	$cperson2 = $data->cperson2;
	$cno2 = $data->cno2;
	$city = $data->city;
	$state = $data->state;
	$address = mysqli_real_escape_string($conn,$data->address);
    $ctype = $data->ctype;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        //Status: 1 == 'active'
		$sql = "INSERT INTO `client_master`(`name`, `address`, `contactno`, `contactperson1`, `contactno1`, `contactperson2`, `contactno2`, `email`, `city`, `state`, `gstno`, `type`, `status`) VALUES ('$fname','$address','$cno','$cperson1','$cno1','$cperson2','$cno2','$email','$city','$state','$gstno',$ctype,1)";
        $result = $conn->query($sql);
        $userid = $conn->insert_id;
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $userid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getClientCities"){
	$sql = "SELECT DISTINCT(`city`) FROM `client_master` ORDER BY `city`";
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
			$tmp[$i]['city'] = $row['city'];
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

if($action == "getClientStates"){
	$sql = "SELECT DISTINCT(`state`) FROM `client_master` ORDER BY `state`";
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
			$tmp[$i]['state'] = $row['state'];
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

if($action == "getAllClients"){
	$clienttype = ($_GET["clienttype"]);
	$sql = "SELECT * FROM `client_master` WHERE `type`=$clienttype AND `status`=1 ORDER BY `name`";
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
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['address'] = $row['address'];
			$tmp[$i]['contactno'] = $row['contactno'];
			$tmp[$i]['contactperson1'] = $row['contactperson1'];
			$tmp[$i]['contactno1'] = $row['contactno1'];
			$tmp[$i]['contactperson2'] = $row['contactperson2'];
			$tmp[$i]['contactno2'] = $row['contactno2'];
			$tmp[$i]['email'] = $row['email'];
			$tmp[$i]['city'] = $row['city'];
			$tmp[$i]['state'] = $row['state'];
			$tmp[$i]['gstno'] = $row['gstno'];
			$tmp[$i]['type'] = $row['type'];
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

if($action == "getClientDetails"){
	$clienttype = ($_GET["clienttype"]);
	$clientid = ($_GET["clientid"]);
	$sql = "SELECT * FROM `client_master` WHERE `type`=$clienttype AND `clientid`=$clientid AND `status`=1 ORDER BY `name`";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($result){
		$tmp['clientid'] = $row['clientid'];
		$tmp['name'] = $row['name'];
		$tmp['address'] = $row['address'];
		$tmp['contactno'] = $row['contactno'];
		$tmp['contactperson1'] = $row['contactperson1'];
		$tmp['contactno1'] = $row['contactno1'];
		$tmp['contactperson2'] = $row['contactperson2'];
		$tmp['contactno2'] = $row['contactno2'];
		$tmp['email'] = $row['email'];
		$tmp['city'] = $row['city'];
		$tmp['state'] = $row['state'];
		$tmp['gstno'] = $row['gstno'];
		$tmp['type'] = $row['type'];
		
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

if($action == "updateClient"){
    $data = json_decode(file_get_contents("php://input"));
	$fname = mysqli_real_escape_string($conn,$data->fname);
	$clientid = $data->clientid;
	$cno = $data->cno;
	$gstno = $data->gstno;
	$email = $data->email;
	$cperson1 = $data->cperson1;
	$cno1 = $data->cno1;
	$cperson2 = $data->cperson2;
	$cno2 = $data->cno2;
	$city = $data->city;
	$state = $data->state;
	$address = mysqli_real_escape_string($conn,$data->address);
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        //Status: 1 == 'active'
		$sql = "UPDATE `client_master` SET `name`='$fname',`address`='$address',`contactno`='$cno',`contactperson1`='$cperson1',`contactno1`='$cno1',`contactperson2`='$cperson2',`contactno2`='$cno2',`email`='$email',`city`='$city',`state`='$state',`gstno`='$gstno' WHERE `clientid`=$clientid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $clientid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getClientPurchaseOpeningBal"){
	$fromdt = ($_GET["fromdt"]);
	$todt = ($_GET["todt"]);
	$clientid = ($_GET["clientid"]);
	$prevfromdt = ($_GET["prevfromdt"]);
	$prevtodt = ($_GET["prevtodt"]);
	$sql = "SELECT * FROM `client_openingbal` WHERE `clientid`=$clientid AND `baldate` BETWEEN '$fromdt' AND '$todt'";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($row['openbalid'] == null){
		$sqlprevpp = "SELECT SUM(`amount`) as amount FROM `purchase_payments` WHERE clientid = $clientid AND `paydate` BETWEEN '$prevfromdt' AND '$prevtodt'";
		$resultprevpp = $conn->query($sqlprevpp);
		$rowprevpp = $resultprevpp->fetch_array(MYSQLI_ASSOC);
		
		$sqlprevpm = "SELECT SUM(`totalamount`) as totalamount FROM `purchase_master` WHERE clientid = $clientid AND `billdt` BETWEEN '$prevfromdt' AND '$prevtodt'";
		$resultprevpm = $conn->query($sqlprevpm);
		$rowprevpm = $resultprevpm->fetch_array(MYSQLI_ASSOC);
		//SELECT SUM(`totalamount`) as totalamount FROM `purchase_master` WHERE `clientid` = 3 AND `billdt` BETWEEN '1554057000000' AND '1556276006131'

		if($rowprevpp["amount"] and $rowprevpm["totalamount"]){
			//amount balance remained = Purchases amount - amount we paid
			$amtbal = floatval($rowprevpm["totalamount"]) - floatval($rowprevpp["amount"]);
			$sqlins = "INSERT INTO `client_openingbal`(`clientid`, `openingbal`, `baldate`) VALUES ($clientid,'$amtbal', '$fromdt')";
			$resultins = $conn->query($sqlins);
		}
		else{
			$sqlins = "INSERT INTO `client_openingbal`(`clientid`, `openingbal`, `baldate`) VALUES ($clientid,'0', '$fromdt')";
			$resultins = $conn->query($sqlins);
		}
		$sql = "SELECT * FROM `client_openingbal` WHERE `clientid`=$clientid AND `baldate` BETWEEN '$fromdt' AND '$todt'";
		$result = $conn->query($sql);
		$row = $result->fetch_array(MYSQLI_ASSOC);
	}

	if($result && $row){
		$tmp['openbalid'] = $row['openbalid'];
		$tmp['clientid'] = $row['clientid'];
		$tmp['openingbal'] = $row['openingbal'];
		$tmp['baldate'] = $row['baldate'];
		
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

if($action == "getClientSaleOpeningBal"){
	$fromdt = ($_GET["fromdt"]);
	$todt = ($_GET["todt"]);
	$clientid = ($_GET["clientid"]);
	$prevfromdt = ($_GET["prevfromdt"]);
	$prevtodt = ($_GET["prevtodt"]);
	$sql = "SELECT * FROM `client_openingbal` WHERE `clientid`=$clientid AND `baldate` BETWEEN '$fromdt' AND '$todt'";
	$result = $conn->query($sql);
	$row = $result->fetch_array(MYSQLI_ASSOC);

	$tmp = array();
	$data = array();

	if($row['openbalid'] == null){
		$sqlprevpp = "SELECT SUM(`amount`) as amount FROM `order_payments` WHERE clientid = $clientid AND `paydate` BETWEEN '$prevfromdt' AND '$prevtodt'";
		$resultprevpp = $conn->query($sqlprevpp);
		$rowprevpp = $resultprevpp->fetch_array(MYSQLI_ASSOC);
		
		$sqlprevpm = "SELECT SUM(`totalamount`) as totalamount FROM `order_taxinvoice` WHERE clientid = $clientid AND `billdt` BETWEEN '$prevfromdt' AND '$prevtodt'";
		$resultprevpm = $conn->query($sqlprevpm);
		$rowprevpm = $resultprevpm->fetch_array(MYSQLI_ASSOC);
		//SELECT SUM(`totalamount`) as totalamount FROM `purchase_master` WHERE `clientid` = 3 AND `billdt` BETWEEN '1554057000000' AND '1556276006131'

		if($rowprevpp["amount"] and $rowprevpm["totalamount"]){
			//amount balance remained = Purchases amount - amount we paid
			$amtbal = floatval($rowprevpm["totalamount"]) - floatval($rowprevpp["amount"]);
			$sqlins = "INSERT INTO `client_openingbal`(`clientid`, `openingbal`, `baldate`) VALUES ($clientid,'$amtbal', '$fromdt')";
			$resultins = $conn->query($sqlins);
		}
		else{
			$sqlins = "INSERT INTO `client_openingbal`(`clientid`, `openingbal`, `baldate`) VALUES ($clientid,'0', '$fromdt')";
			$resultins = $conn->query($sqlins);
		}
		$sql = "SELECT * FROM `client_openingbal` WHERE `clientid`=$clientid AND `baldate` BETWEEN '$fromdt' AND '$todt'";
		$result = $conn->query($sql);
		$row = $result->fetch_array(MYSQLI_ASSOC);
	}

	if($result && $row){
		$tmp['openbalid'] = $row['openbalid'];
		$tmp['clientid'] = $row['clientid'];
		$tmp['openingbal'] = $row['openingbal'];
		$tmp['baldate'] = $row['baldate'];
		
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

if($action == "updateClientOpeningBalance"){
    $data = json_decode(file_get_contents("php://input"));
	$openbalid = $data->openbalid;
	$clientid = $data->clientid;
	$openbal = $data->openbal;
	$baldate = $data->baldate;

    if($_SERVER['REQUEST_METHOD']=='POST'){
        //Status: 1 == 'active'
		$sql = "UPDATE `client_openingbal` SET `openingbal`='$openbal',`baldate`='$baldate' WHERE `openbalid`=$openbalid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $openbalid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data1);
}
?>