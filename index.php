<?php
$distIndex = __DIR__ . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR . 'index.html';

if (!is_file($distIndex)) {
    http_response_code(500);
    exit('Build belum tersedia. Jalankan npm run build terlebih dahulu.');
}

readfile($distIndex);
