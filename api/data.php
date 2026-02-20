<?php
require __DIR__ . '/config.php';
cors();

$userId = requireAuth();
$db = getDB();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $db->prepare('SELECT date_str, items_json, note, updated_at FROM user_data WHERE user_id = ?');
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $data = [];
    foreach ($rows as $row) {
        $data[] = [
            'date_str'   => $row['date_str'],
            'items'      => json_decode($row['items_json'], true) ?: new \stdClass(),
            'note'       => $row['note'],
            'updated_at' => (int) $row['updated_at'],
        ];
    }
    jsonResponse(['data' => $data]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = jsonInput();
    $dateStr   = $input['date_str'] ?? '';
    $items     = $input['items'] ?? new \stdClass();
    $note      = $input['note'] ?? '';
    $updatedAt = (int) ($input['updated_at'] ?? 0);

    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $dateStr)) {
        jsonResponse(['error' => 'Invalid date format.'], 400);
    }

    $itemsJson = json_encode($items);

    $stmt = $db->prepare(
        'INSERT INTO user_data (user_id, date_str, items_json, note, updated_at)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           items_json = IF(VALUES(updated_at) > updated_at, VALUES(items_json), items_json),
           note       = IF(VALUES(updated_at) > updated_at, VALUES(note), note),
           updated_at = IF(VALUES(updated_at) > updated_at, VALUES(updated_at), updated_at)'
    );
    $stmt->execute([$userId, $dateStr, $itemsJson, $note, $updatedAt]);

    jsonResponse(['ok' => true]);

} else {
    jsonResponse(['error' => 'Method not allowed'], 405);
}
