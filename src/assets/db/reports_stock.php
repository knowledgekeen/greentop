<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "getAllStocks"){
	$headers = apache_request_headers();
	authenticate($headers);
    $sql = "SELECT s.`stockid`, s.`quantity`, r.`rawmatid`, r.`name`, p.`prodid`, p.`prodname` FROM `stock_master` s LEFT JOIN `raw_material_master` r ON s.`rawmatid` = r.`rawmatid` LEFT JOIN `product_master` p ON s.`prodid`=p.`prodid`";
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
			$tmp[$i]['stockid'] = $row['stockid'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['rawmatid'] = $row['rawmatid'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['prodid'] = $row['prodid'];
			$tmp[$i]['prodname'] = $row['prodname'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: reports_stock.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: reports_stock.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}

if($action == "updateStock"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
	$stockid = $data->stockid;
	$quantity = $data->quantity;

    if($_SERVER['REQUEST_METHOD']=='POST'){
		$sql = "UPDATE `stock_master` SET `quantity`='$quantity' WHERE `stockid`=$stockid";
        $result = $conn->query($sql);
	}
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $stockid;
		$log  = "File: reports_stock.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: reports_stock.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data1);
}

if($action == "getDistrictWiseSales"){
	$headers = apache_request_headers();
	authenticate($headers);
    $fromdt= $_GET["fromdt"];
    $todt= $_GET["todt"];
    $sql = "SELECT cm.*,SUM(om.quantity) as totalquantity FROM `order_master` om, `client_master` cm WHERE om.`clientid`=cm.`clientid` AND `orderdt` BETWEEN '$fromdt' AND '$todt' GROUP BY cm.`district` ORDER BY cm.`district`";
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
			$tmp[$i]['district'] = $row['district'];
			$tmp[$i]['totalquantity'] = $row['totalquantity'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: reports_stock.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: reports_stock.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}
?>