<?php
// Functions
function redirect($url, $statusCode = 303)
{
   header('Location: ' . $url, true, $statusCode);
   die();
}

if ($_SERVER['SERVER_PORT'] == 443){
  $protocal = 'https://';
} else {
  $protocal = 'http://';
}

$apiURL = $protocal."api.subely.com";

session_start();

require_once 'vendor/autoload.php';

use Kunnu\Dropbox\Dropbox;
use Kunnu\Dropbox\DropboxApp;

//Configure Dropbox Application  //
// Used creditionals of TMG

$app = new DropboxApp("3naerq00ohhrfbb", "fs91lwfc09ed1of");

//Configure Dropbox service
$dropbox = new Dropbox($app);

//DropboxAuthHelper
$authHelper = $dropbox->getAuthHelper();

//Callback URL

$callbackUrl = $protocal . $_SERVER['HTTP_HOST'] . "/auth/login-callback.php";
