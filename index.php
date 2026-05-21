<?php
$distIndex = __DIR__ . DIRECTORY_SEPARATOR . 'dist' . DIRECTORY_SEPARATOR . 'index.html';

if (is_file($distIndex)) {
    readfile($distIndex);
    exit;
}

$isLocal = in_array($_SERVER['REMOTE_ADDR'] ?? '', ['127.0.0.1', '::1'], true);
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>METONUM Bisection Fixed Point</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            font-family: Arial, sans-serif;
            background: #f5f5f5;
            color: #1f2937;
        }

        main {
            width: min(720px, calc(100% - 32px));
            padding: 32px;
            border-radius: 8px;
            background: #fff;
            box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
        }

        h1 {
            margin: 0 0 12px;
            font-size: 28px;
        }

        p {
            line-height: 1.6;
        }

        code {
            padding: 2px 6px;
            border-radius: 4px;
            background: #eef2ff;
        }
    </style>
</head>
<body>
<main>
    <h1>Build React belum tersedia</h1>
    <p>
        Project ini adalah aplikasi React + Vite. Laragon bisa menyajikan hasil akhirnya,
        tetapi folder <code>dist</code> harus dibuat dulu.
    </p>
    <?php if ($isLocal): ?>
        <p>Jalankan perintah berikut dari folder project:</p>
        <p><code>npm run build</code></p>
        <p>
            Setelah itu refresh halaman Laragon ini. Untuk mode pengembangan yang lebih nyaman,
            gunakan <code>npm run dev</code> lalu buka URL Vite yang muncul di terminal.
        </p>
    <?php else: ?>
        <p>Hubungi pengelola aplikasi untuk menjalankan proses build.</p>
    <?php endif; ?>
</main>
</body>
</html>
