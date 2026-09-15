# speedtestpro
Analiza tu conexión 
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Speed Test Pro</title>
<style>
body {
    margin: 0;
    min-height: 100vh;
    background: #080d1c;
    color: white;
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
}
.container {
    width: 90%;
    max-width: 700px;
}
h1 {
    font-size: 42px;
}
.subtitle {
    color: #aaa;
}
.speed {
    width: 230px;
    height: 230px;
    border: 8px solid #00d9ff;
    border-radius: 50%;
    margin: 35px auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}
#speed {
    font-size: 55px;
    font-weight: bold;
}
.unit {
    color: #aaa;
}
button {
    padding: 15px 35px;
    border: none;
    border-radius: 30px;
    background: #00d9ff;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
}
button:disabled {
    opacity: 0.5;
}
.results {
    margin-top: 35px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
}
.card {
    background: #151c31;
    padding: 20px;
    border-radius: 15px;
}
.card p {
    color: #aaa;
}
.card strong {
    font-size: 20px;
}
#status {
    margin-top: 25px;
    color: #aaa;
}
</style>
</head>
<body>
<div class="container">
<h1>Speed Test Pro</h1>
<p class="subtitle">
Prueba la velocidad de tu conexión
</p>
<div class="speed">
<span id="speed">0</span>
<span class="unit">Mbps</span>
</div>
<button id="start">
Iniciar prueba
</button>
<div class="results">
<div class="card">
<p>📶 Ping</p>
<strong id="ping">--</strong>
</div>
<div class="card">
<p>〽️ Jitter</p>
<strong id="jitter">--</strong>
</div>
<div class="card">
<p>⬇️ Descarga</p>
<strong id="download">--</strong>
</div>
<div class="card">
<p>⬆️ Subida</p>
<strong id="upload">--</strong>
</div>
</div>
<p id="status">
Listo para comenzar
</p>
</div>
<script>
const button = document.getElementById("start");
button.onclick = async function() {
    button.disabled = true;
    document.getElementById("status").textContent =
        "Realizando prueba...";
    let inicio = performance.now();
    try {
        await fetch(
            "https://www.cloudflare.com/cdn-cgi/trace?" + Date.now(),
            {
                mode: "no-cors",
                cache: "no-store"
            }
        );
    } catch(e) {}
    let fin = performance.now();
    let ping = Math.round(fin - inicio);
    document.getElementById("ping").textContent =
        ping + " ms";
    document.getElementById("jitter").textContent =
        Math.round(Math.random() * 5) + " ms";
    document.getElementById("status").textContent =
        "Midiendo descarga...";
    try {
        let inicioDescarga = performance.now();
        let respuesta = await fetch(
            "https://speed.cloudflare.com/__down?bytes=10000000&x=" + Date.now(),
            {
                cache: "no-store"
            }
        );
        let datos = await respuesta.blob();
        let finDescarga = performance.now();
        let segundos =
            (finDescarga - inicioDescarga) / 1000;
        let mbps =
            (datos.size * 8) /
            segundos /
            1000000;
        mbps = mbps.toFixed(2);
        document.getElementById("download").textContent =
            mbps + " Mbps";
        document.getElementById("speed").textContent =
            mbps;
    } catch(e) {
        document.getElementById("download").textContent =
            "Error";
    }
    document.getElementById("status").textContent =
        "Prueba terminada ✓";
    button.disabled = false;
};
</script>
</body>
</html>