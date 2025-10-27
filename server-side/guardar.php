<?php
header("Content-Type: application/json; charset=UTF-8");

// 1. Leer el cuerpo de la solicitud
$data = json_decode(file_get_contents("php://input"), true);

// 3. Convertir el objeto a formato JSON legible
$jsonData = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// 4. Definir nombre de archivo (ej. con timestamp)
$nombreArchivo = "info_" . date("Ymd_His") . ".json";

// 5. Guardar el archivo en la misma carpeta del PHP
if (file_put_contents($nombreArchivo, $jsonData)) {
    echo json_encode(["estado" => "ok"]);
} else {
    echo json_encode(["estado" => "error"]);
}
?>
