<?php
require_once 'header.php';

//Fetch the Authorization/Login URL
$authUrl = $authHelper->getAuthUrl($callbackUrl);

redirect( $authUrl );
?>
