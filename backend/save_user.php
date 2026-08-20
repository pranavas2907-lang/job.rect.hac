<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: http://localhost:5173');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'POST required']);
    exit;
}

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Database configuration is missing']);
    exit;
}

$payload = json_decode(file_get_contents('php://input'), true);
$required = ['fullName', 'email', 'headline'];
foreach ($required as $field) {
    if (!is_string($payload[$field] ?? null) || trim($payload[$field]) === '') {
        http_response_code(422);
        echo json_encode(['error' => "$field is required"]);
        exit;
    }
}

if (!filter_var($payload['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['error' => 'A valid email is required']);
    exit;
}

$config = require $configPath;
$username = $config['write_username'] ?? $config['username'];
$password = $config['write_password'] ?? $config['password'];

try {
    $pdo = new PDO($config['dsn'], $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $statement = $pdo->prepare(
        'INSERT INTO users (full_name, email, phone, headline, location, about, skills, resume_name)
         VALUES (:full_name, :email, :phone, :headline, :location, :about, :skills, :resume_name)
         ON DUPLICATE KEY UPDATE full_name = VALUES(full_name), phone = VALUES(phone), headline = VALUES(headline),
         location = VALUES(location), about = VALUES(about), skills = VALUES(skills), resume_name = VALUES(resume_name)'
    );
    $statement->execute([
        ':full_name' => trim($payload['fullName']),
        ':email' => trim($payload['email']),
        ':phone' => trim((string) ($payload['phone'] ?? '')) ?: null,
        ':headline' => trim($payload['headline']),
        ':location' => trim((string) ($payload['location'] ?? '')) ?: null,
        ':about' => trim((string) ($payload['about'] ?? '')) ?: null,
        ':skills' => json_encode(is_array($payload['skills'] ?? null) ? $payload['skills'] : [], JSON_THROW_ON_ERROR),
        ':resume_name' => trim((string) ($payload['resumeName'] ?? '')) ?: null,
    ]);
    echo json_encode(['ok' => true]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not save user data']);
}