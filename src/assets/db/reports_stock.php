<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'session.php';
$action = $_GET['action'];

if($action == "getAllStocks"){
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
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		header(' ', true, 204);
	}

	echo json_encode($data);
}

?>