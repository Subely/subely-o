<?php
// var_dump(setcookie("TestCookie", 'sss'));

use Kunnu\Dropbox\Dropbox;
use Kunnu\Dropbox\DropboxApp;


require_once 'header.php';
require_once 'getToken.php';


if (isset($_GET['code']) && isset($_GET['state'])) {
    //Bad practice! No input sanitization!
    $code = $_GET['code'];
    $state = $_GET['state'];



    //Fetch the AccessToken
    $accessToken = $authHelper->getAccessToken($code, $state, $callbackUrl);



    $dbxtoken = $accessToken->getToken();



// ---------------------  @TODO delete the rest and do with js ------- //

		//Configure Dropbox Application
		$user = new DropboxApp("k5lm6p6k0gzfo14", "zw3e47ugo1pwfdp", $dbxtoken);

		//Configure Dropbox service
		$dbx = new Dropbox($user);

		$account = $dbx->getCurrentAccount();

    $email = $account->getEmail();

    $dbid = $account->getAccountId();


		// checks if user exsists
		//-----------------
		$url = $apiURL . '/dbxusers/verify/' . $email;
		$handle = curl_init($url);
		curl_setopt($handle,  CURLOPT_RETURNTRANSFER, TRUE);

		/* Get the HTML or whatever is linked in $url. */
		$resp = curl_exec($handle);

		


		/* Check for 404 (file not found). */
		$httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);





		if($httpCode == 404) {
			/* Handle 404 here. */

			$data = array(
			"access_token" => $token,
			"dbid" => $account->getAccountId(),
			"email" => $email,
			"display_name" => $account->getDisplayName(),
			"firstName" => $account->getNameDetails()['given_name'],
			"lastName" => $account->getNameDetails()['surname'],
			"profile_pic_url" => $account->getProfilePhotoUrl(),
			"verified" => $account->emailIsVerified(),
			"country" => $account->getCountry(),
			"language" => $account->getLocale(),
			"remember_token" => $dbxtoken
			);

			$url = $apiURL . "/dbxusers/add";

			$options = array(
				'http' => array(
					'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
					'method'  => 'POST',
					'content' => http_build_query($data)
				)
			);

			$ch = curl_init($url);
			curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
			curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

			// execute!
			$response = curl_exec($ch);

			/*if(curl_exec($ch) === false)
			{
			    echo 'Curl error: ' . curl_error($handle);
			}
			else
			{
			    echo 'Operation completed without any errors';
			} */

			// close the connection, release resources used
			curl_close($ch);

		}

 

		$redirUrl = '../?view=home&dbxtoken=' . $dbxtoken . '&ttoken=' . $token . '&dbid=' . $dbid;



		redirect($redirUrl);

		curl_close($handle);
}

?>
