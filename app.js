/* ===================================================
   APP INSPECCIÓN AT – app.js (CORREGIDO PARA GITHUB)
   =================================================== */

// 1. ESTADO GLOBAL
let datosSesion = {
    inspector: "",
    expediente: "",
    fecha: new Date().toLocaleDateString("es-ES"),
    gps: "No capturado",
    firmaImg: ""
};

let seccionActual = 0;
let contadorTrafos = 0;
let equiposMedida = [];

const seccionesChecklist = [
    { titulo: "1. DOCUMENTACIÓN", preguntas: ["1.1 Contrato mantenimiento", "1.2 Instrucciones operación", "1.3 Correspondencia doc/inst", "1.4 Doc. conforme (CFO)", "1.5 Proyecto / Memoria", "1.6 Libro de mantenimiento"] },
    { titulo: "2. COMPROBACIONES TRANSFORMADOR", preguntas: ["2.1 Placa características", "2.2 Nivel refrigerante", "2.3 Estado aisladores", "2.4 Protecciones internas", "2.5 Anclaje y foso", "2.6 Termostato", "2.7 Silicagel", "2.8 Conexión tierra chasis", "2.9 Placa PCB", "2.10 Tierra neutro"] },
    { titulo: "3. ELEMENTOS DE MANIOBRA Y PROTECCIÓN", preguntas: ["3.1 Características de materiales", "3.2.1 Seccionadores – Características", "3.2.2 Seccionadores – Mecánica", "3.3.1 Interruptores – Características", "3.3.7 Interruptores – Estado general"] },
    { titulo: "4. PUESTA A TIERRA", preguntas: ["4.1.1 Chasis y bastidores", "4.1.2 Envolventes metálicas", "4.1.9 Carcasas transformadores", "4.1.11 Derivaciones a tierra"] },
    { titulo: "5. INSTALACIONES INTERIOR", controlAplica: true, preguntas: ["5.1.1 Accesos y pasos", "5.1.4 Ventilación", "5.2.3 Celdas de alta tensión", "5.2.6 Iluminación"] },
    { titulo: "6. INSTALACIONES EXTERIOR", controlAplica: true, preguntas: ["6.1.1 Vallado adecuado", "6.1.2 Carteles de riesgo", "6.1.5 Sin corrosión"] }
];

// 2. NAVEGACIÓN Y CARGA
function cambiarHoja(n) {
    // Ocultar todas las páginas primero
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");

    const idHoja = (typeof n === "number") ? "hoja" + n : n;
    const hoja = document.getElementById(idHoja);

    if (!hoja) return;
    hoja.style.display = "block";

    // Disparar lógica según la hoja
    if (n === 1) {
        // Retraso para asegurar que el canvas es visible antes de inicializarlo
        setTimeout(iniciarFirma, 200);
    }
    if (n === 4) renderDocumentacion();
    if (n === 5 && contadorTrafos === 0) añadirFormularioTrafo();
    if (n === 6) renderSeccion();
    if (n === 7 || n === "hojaCertificado") generarVistaCertificado();

    window.scrollTo(0, 0);
}

// 3. FIRMA (Canvas)
let canvas, ctx, dib = false;
function iniciarFirma() {
    canvas = document.getElementById("canvas-firma");
    if (!canvas) return;
    ctx = canvas.getContext("2d");
    
    // Ajustar tamaño al contenedor real
    const r = canvas.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;
    
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000";

    const obtenerPos = e => {
        const rect = canvas.getBoundingClientRect();
        const t = e.touches ? e.touches[0] : e;
        return { x: t.clientX - rect.left, y: t.clientY - rect.top };
    };

    canvas.onmousedown = e => { dib = true; const p = obtenerPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    canvas.onmousemove = e => { if (!dib) return; const p = obtenerPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
    window.onmouseup = () => { dib = false; };
    
    canvas.ontouchstart = e => { e.preventDefault(); dib = true; const p = obtenerPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y); };
    canvas.ontouchmove = e => { e.preventDefault(); if (!dib) return; const p = obtenerPos(e); ctx.lineTo(p.x, p.y); ctx.stroke(); };
}

function limpiarFirma() { 
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height); 
}

