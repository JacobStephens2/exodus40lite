<?php
require __DIR__ . '/config.php';
cors();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = jsonInput();
$username = trim($input['username'] ?? '');
$password = $input['password'] ?? '';

if (!filter_var($username, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Please enter a valid email address.'], 400);
}
if (strlen($password) < 6) {
    jsonResponse(['error' => 'Password must be at least 6 characters.'], 400);
}

$db = getDB();

$exists = $db->prepare('SELECT 1 FROM users WHERE username = ?');
$exists->execute([$username]);
if ($exists->fetch()) {
    jsonResponse(['error' => 'An account with this email already exists.'], 409);
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$db->prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)')->execute([$username, $hash]);
$userId = (int) $db->lastInsertId();

$token = bin2hex(random_bytes(32));
$db->prepare('INSERT INTO tokens (token, user_id) VALUES (?, ?)')->execute([$token, $userId]);

$now = round(microtime(true) * 1000);

$checklist = $input['checklist'] ?? [];
$notes = $input['notes'] ?? [];
$allDates = array_unique(array_merge(array_keys($checklist), array_keys($notes)));

if (count($allDates) > 0) {
    $stmt = $db->prepare(
        'INSERT INTO user_data (user_id, date_str, items_json, note, updated_at) VALUES (?, ?, ?, ?, ?)'
    );
    foreach ($allDates as $dateStr) {
        if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) continue;
        $items = isset($checklist[$dateStr]) ? json_encode($checklist[$dateStr]) : '{}';
        $note = $notes[$dateStr] ?? '';
        $stmt->execute([$userId, $dateStr, $items, $note, $now]);
    }
}

jsonResponse(['token' => $token, 'username' => $username]);
