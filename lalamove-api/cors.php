<?php
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
// Allow any localhost port (for dev) or Vercel deployment
if (preg_match('/^http:\/\/localhost(:\d+)?$/', $origin) || str_contains($origin, '.vercel.app')) {
    header("Access-Control-Allow-Origin: $origin");
}
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
?>
