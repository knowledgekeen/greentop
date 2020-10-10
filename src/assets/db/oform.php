<?php
header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept');
header('Access-Control-Allow-Headers: Authorization, X-Requested-With, Content-Type, Accept');
//account.php?action=signUp
include 'conn.php';
include 'jwt_helper.php';

$action = $_GET['action'];
if($action == "getLastOFormId"){
	$headers = apache_request_headers();
	authenticate($headers);
    $sql = "SELECT `oformid` FROM `oform_master` ORDER BY `oformid` DESC LIMIT 1";
    $result = $conn->query($sql);
    $tmp = array();
    if($result){
        $i=0;
        while($row = $result->fetch_array())
        {
            $tmp[$i]["oformid"]= $row["oformid"];
            $tmp[$i]["oformno"]= $row["oformno"];
            $i++;
        }

        $data["status"] = 200;
		$data["data"] = $tmp;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "success", NULL);
		header(' ', true, 200);
	}
	else{
		$data["status"] = 204;
		$log  = "File: oform.php - Method: $action".PHP_EOL.
		"Error message: ".$conn->error.PHP_EOL.
		"Data: ".json_encode($data).PHP_EOL;
		write_log($log, "error", $conn->error);
		header(' ', true, 204);
    }
	echo json_encode($data);
}
?>