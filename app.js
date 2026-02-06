// ================= VARIABLES =================
let equiposMedida = [];
let seccionActual = 0;
let contadorTrafos = 0;
let canvas, ctx, dib = false;

// ================= NAVEGACIÓN =================
function cambiarHoja(n){
    document.querySelectorAll('.page[data-hoja="nav"]').forEach(p=>{
        p.style.display = "none";
    });

    const hoja = document.getElementById("hoja"+n);
    if (!hoja) return;

    hoja.style.display = "block";
    window.scrollTo(0,0);

    if(n === 1) setTimeout(iniciarFirma, 50);
    if(n === 3 && contadorTrafos === 0) añadirFormularioTrafo();
    if(n === 4) renderSeccion();
}

// ================= FIRMA =================
function iniciarFirma(){
    canvas = document.getElementById("canvas-firma");
    if(!canvas) return;

    const r = canvas.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;

    ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    const pos = e => {
        const b = canvas.getBoundingClientRect();
        const p = e.touches ? e.touches[0] : e;
        return {x:p.clientX-b.left, y:p.clientY-b.top};
    };

    const start = e => {
        dib = true;
        const p = pos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    };
    const move = e => {
        if(!dib) return;
        const p = pos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };
    const end = () => dib = false;

    canvas.onmousedown = start;
    canvas.onmousemove = move;
    window.onmouseup = end;

    canvas.ontouchstart = start;
    canvas.ontouchmove = move;
    window.ontouchend = end;
}

function limpiarFirma(){
    if(ctx) ctx.clearRect(0,0,canvas.width,canvas.height);
}

// ================= GPS =================
function iniciarInspeccion(){
    navigator.geolocation.getCurrentPosition(p=>{
        document.getElementById("gps-display").innerText =
            `${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`;
    });
}

// ================= EQUIPOS =================
function añadirEquipoMedida(){
    const i = document.getElementById("eq-referencia");
    if(!i.value.trim()) return;

    const li = document.createElement("li");
    li.textContent = i.value;
    document.getElementById("lista-equipos").appendChild(li);
    i.value = "";
}

// ================= TRANSFORMADORES =================
function añadirFormularioTrafo(){
    contadorTrafos++;
    const d = document.createElement("div");
    d.innerHTML = `<b>Transformador ${contadorTrafos}</b>`;
    document.getElementById("contenedor-trafos-datos").appendChild(d);
}

// ================= CHECKLIST =================
const seccionesChecklist = [
    { titulo:"1. DOCUMENTACIÓN", preguntas:["Contrato","Libro"] },
    { titulo:"2. ENSAYOS", preguntas:["Aislamiento","Rigidez"] }
];

function renderSeccion(){
    const s = seccionesChecklist[seccionActual];
    if(!s) return;

    document.getElementById("titulo-seccion").innerText = s.titulo;
    const c = document.getElementById("contenedor-preguntas");
    c.innerHTML = "";

    s.preguntas.forEach(p=>{
        c.innerHTML += `<div>${p}</div>`;
    });
}

function irAdelante(){
    if(seccionActual < seccionesChecklist.length-1){
        seccionActual++;
        renderSeccion();
    } else {
        generarCertificado();
    }
}

function irAtras(){
    if(seccionActual > 0){
        seccionActual--;
        renderSeccion();
    } else {
        cambiarHoja(3);
    }
}

// ================= CERTIFICADO =================
function generarCertificado(){
    cert_expediente.value = expediente.value;
    cert_fecha.value = new Date().toLocaleDateString();
    cambiarHoja(5);
}

// ================= PDF =================
async function exportarCertificadoPDF(){
    const { PDFDocument } = PDFLib;
    const pdf = await PDFDocument.create();
    const page = pdf.addPage();
    page.drawText("Certificado generado correctamente");
    const bytes = await pdf.save();

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([bytes],{type:"application/pdf"}));
    a.download = "certificado.pdf";
    a.click();
}

// ================= ARRANQUE =================
document.addEventListener("DOMContentLoaded", ()=>{
    cambiarHoja(1);
});
