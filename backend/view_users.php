<?php
declare(strict_types=1);

session_start();
$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(500);
    exit('Create backend/config.php from config.example.php first.');
}

$config = require $configPath;
$viewerPassword = getenv('JOBNEST_VIEWER_PASSWORD') ?: '';
if ($viewerPassword === '') {
    http_response_code(500);
    exit('Set JOBNEST_VIEWER_PASSWORD before exposing this viewer.');
}

if (isset($_POST['password'])) {
    if (hash_equals($viewerPassword, (string) $_POST['password'])) {
        $_SESSION['jobnest_viewer_authenticated'] = true;
    } else {
        $error = 'Incorrect password.';
    }
}

if (isset($_GET['logout'])) {
    unset($_SESSION['jobnest_viewer_authenticated']);
    header('Location: view_users.php');
    exit;
}

if (empty($_SESSION['jobnest_viewer_authenticated'])):
?>
<!doctype html><html><head><meta charset="utf-8"><title>JobNest database</title></head><body>
<h1>JobNest user database</h1>
<?php if (!empty($error)): ?><p><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p><?php endif; ?>
<form method="post"><label>Viewer password <input type="password" name="password" required></label><button type="submit">View users</button></form>
</body></html>
<?php exit; endif;

try {
    $pdo = new PDO($config['dsn'], $config['username'], $config['password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
    $users = $pdo->query('SELECT id, full_name, email, phone, headline, location, resume_name, created_at FROM users ORDER BY created_at DESC')->fetchAll();
} catch (PDOException $exception) {
    http_response_code(500);
    exit('Database connection failed. Check backend/config.php.');
}
?>
<!doctype html><html><head><meta charset="utf-8"><title>JobNest users</title><style>body{font-family:Arial,sans-serif;margin:2rem;color:#17233a}table{border-collapse:collapse;width:100%}th,td{border:1px solid #dbe4f0;padding:.7rem;text-align:left}th{background:#eef5ff}a{float:right}</style></head><body>
<a href="?logout=1">Sign out</a><h1>Stored JobNest users</h1>
<p><?= count($users) ?> user record(s)</p>
<table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Headline</th><th>Location</th><th>Resume</th><th>Created</th></tr></thead><tbody>
<?php foreach ($users as $user): ?><tr><?php foreach (['full_name','email','phone','headline','location','resume_name','created_at'] as $field): ?><td><?= htmlspecialchars((string) ($user[$field] ?? ''), ENT_QUOTES, 'UTF-8') ?></td><?php endforeach; ?></tr><?php endforeach; ?>
</tbody></table></body></html>