<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "getLastOrderId"){
    $sql = "SELECT `orderid` FROM `order_master` ORDER BY `orderid` DESC LIMIT 1";
    $result = $conn->query($sql);
    $row = $result->fetch_array(MYSQLI_ASSOC);

    if($result){
        $data["status"] = 200;
		$data["data"] = $row['orderid'];
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		header(' ', true, 204);
    }
	echo json_encode($data);
}

if($action == "createNewOrder"){
    $data = json_decode(file_get_contents("php://input"));
    $orderid = $data->orderid;
    $orderdt = $data->orderdt;
    $custid = $data->custid;
    $prodid = $data->prodid;
	$qty = $data->qty;
    $remarks = $data->remarks;
    $consignees = $data->consignees;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "INSERT INTO `order_master`(`orderid`, `orderdt`, `clientid`, `prodid` ,`quantity`, `remarks`, `status`) VALUES ($orderid, '$orderdt', $custid, $prodid, '$qty', '$remarks', 'open')";
        $result = $conn->query($sql);
        $ordid = $conn->insert_id;
        
        for($i=0; $i<count($consignees); $i++) {
            $consigneename = $consignees[$i]->consigneename;
            $contactperson = $consignees[$i]->contactperson;
            $contactno = $consignees[$i]->contactno;
            $city = $consignees[$i]->city;
            $address = $consignees[$i]->address;
            $remarks = $consignees[$i]->remarks;
            $quantity = $consignees[$i]->quantity;

            $sqlins="INSERT INTO `order_consignees`(`orderid`, `consigneename`,`contactperson`, `contactnumber`, `city`, `address`, `quantity`, `remarks`) VALUES ($orderid, '$consigneename', '$contactperson', '$contactno', '$city', '$address', '$quantity', '$remarks')";
            $resultqty = $conn->query($sqlins);
        }
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $ordid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "getOpenOrders"){
	$sql = "SELECT o.`orderid`,o.`orderdt`,o.`prodid`, o.`quantity`,o.`remarks`,c.`clientid`,c.`name`,c.`address`,c.`contactno`, p.`prodname` FROM `order_master` o, `client_master` c, `product_master` p WHERE o.`clientid`=c.`clientid` AND o.`status`='open' AND o.`prodid`=p.`prodid`";
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
			$tmp[$i]['orderdt'] = $row['orderdt'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['prodname'] = $row['prodname'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['remarks'] = $row['remarks'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['address'] = $row['address'];
			$tmp[$i]['contactno'] = $row['contactno'];
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

if($action == "getOrderConsignees"){
    $orderid=$_GET["orderid"];
	$sql = "SELECT * FROM `order_consignees` WHERE `orderid`=$orderid";
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
			$tmp[$i]['orderconsignid'] = $row['orderconsignid'];
			$tmp[$i]['contactperson'] = $row['contactperson'];
			$tmp[$i]['contactnumber'] = $row['contactnumber'];
			$tmp[$i]['city'] = $row['city'];
			$tmp[$i]['address'] = $row['address'];
			$tmp[$i]['quantity'] = $row['quantity'];
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