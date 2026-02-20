<?php
require __DIR__ . '/config.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = jsonInput();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if ($username === '' || $password === '') {
    jsonResponse(['error' => 'Email and password are required.'], 400);
}

$db = getDB();
$stmt = $db->prepare('SELECT id, password_hash FROM users WHERE username = ?');
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user || !password_verify($password, $user['password_hash'])) {
    jsonResponse(['error' => 'Invalid email or password.'], 401);
}

$token = bin2hex(random_bytes(32));
$db->prepare('INSERT INTO tokens (token, user_id) VALUES (?, ?)')->execute([$token, (int) $user['id']]);

jsonResponse(['token' => $token, 'username' => $username]);
