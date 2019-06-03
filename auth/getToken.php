<?php

require_once 'header.php';
// $token = (exec("~/Desktop/getToken"));

// setcookie('t', $token, time()+3600, "/", ".localhost");
// get token
$logincred = array(
  "client_id" => 'id0',
  "client_secret" => 'secret0',
  "grant_type" => 'client_credentials'
);
$loginurl = $apiURL . "/oauth/access_token";
$options = array(
  'http' => array(
    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
    'method'  => 'POST',
    'content' => http_build_query($logincred)
  )
);

$cu = curl_init($loginurl);
curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
curl_setopt($cu, CURLOPT_POSTFIELDS, $logincred);



// execute!
$ress = curl_exec($cu);
$token = json_decode($ress)->access_token;
var_dump($ress);

?>
