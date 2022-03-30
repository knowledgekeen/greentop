<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
header("Content-Type: application/json");
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';
$action = $_GET['action'];

if($action == "updateSundryData"){
	$headers = apache_request_headers();
    authenticate($headers);
    $data1 = json_decode(file_get_contents("php://input"));
    $sundrydets = $data1->sundrydets;
    $data= array();
    if($_SERVER['REQUEST_METHOD']=='POST'){
        for($i=0; $i<count($sundrydets); $i++) {
            $balance = $sundrydets[$i]->balance;
            $baldate = $sundrydets[$i]->dates;
            $clientid = $sundrydets[$i]->clientid;
            $sql = "SELECT * FROM `client_sundry_register` WHERE `clientid`=$clientid AND `balancedt`=$baldate";
            $result = $conn->query($sql);
            $row = $result->fetch_array(MYSQLI_ASSOC);
            if($result && $row['sundryid']){
                $sqlupdate="UPDATE `client_sundry_register` SET `balance`='$balance' WHERE `clientid`=$clientid AND `balancedt`=$baldate";
                $resultupdate = $conn->query($sqlupdate);
                if($resultupdate){
                    $data[$i]["status"] = 200;
                    $data[$i]["data"] = $row['sundryid'];
                    $data[$i]["query"] = "update success";
                }
                else{
                    $data[$i]["status"] = 204;
                    $data[$i]["query"] = "update failed";
                }
            }
            else{
                $sqlinsert="INSERT INTO `client_sundry_register`(`clientid`, `balance`, `balancedt`) VALUES ($clientid,'$balance','$baldate')";
                $resultinsert = $conn->query($sqlinsert);
                $sundryid = $conn->insert_id;
                if($resultinsert){
                    $data[$i]["status"] = 200;
                    $data[$i]["data"] = $sundryid;
                    $data[$i]["query"] = "insert success";
                }
                else{
                    $data[$i]["status"] = 204;
                    $data[$i]["query"] = "insert failed";
                }
            }
        }   //For
    }   //if
    $log  = "File: sundry.php - Method: $action".PHP_EOL.
    "Data: ".json_encode($data).PHP_EOL;
    write_log($log, "success", NULL);
    header(' ', true, 200);
	echo json_encode($data);
}

// Get All Sundry Debtors details
if($action == "getSundryDetails"){
	$headers = apache_request_headers();
	authenticate($headers);
	$fromdt = $_GET["fromdt"];
	$todt = $_GET["todt"];
	$ctype = $_GET["ctype"];
	$sql = "SELECT csr.*,cm.`type`,cm.`name` FROM `client_sundry_register` csr, `client_master` cm WHERE csr.`clientid`=cm.`clientid` AND cm.`type`=$ctype AND csr.`balancedt` BETWEEN $fromdt AND $todt ORDER BY cm.`name` ASC, csr.`balancedt` ASC";
    //Log (before 30-03-22): Previously it was sorted by cm.name and csr.balancedt, later changed it because of a void entry
    //Log (changed on 30-03-22): Again changed back from csr.`sundryid` to csr.balancedt as was showing a wrong entry 
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
			$tmp[$i]['sundryid'] = $row['sundryid'];
			$tmp[$i]['clientid'] = $row['clientid'];
			$tmp[$i]['balance'] = $row['balance'];
			$tmp[$i]['balancedt'] = $row['balancedt'];
			$tmp[$i]['type'] = $row['type'];
			$tmp[$i]['name'] = $row['name'];
			$i++;
		}
		$data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: sundry.php - Method: $action".PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: sundry.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
	}

	echo json_encode($data);
}
?>