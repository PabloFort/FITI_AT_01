/* APP INSPECCIÓN AT – app.js */
let datosSesion = {
    inspector: "",
    expediente: "",
    fecha: new Date().toLocaleDateString("es-ES"),
    gps: "No capturado"
};

let seccionActual = 0;
let contadorTrafos = 0;
let equiposMedida = [];

const seccionesChecklist = [
    { titulo: "1. DOCUMENTACIÓN", preguntas: ["1.1 Contrato mantenimiento", "1.2 Instrucciones operación", "1.3 Correspondencia doc/inst"] },
    { titulo: "2. TRANSFORMADOR", preguntas: ["2.1 Placa características", "2.2 Nivel refrigerante", "2.3 Estado aisladores"] },
    { titulo: "3. MANIOBRA Y PROTECCIÓN", preguntas: ["3.1 Características materiales", "3.2 Seccionadores"] }
];

function cambiarHoja(n) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    const idHoja = (typeof n === "number") ? "hoja" + n : n;
    const hoja = document.getElementById(idHoja);
    if (hoja) hoja.style.display = "block";

    if (n === 1) setTimeout(iniciarFirma, 300);
    if (n === 4) renderDocumentacion();
    if (n === 5 && contadorTrafos === 0) añadirFormularioTrafo();
    if (n === 6) renderSeccion();
    if (idHoja === "hojaCertificado") generarVistaCertificado();
    window.scrollTo(0, 0);
}

function procesarHoja3() {
    datosSesion.expediente = document.getElementById("expediente")?.value || "S/N";
    cambiarHoja(4);
}

function iniciarFirma() {
    const canvas = document.getElementById("canvas-firma");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";

    let dibujando = false;
    const pos = e => {
        const r = canvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        return { x: t.clientX - r.left, y: t.clientY - r.top };
    };

    canvas.onmousedown = canvas.ontouchstart = e => { 
        if(e.touches) e.preventDefault();
        dibujando = true; 
        ctx.beginPath(); 
        const p = pos(e); 
        ctx.moveTo(p.x, p.y); 
    };
    canvas.onmousemove = canvas.ontouchmove = e => { 
        if (!dibujando) return; 
        if(e.touches) e.preventDefault();
        const p = pos(e); 
        ctx.lineTo(p.x, p.y); 
        ctx.stroke(); 
    };
    window.onmouseup = window.ontouchend = () => dibujando = false;
}

function limpiarFirma() {
    const canvas = document.getElementById("canvas-firma");
    if (canvas) canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
}

function iniciarInspeccion() {
    navigator.geolocation.getCurrentPosition(pos => {
        datosSesion.gps = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        document.getElementById("gps-display").innerText = datosSesion.gps;
        document.getElementById("datos-inicio").style.display = "block";
    }, () => {
        alert("GPS no disponible, continuando...");
        document.getElementById("datos-inicio").style.display = "block";
    });
}

function añadirEquipoMedida() {
    const val = document.getElementById("eq-referencia").value;
    if (val) {
        equiposMedida.push(val);
        const li = document.createElement("li");
        li.innerText = val;
        document.getElementById("lista-equipos").appendChild(li);
        document.getElementById("eq-referencia").value = "";
    }
}

function renderDocumentacion() {
    const cont = document.getElementById("contenedor-doc");
    cont.innerHTML = '<div class="card">' + seccionesChecklist[0].preguntas.map((p, i) => filaChecklist(`d_${i}`, p)).join('') + '</div>';
}

function renderSeccion() {
    const s = seccionesChecklist[seccionActual];
    document.getElementById("titulo-seccion").innerText = s.titulo;
    document.getElementById("contenedor-preguntas").innerHTML = s.preguntas.map((p, i) => filaChecklist(`s${seccionActual}_${i}`, p)).join('');
}

function filaChecklist(id, txt) {
    return `<div class="fila-at"><span>${txt}</span><div class="selector-fna">
        <input type="radio" name="${id}" id="${id}f"><label for="${id}f">F</label>
        <input type="radio" name="${id}" id="${id}x"><label for="${id}x">X</label>
        <input type="radio" name="${id}" id="${id}n"><label for="${id}n">NA</label>
    </div></div>`;
}

function irAdelante() {
    if (seccionActual < seccionesChecklist.length - 1) { seccionActual++; renderSeccion(); }
    else cambiarHoja("hojaCertificado");
}

function irAtras() {
    if (seccionActual > 0) { seccionActual--; renderSeccion(); }
    else cambiarHoja(5);
}

function añadirFormularioTrafo() {
    contadorTrafos++;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h4>Trafo ${contadorTrafos}</h4><input class="input-modern" placeholder="Marca">`;
    document.getElementById("contenedor-trafos-datos").appendChild(div);
}

function generarVistaCertificado() {
    document.getElementById("cert_expediente").innerText = document.getElementById("expediente")?.value || "N/A";
    document.getElementById("cert_titular_nombre").innerText = document.getElementById("titular_nombre")?.value || "N/A";
}

async function generarPDF() { alert("Generando PDF con pdf-lib..."); }

window.onload = () => {
    console.log("Iniciando App...");
    cambiarHoja(1);
};