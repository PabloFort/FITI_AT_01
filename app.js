// ================= VARIABLES =================
let equiposMedida = [];
let datosSesion = { gps: "" };
let seccionActual = 0;
let contadorTrafos = 0;

// ================= CHECKLIST =================
const seccionesChecklist = [
    { titulo: "1. DOCUMENTACIÓN", preguntas: ["Contrato", "Proyecto"] },
    { titulo: "2. TRANSFORMADOR", preguntas: ["Placa", "Aisladores"] }
];

// ================= NAVEGACIÓN =================
function cambiarHoja(n) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");

    const hoja = document.getElementById("hoja" + n);
    if (!hoja) return;

    hoja.style.display = "block";

    if (n === 1) {
        setTimeout(iniciarFirma, 50);
    }
    if (n === 3 && contadorTrafos === 0) {
        añadirFormularioTrafo();
    }
    if (n === 4) {
        seccionActual = 0;
        renderSeccion();
    }
}

// ================= FIRMA =================
let canvas, ctx, dibujando = false;

function iniciarFirma() {
    canvas = document.getElementById("canvas-firma");
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    canvas.onmousedown = e => {
        dibujando = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    };
    canvas.onmousemove = e => {
        if (!dibujando) return;
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    };
    window.onmouseup = () => dibujando = false;
}

function limpiarFirma() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ================= GPS =================
function iniciarInspeccion() {
    navigator.geolocation.getCurrentPosition(p => {
        datosSesion.gps = `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`;
        document.getElementById("gps-display").innerText = datosSesion.gps;
    });
}

// ================= EQUIPOS =================
function añadirEquipoMedida() {
    const i = document.getElementById("eq-referencia");
    if (!i.value.trim()) return;

    const li = document.createElement("li");
    li.textContent = i.value;
    document.getElementById("lista-equipos").appendChild(li);
    i.value = "";
}

// ================= TRANSFORMADORES =================
function añadirFormularioTrafo() {
    contadorTrafos++;
    const d = document.createElement("div");
    d.innerHTML = `<b>Transformador ${contadorTrafos}</b>`;
    document.getElementById("contenedor-trafos-datos").appendChild(d);
}

// ================= CHECKLIST =================
function renderSeccion() {
    const s = seccionesChecklist[seccionActual];
    if (!s) return;

    document.getElementById("titulo-seccion").innerText = s.titulo;
    const c = document.getElementById("contenedor-preguntas");
    c.innerHTML = "";

    s.preguntas.forEach(p => {
        const div = document.createElement("div");
        div.textContent = p;
        c.appendChild(div);
    });
}

function irAdelante() {
    if (seccionActual < seccionesChecklist.length - 1) {
        seccionActual++;
        renderSeccion();
    } else {
        generarCertificado();
    }
}

function irAtras() {
    if (seccionActual > 0) {
        seccionActual--;
        renderSeccion();
    } else {
        cambiarHoja(3);
    }
}

// ================= CERTIFICADO =================
function generarCertificado() {
    cert_expediente.value = expediente.value;
    cert_fecha.value = new Date().toLocaleDateString();
    cert_resultado.value = "Inspección realizada correctamente.";
    cambiarHoja(5);
}

// ================= PDF =================
async function exportarCertificadoPDF() {
    const { PDFDocument } = PDFLib;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    page.drawText("CERTIFICADO FITI AT", { x: 50, y: 700 });

    const bytes = await pdfDoc.save();
    const blob = new Blob([bytes], { type: "application/pdf" });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "certificado.pdf";
    a.click();
}

// ================= ARRANQUE =================
document.addEventListener("DOMContentLoaded", () => {
    cambiarHoja(1);
});
