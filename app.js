/* APP INSPECCIÓN AT – app.js */
let seccionActual = 0;
let contadorTrafos = 0;

const seccionesChecklist = [
    { titulo: "1. DOCUMENTACIÓN", preguntas: ["1.1 Contrato", "1.2 Instrucciones", "1.3 Correspondencia"] },
    { titulo: "2. TRANSFORMADOR", preguntas: ["2.1 Placa", "2.2 Nivel", "2.3 Aisladores"] },
    { titulo: "3. MANIOBRA", preguntas: ["3.1 Materiales", "3.2 Seccionadores"] }
];

function cambiarHoja(n) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    const id = (typeof n === "number") ? "hoja" + n : n;
    const el = document.getElementById(id);
    if (el) el.style.display = "block";

    if (n === 1) setTimeout(iniciarFirma, 300);
    if (n === 4) renderDocumentacion();
    if (n === 6) renderSeccion();
    if (id === "hojaCertificado") generarVistaCertificado();
    window.scrollTo(0, 0);
}

function procesarHoja3() {
    cambiarHoja(4);
}

let canvas, ctx, dibujando = false;
function iniciarFirma() {
    canvas = document.getElementById("canvas-firma");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const pos = e => {
        const rect = canvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    canvas.onmousedown = canvas.ontouchstart = (e) => {
        dibujando = true;
        ctx.beginPath();
        const p = pos(e);
        ctx.moveTo(p.x, p.y);
    };
    canvas.onmousemove = canvas.ontouchmove = (e) => {
        if (!dibujando) return;
        const p = pos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };
    window.onmouseup = window.ontouchend = () => dibujando = false;
}

function limpiarFirma() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function iniciarInspeccion() {
    navigator.geolocation.getCurrentPosition(pos => {
        document.getElementById("gps-display").innerText = pos.coords.latitude.toFixed(5);
        document.getElementById("datos-inicio").style.display = "block";
    }, () => {
        document.getElementById("gps-display").innerText = "No disponible";
        document.getElementById("datos-inicio").style.display = "block";
    });
}

function renderDocumentacion() {
    const cont = document.getElementById("contenedor-doc");
    cont.innerHTML = seccionesChecklist[0].preguntas.map((p, i) => `<div class="card">${p}</div>`).join('');
}

function renderSeccion() {
    const s = seccionesChecklist[seccionActual];
    document.getElementById("titulo-seccion").innerText = s.titulo;
    document.getElementById("contenedor-preguntas").innerHTML = s.preguntas.map(p => `<div class="card">${p}</div>`).join('');
}

function irAdelante() {
    if (seccionActual < seccionesChecklist.length - 1) { seccionActual++; renderSeccion(); }
    else cambiarHoja("hojaCertificado");
}

function irAtras() {
    if (seccionActual > 0) { seccionActual--; renderSeccion(); }
    else cambiarHoja(5);
}

function generarVistaCertificado() {
    document.getElementById("cert_expediente").innerText = document.getElementById("expediente").value;
    document.getElementById("cert_titular_nombre").innerText = document.getElementById("titular_nombre").value;
}

function generarPDF() {
    alert("Generando PDF...");
}

// ARRANQUE
window.onload = () => {
    cambiarHoja(1);
};