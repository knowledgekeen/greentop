<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];

if($action == "addWastage"){
	$headers = apache_request_headers();
	authenticate($headers);
    $data = json_decode(file_get_contents("php://input"));
    $rawmatid = $data->rawmatid;
    $quantity = $data->quantity;
    $wastagedt = $data->wastagedt;

    if($_SERVER['REQUEST_METHOD']=='POST'){
        $sql = "INSERT INTO `rawmat_wastage_master`(`rawmatid`, `quantity`, `wastagedt`) VALUES ($rawmatid,'$quantity','$wastagedt')";
        $result = $conn->query($sql);
        $wasteid = $conn->insert_id;

        //Get stock quantity for raw material
        $sqlraw = "SELECT `stockid`, `quantity` FROM `stock_master` WHERE `rawmatid`=$rawmatid";
        $resultraw = $conn->query($sqlraw);
        $rowraw = $resultraw->fetch_array(MYSQLI_ASSOC);

        //Update stock quantity from raw material
        $uptqty = floatval($rowraw["quantity"]) - floatval($quantity);
        $sqlupt = "UPDATE `stock_master` SET `quantity`='$uptqty' WHERE `rawmatid`=$rawmatid";
        $resultupt = $conn->query($sqlupt);

		//Update stock register
		$stockid = $rowraw['stockid'];
        $sqlins = "INSERT INTO `stock_register`(`stockid`, `INorOUT`, `quantity`, `date`, `remarks`) VALUES ($stockid, 'OUT', '$quantity', '$wastagedt', 'Wastage added')";
        $resultins = $conn->query($sqlins);
    }
    $data1= array();
    if($result){
		$data1["status"] = 200;
		$data1["data"] = $wasteid;
		$log  = "File: wastage.php - Method: ".$action.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data1["status"] = 204;
		$log  = "File: wastage.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}
	echo json_encode($data1);
}

if($action == "getWastageFromTo"){
	$headers = apache_request_headers();
	authenticate($headers);
	$fromdt = $_GET["fromdt"];
	$todt = $_GET["todt"];
	$sql = "SELECT wm.`wastageid`,wm.`rawmatid`,wm.`quantity`,wm.`wastagedt`,rwm.`name` FROM `rawmat_wastage_master` wm,`raw_material_master` rwm WHERE wm.`rawmatid`=rwm.`rawmatid` AND wm.`wastagedt` BETWEEN '$fromdt' AND '$todt'";
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
			$tmp[$i]['wastageid'] = $row['wastageid'];
			$tmp[$i]['rawmatid'] = $row['rawmatid'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['wastagedt'] = $row['wastagedt'];
			$tmp[$i]['name'] = $row['name'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: wastage.php - Method: ".$action.PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: wastage.php - Method: ".$action.PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}
?>