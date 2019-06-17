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
        $sql = "INSERT INTO `order_master`(`orderno`, `orderdt`, `clientid`, `prodid` ,`quantity`, `remarks`, `status`) VALUES ('$orderid', '$orderdt', $custid, $prodid, '$qty', '$remarks', 'open')";
        $result = $conn->query($sql);
        $ordid = $conn->insert_id;
        
        for($i=0; $i<count($consignees); $i++) {
            $consigneename = $consignees[$i]->consigneename;
            $contactperson = $consignees[$i]->contactperson;
            $contactno = $consignees[$i]->contactno;
            $city = $consignees[$i]->city;
            $state = $consignees[$i]->state;
            $address = $consignees[$i]->address;
            $remarks = $consignees[$i]->remarks;
            $quantity = $consignees[$i]->quantity;

            $sqlins="INSERT INTO `order_consignees`(`orderid`, `consigneename`,`contactperson`, `contactnumber`, `city`, `state`, `address`, `quantity`, `remarks`) VALUES ($ordid, '$consigneename', '$contactperson', '$contactno', '$city', '$state', '$address', '$quantity', '$remarks')";
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

// Get All orders irrespective of Financial year
if($action == "getOpenOrders"){
	$sql = "SELECT o.`orderid`, o.`orderno`, o.`orderdt`,o.`prodid`, o.`quantity`,o.`remarks`,c.`clientid`,c.`name`,c.`address`,c.`contactno`, p.`prodname` FROM `order_master` o, `client_master` c, `product_master` p WHERE o.`clientid`=c.`clientid` AND o.`status`='open' AND o.`prodid`=p.`prodid`";
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


// Get All dispatched orders irrespective of Financial year
if($action == "getDispatchedOrders"){
	$sql = "SELECT o.`orderid`, o.`orderno`, o.`orderdt`,o.`prodid`, o.`quantity`,o.`remarks`,c.`clientid`,c.`name`,c.`address`,c.`contactno`, p.`prodname`, d.`dcno`, d.`dispatchdate` FROM `order_master` o, `client_master` c, `product_master` p, `dispatch_register` d WHERE o.`clientid`=c.`clientid` AND o.`status`='dispatched' AND o.`prodid`=p.`prodid` AND o.`orderid` = d.`orderid`";
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
			$tmp[$i]['orderdt'] = $row['orderdt'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['prodname'] = $row['prodname'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['remarks'] = $row['remarks'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['address'] = $row['address'];
			$tmp[$i]['contactno'] = $row['contactno'];
			$tmp[$i]['dcno'] = $row['dcno'];
			$tmp[$i]['dispatchdate'] = $row['dispatchdate'];
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
	$sql = "SELECT `orderconsignid`,`orderid`,`consigneename`,`contactperson`,`contactnumber` as `contactno`,`city`,`state`,`address`,`quantity`,`remarks` FROM `order_consignees` WHERE `orderid`=$orderid";
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
			$tmp[$i]['consigneename'] = $row['consigneename'];
			$tmp[$i]['contactperson'] = $row['contactperson'];
			$tmp[$i]['contactno'] = $row['contactno'];
			$tmp[$i]['city'] = $row['city'];
			$tmp[$i]['state'] = $row['state'];
			$tmp[$i]['address'] = $row['address'];
			$tmp[$i]['quantity'] = $row['quantity'];
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

// Get All Open Orders between dates passed
if($action == "getOpenOrdersFromToDate"){
	$fromdt = $_GET["fromdt"];
	$todt = $_GET["todt"];
	$sql = "SELECT o.`orderid`, o.`orderno`, o.`orderdt`,o.`prodid`, o.`quantity`,o.`remarks`,o.`status`,c.`clientid`,c.`name`,c.`address`,c.`contactno`, p.`prodname` FROM `order_master` o, `client_master` c, `product_master` p WHERE o.`clientid`=c.`clientid` AND (o.`status`='open' OR o.`status`='dispatched') AND o.`prodid`=p.`prodid` AND o.`orderdt` BETWEEN '$fromdt' AND '$todt'";
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
			$tmp[$i]['orderdt'] = $row['orderdt'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['prodname'] = $row['prodname'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['remarks'] = $row['remarks'];
			$tmp[$i]['status'] = $row['status'];
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

// Get All Orders between dates passed, irrespective if its open
if($action == "getAllOrdersFromToDate"){
	$fromdt = $_GET["fromdt"];
	$todt = $_GET["todt"];
	$sql = "SELECT o.`orderid`, o.`orderno`, o.`orderdt`,o.`prodid`, o.`quantity`,o.`remarks`,c.`clientid`,c.`name`,c.`address`,c.`contactno`, p.`prodname` FROM `order_master` o, `client_master` c, `product_master` p WHERE o.`clientid`=c.`clientid` AND o.`prodid`=p.`prodid` AND o.`orderdt` BETWEEN '$fromdt' AND '$todt'";
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

if($action == "getOrdersDetails"){
	$orderid = $_GET["orderid"];
	$sql = "SELECT o.`orderid`, o.`orderno`, o.`orderdt`,o.`prodid`, o.`quantity`,o.`remarks`,c.`clientid`,c.`name`,c.`address`,c.`contactno`, p.`prodname` FROM `order_master` o, `client_master` c, `product_master` p WHERE o.`orderid`=$orderid AND o.`clientid`=c.`clientid` AND o.`prodid`=p.`prodid`";
	$result = $conn->query($sql);
    $row = $result->fetch_array(MYSQLI_ASSOC);
	
	$tmp = array();
	$data = array();
	$i = 0;

	if($result){
		
			$tmp['orderid'] = $row['orderid'];
			$tmp['orderno'] = $row['orderno'];
			$tmp['orderdt'] = $row['orderdt'];
			$tmp['prodid'] = $row['prodid'];
			$tmp['prodname'] = $row['prodname'];
			$tmp['quantity'] = $row['quantity'];
			$tmp['remarks'] = $row['remarks'];
			$tmp['clientid'] = $row['clientid'];
			$tmp['name'] = $row['name'];
			$tmp['address'] = $row['address'];
			$tmp['contactno'] = $row['contactno'];
			$i++;
		
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

if($action == "updateOrderDetails"){
    $data = json_decode(file_get_contents("php://input"));
    $orderid = $data->orderid;
    $orderdt = $data->orderdt;
    $custid = $data->custid;
    $prodid = $data->prodid;
	$qty = $data->qty;
    $remarks = $data->remarks;
    $consignees = $data->consignees;
    
    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "UPDATE `order_master` SET `orderdt`='$orderdt',`clientid`=$custid,`prodid`=$prodid,`quantity`='$qty',`remarks`='$remarks' WHERE `orderid`=$orderid";
        $result = $conn->query($sql);
		
		//Extra step to remove all consignees for particular order
		$sqldel = "DELETE FROM `order_consignees` WHERE `orderid`=$orderid";
        $resultdel = $conn->query($sqldel);

        for($i=0; $i<count($consignees); $i++) {
            $consigneename = $consignees[$i]->consigneename;
            $contactperson = $consignees[$i]->contactperson;
            $contactno = $consignees[$i]->contactno;
            $city = $consignees[$i]->city;
            $state = $consignees[$i]->state;
            $address = $consignees[$i]->address;
            $remarks = $consignees[$i]->remarks;
            $quantity = $consignees[$i]->quantity;

            $sqlins="INSERT INTO `order_consignees`(`orderid`, `consigneename`,`contactperson`, `contactnumber`, `city`, `state`, `address`, `quantity`, `remarks`) VALUES ($orderid, '$consigneename', '$contactperson', '$contactno', '$city', '$state', '$address', '$quantity', '$remarks')";
            $resultqty = $conn->query($sqlins);
        }
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $orderid;
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		header(' ', true, 204);
	}
	echo json_encode($data1);
}
?>