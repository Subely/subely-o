<?php
// Added by Jamil
// for detecting host and protocol so that it works on local and live

$current_server = $_SERVER['SERVER_NAME'];

if($current_server=='localhost' || $current_server=='api.subely.dev')
{
		$protocal = 'http://';
		$host = "api.subely.dev";
}
 else
 {
 	$host = "api.subely.com";
	if ($_SERVER['SERVER_PORT'] == 443)
	{
	  $protocal = 'https://';
	}
	else
	{
	  $protocal = 'http://';
	}
}
	
$apiURL = $protocal.$host;
if(isset($_GET['endpoint']))
  $endpoint_url = $apiURL . $_GET['endpoint'];
else
	$endpoint_url = $apiURL;

if ($_POST) {
  echo "post";
	$postdata = $_POST;

	$options = array(
		'http' => array(
			'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
			'method'  => 'POST',
			'content' => http_build_query($postdata)
		)
	);

	$cu = curl_init($endpoint_url);
	curl_setopt($cu, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($cu, CURLOPT_POSTFIELDS, $postdata);
  // execute!
	$ress = curl_exec($cu);
	// $token = json_decode($ress)->access_token;
	var_dump($ress);
}

elseif ($_GET['endpoint']) {
  // echo $endpoint_url;
  $ch = curl_init();

  //Set the URL that you want to GET by using the CURLOPT_URL option.
  curl_setopt($ch, CURLOPT_URL, $endpoint_url);

  //Set CURLOPT_RETURNTRANSFER so that the content is returned as a variable.
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

  //Set CURLOPT_FOLLOWLOCATION to true to follow redirects.
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

  //Execute the request.
  $data = curl_exec($ch);

  //Close the cURL handle.
  curl_close($ch);

  //Print the data out onto the page.
  echo $data;
  if (!$data){
    echo "be sure you started the endpoint with a backslash \"/\" ";
  }
}

?>
