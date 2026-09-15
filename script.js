const button = document.getElementById("startButton");
const speed = document.getElementById("speed");
const ping = document.getElementById("ping");
const jitter = document.getElementById("jitter");
const download = document.getElementById("download");
const upload = document.getElementById("upload");
const status = document.getElementById("status");
button.addEventListener("click", startTest);
async function startTest() {
    button.disabled = true;
    status.textContent = "Midiendo conexión...";
    
    speed.textContent = "0";
    ping.textContent = "-- ms";
    jitter.textContent = "-- ms";
    download.textContent = "-- Mbps";
    upload.textContent = "-- Mbps";
    // Medir Ping
    const pingResults = await measurePing();
    ping.textContent = pingResults.average + " ms";
    jitter.textContent = pingResults.jitter + " ms";
    status.textContent = "Midiendo descarga...";
    // Medir descarga
    const downloadSpeed = await measureDownload();
    download.textContent = downloadSpeed + " Mbps";
    speed.textContent = downloadSpeed;
    status.textContent = "Prueba terminada";
    button.disabled = false;
}
// -------------------------
// PING
// -------------------------
async function measurePing() {
    const results = [];
    for (let i = 0; i < 5; i++) {
        const start = performance.now();
        try {
            await fetch(
                "https://www.cloudflare.com/cdn-cgi/trace",
                {
                    cache: "no-store",
                    mode: "no-cors"
                }
            );
        } catch (error) {
            // Ignoramos el error de CORS
        }
        const end = performance.now();
        results.push(end - start);
    }
    const average =
        results.reduce((a, b) => a + b, 0) / results.length;
    let jitterTotal = 0;
    for (let i = 1; i < results.length; i++) {
        jitterTotal += Math.abs(results[i] - results[i - 1]);
    }
    const jitter =
        jitterTotal / (results.length - 1);
    return {
        average: Math.round(average),
        jitter: Math.round(jitter)
    };
}
// -------------------------
// DESCARGA
// -------------------------
async function measureDownload() {
    const testFile =
        "https://speed.cloudflare.com/__down?bytes=10000000";
    const start = performance.now();
    try {
        const response = await fetch(
            testFile + "&cache=" + Date.now(),
            {
                cache: "no-store"
            }
        );
        const data = await response.blob();
        const end = performance.now();
        const seconds =
            (end - start) / 1000;
        const bits =
            data.size * 8;
        const mbps =
            bits / seconds / 1000000;
        return mbps.toFixed(2);
    } catch (error) {
        status.textContent =
            "No se pudo realizar la prueba";
        return "0";
    }
}