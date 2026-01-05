<?php
// files.php - Backend pour l'explorateur de fichiers
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$requestedPath = isset($_GET['path']) ? $_GET['path'] : '';

// Sécurité : empêcher l'accès en dehors du dossier actuel
$basePath = __DIR__;
$fullPath = realpath($basePath . '/' . $requestedPath);

if ($fullPath === false || strpos($fullPath, $basePath) !== 0) {
    http_response_code(403);
    echo json_encode(['error' => 'Accès refusé']);
    exit;
}

if (!is_dir($fullPath)) {
    http_response_code(404);
    echo json_encode(['error' => 'Dossier introuvable']);
    exit;
}

$items = [];
$files = scandir($fullPath);

foreach ($files as $file) {
    // Ignorer les fichiers cachés et le dossier parent
    if ($file === '.' || $file === '..') continue;
    
    $filePath = $fullPath . '/' . $file;
    $isDir = is_dir($filePath);
    
    $items[] = [
        'name' => $file,
        'type' => $isDir ? 'dir' : 'file',
        'size' => $isDir ? null : filesize($filePath),
        'modified' => filemtime($filePath)
    ];
}

echo json_encode([
    'success' => true,
    'path' => $requestedPath,
    'items' => $items
]);
?>