// 4. LÓGICA DE NEGOCIO
function iniciarInspeccion() {
    const display = document.getElementById("gps-display");
    if (!navigator.geolocation) {
        alert("GPS no soportado");
        document.getElementById("datos-inicio").style.display = "block";
        return;
    }
    navigator.geolocation.getCurrentPosition(
        pos => {
            datosSesion.gps = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
            if (display) display.innerText = datosSesion.gps;
            document.getElementById("datos-inicio").style.display = "block";
        },
        err => {
            alert("Ubicación no disponible, puedes continuar.");
            document.getElementById("datos-inicio").style.display = "block";
        }
    );
}

function añadirEquipoMedida() {
    const input = document.getElementById("eq-referencia");
    const lista = document.getElementById("lista-equipos");
    if (input && input.value.trim() !== "") {
        equiposMedida.push(input.value);
        const li = document.createElement("li");
        li.innerText = input.value;
        lista.appendChild(li);
        input.value = "";
    }
}

function procesarHoja3() {
    datosSesion.expediente = document.getElementById("expediente")?.value || "S/N";
    cambiarHoja(4);
}

// 5. CHECKLIST DINÁMICO
function renderDocumentacion() {
    const cont = document.getElementById("contenedor-doc");
    if (!cont) return;
    let html = '<div class="card">';
    seccionesChecklist[0].preguntas.forEach((p, i) => {
        html += filaChecklist(`doc_${i}`, p);
    });
    cont.innerHTML = html + "</div>";
}

function renderSeccion() {
    const seccion = seccionesChecklist[seccionActual];
    const cont = document.getElementById("contenedor-preguntas");
    const titulo = document.getElementById("titulo-seccion");
    if (!seccion || !cont) return;

    titulo.innerText = seccion.titulo;
    cont.innerHTML = "";

    if (seccion.controlAplica) {
        const idBloque = "bloque_" + seccionActual;
        cont.innerHTML = `
            <div class="card"><label><input type="checkbox" onchange="document.getElementById('${idBloque}').style.display=this.checked?'block':'none'"> Aplica esta sección</label></div>
            <div id="${idBloque}" style="display:none;"></div>`;
        const bloque = document.getElementById(idBloque);
        seccion.preguntas.forEach((p, i) => { bloque.innerHTML += filaChecklist(`s${seccionActual}_${i}`, p); });
    } else {
        seccion.preguntas.forEach((p, i) => {
            cont.innerHTML += filaChecklist(`s${seccionActual}_${i}`, p);
        });
    }
}

function filaChecklist(id, texto) {
    return `
    <div class="fila-at">
        <span class="pregunta-txt">${texto}</span>
        <div class="selector-fna">
            <input type="radio" name="${id}" value="F" id="${id}_f"><label for="${id}_f" class="lbl-f">F</label>
            <input type="radio" name="${id}" value="X" id="${id}_x" onchange="mostrarObs('${id}', true)"><label for="${id}_x" class="lbl-x">X</label>
            <input type="radio" name="${id}" value="NA" id="${id}_na"><label for="${id}_na" class="lbl-na">NA</label>
        </div>
        <textarea id="obs_${id}" class="input-modern" placeholder="Defecto..." style="display:none; margin-top:8px;"></textarea>
    </div>`;
}

function mostrarObs(id, show) {
    const el = document.getElementById(`obs_${id}`);
    if (el) el.style.display = show ? "block" : "none";
}

function irAdelante() {
    if (seccionActual < seccionesChecklist.length - 1) {
        seccionActual++;
        renderSeccion();
    } else {
        cambiarHoja("hojaCertificado");
    }
}

function irAtras() {
    if (seccionActual > 0) {
        seccionActual--;
        renderSeccion();
    } else {
        cambiarHoja(5);
    }
}

function añadirFormularioTrafo() {
    contadorTrafos++;
    const cont = document.getElementById("contenedor-trafos-datos");
    if (!cont) return;
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `<h4>Transformador ${contadorTrafos}</h4>
        <input type="text" placeholder="Marca" class="input-modern" style="margin-bottom:8px;">
        <input type="text" placeholder="Nº Serie" class="input-modern">`;
    cont.appendChild(div);
}

function generarVistaCertificado() {
    document.getElementById("cert_expediente").innerText = document.getElementById("expediente")?.value || "";
    document.getElementById("cert_fecha").innerText = datosSesion.fecha;
    document.getElementById("cert_titular_nombre").innerText = document.getElementById("titular_nombre")?.value || "";
}

async function generarPDF() {
    alert("Función PDF-LIB lista. Conectando con plantilla...");
}

// INICIO AL CARGAR
window.onload = () => { 
    cambiarHoja(1); 
    console.log("FITI AT: Lista para usar.");
};