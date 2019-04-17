<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
$action = $_GET['action'];

if($action == "getFromToPurchases"){
    $fromdt = $_GET["fromdt"];
    $todt = $_GET["todt"];
    $sql = "SELECT pm.`purcmastid`,pm.`clientid`,pm.`vehicalno`,pm.`dcno`,pm.`billno`,pm.`billdt`,pm.`arrivaldt`,pm.`totalamount`,pm.`totaldiscount`,cm.`name`, pr.`rawmatid`, pr.`quantity`, pr.`rate`, pr.`cgst`, pr.`sgst`, pr.`igst`, pr.`discount`, pr.`roundoff`, pr.`amount` , rm.`name` as `rawmatname` FROM `purchase_master` pm, `client_master` cm, `purchase_register` pr, `raw_material_master` rm WHERE pm.`clientid`=cm.`clientid` AND pr.`purcmastid`=pm.`purcmastid` AND pr.`rawmatid`=rm.`rawmatid` AND `billdt` BETWEEN '$fromdt' AND '$todt' ORDER BY pm.`arrivaldt`";
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
			$tmp[$i]['purcmastid'] = $row['purcmastid'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['vehicalno'] = $row['vehicalno'];
			$tmp[$i]['dcno'] = $row['dcno'];
			$tmp[$i]['billno'] = $row['billno'];
			$tmp[$i]['billdt'] = $row['billdt'];
			$tmp[$i]['arrivaldt'] = $row['arrivaldt'];
			$tmp[$i]['totaldiscount'] = $row['totaldiscount'];
			$tmp[$i]['totalamount'] = $row['totalamount'];
			$tmp[$i]['name'] = $row['name'];
			$tmp[$i]['rawmatid'] = $row['rawmatid'];
			$tmp[$i]['quantity'] = $row['quantity'];
			$tmp[$i]['rate'] = $row['rate'];
			$tmp[$i]['cgst'] = $row['cgst'];
			$tmp[$i]['sgst'] = $row['sgst'];
			$tmp[$i]['igst'] = $row['igst'];
			$tmp[$i]['discount'] = $row['discount'];
			$tmp[$i]['amount'] = $row['amount'];
			$tmp[$i]['rawmatname'] = $row['rawmatname'];
			$tmp[$i]['roundoff'] = $row['roundoff'];
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