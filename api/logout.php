<?php
require __DIR__ . '/config.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
if (preg_match('/^Bearer\s+([a-f0-9]{64})$/', $header, $m)) {
    $db = getDB();
    $db->prepare('DELETE FROM tokens WHERE token = ?')->execute([$m[1]]);
}

jsonResponse(['ok' => true]);
