// ===================================================
// VARIABLES GLOBALES
// ===================================================
let equiposMedida = [];
let datosSesion = {
    inspector: "",
    expediente: "",
    gps: "",
    firmaImg: ""
};

let seccionActual = 1;
let contadorTrafos = 0;

// ===================================================
// CHECKLIST (VERSIÓN ESTABLE)
// ===================================================
const seccionesChecklist = [
    {
        titulo: "1. DOCUMENTACIÓN",
        preguntas: [
            "1.1 Contrato mantenimiento",
            "1.2 Instrucciones operación",
            "1.3 Correspondencia doc/inst",
            "1.4 Doc. conforme (CFO)",
            "1.5 Proyecto / Memoria",
            "1.6 Libro de mantenimiento"
        ]
    },
    {
        titulo: "2. COMPROBACIONES TRANSFORMADOR",
        preguntas: [
            "2.1 Placa características",
            "2.2 Nivel refrigerante",
            "2.3 Estado aisladores",
            "2.4 Protecciones internas",
            "2.5 Anclaje y foso",
            "2.6 Termostato",
            "2.7 Silicagel",
            "2.8 Conexión tierra chasis",
            "2.9 Placa PCB",
            "2.10 Tierra neutro"
        ]
    },
    {
        titulo: "3. ELEMENTOS DE MANIOBRA Y PROTECCIÓN",
        preguntas: [
            "3.1 Características de los materiales en función de su aislamiento",

            "3.2.1 Seccionadores – Características",
            "3.2.2 Seccionadores – Funcionamiento mecánico",
            "3.2.3 Seccionadores – Enclavamientos",
            "3.2.4 Seccionadores – Estado en general",

            "3.3.1 Interruptores – Características",
            "3.3.2 Interruptores – Funcionamiento mecánico",
            "3.3.3 Interruptores – Funcionamiento automático",
            "3.3.4 Interruptores – Rearme automático",
            "3.3.5 Interruptores – Enclavamientos",
            "3.3.6 Interruptores – Niveles de presión (SF6, aceite, etc.)",
            "3.3.7 Interruptores – Estado en general",

            {
                tipo: "protecciones",
                id: "3.4.1",
                titulo: "Protecciones contra sobretensiones",
                opciones: [
                    "Atmosféricas (pararrayos, descargadores)",
                    "Interno (relés indirectos de sobretensión)"
                ]
            },
            {
                tipo: "protecciones",
                id: "3.4.2",
                titulo: "Protecciones contra cortocircuitos",
                opciones: [
                    "Fusibles",
                    "Relés directos",
                    "Relés indirectos"
                ]
            },
            {
                tipo: "protecciones",
                id: "3.4.3",
                titulo: "Protecciones contra sobrecargas",
                opciones: [
                    "Fusibles",
                    "Relés directos",
                    "Relés indirectos",
                    "Termómetro",
                    "Interruptor BT (Transformadores AT/BT)"
                ]
            }
        ]
    },
    {
        titulo: "4. INSTALACIÓN DE PUESTA A TIERRA",
        preguntas: [
            "4.1 Elementos conectados a tierra de protección",
            "4.1.1 Chasis y bastidores",
            "4.1.2 Envolventes metálicas",
            "4.1.9 Carcasas transformadores",
            "4.1.11 Derivaciones a tierra"
        ]
    },
    {
        titulo: "5. INSTALACIONES DE INTERIOR",
        controlAplica: true,
        preguntas: [
            "5.1 Accesos y pasos",
            "5.1.4 Ventilación",
            "5.2.3 Celdas de alta tensión",
            "5.2.6 Iluminación"
        ]
    },
    {
        titulo: "6. INSTALACIONES DE EXTERIOR",
        controlAplica: true,
        preguntas: [
            "6.1 Vallado adecuado",
            "6.1.2 Carteles de riesgo",
            "6.1.5 Sin corrosión"
        ]
    }
];

// ===================================================
// NAVEGACIÓN
// ===================================================
function cambiarHoja(n) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    const hoja = document.getElementById("hoja" + n);
    if (hoja) hoja.style.display = "block";

    if (n === 2) renderDoc();
    if (n === 3 && contadorTrafos === 0) añadirFormularioTrafo();
    if (n === 4) {
        seccionActual = 0;
        renderSeccion();
    }
    if (n === 1) setTimeout(iniciarFirma, 50);

    window.scrollTo(0, 0);
}

// ===================================================
// CHECKLIST
// ===================================================
function renderDoc() {
    const c = document.getElementById("contenedor-doc");
    let h = '<div class="card">';
    seccionesChecklist[0].preguntas.forEach((p, i) => {
        h += filaChecklist(`d_${i}`, p);
    });
    c.innerHTML = h + "</div>";
}

function renderSeccion() {
    const seccion = seccionesChecklist[seccionActual];
    if (!seccion) return;

    document.getElementById("titulo-seccion").innerText = seccion.titulo;
    const cont = document.getElementById("contenedor-preguntas");
    cont.innerHTML = "";

    if (seccion.controlAplica) {
        const idBloque = "bloque_" + seccionActual;
        cont.innerHTML = `
            <div class="card">
                <label>
                    <input type="checkbox"
                        onchange="document.getElementById('${idBloque}').style.display=this.checked?'block':'none'">
                    Aplica esta sección
                </label>
            </div>
            <div id="${idBloque}" style="display:none;"></div>
        `;
        const bloque = document.getElementById(idBloque);
        seccion.preguntas.forEach((p, i) => {
            bloque.innerHTML += filaChecklist(`s${seccionActual}_${i}`, p);
        });
        return;
    }

    seccion.preguntas.forEach((p, i) => {
        cont.innerHTML += filaChecklist(`s${seccionActual}_${i}`, p);
    });
}

function filaChecklist(id, pregunta) {
    if (typeof pregunta === "string") {
        return `
        <div class="fila-at">
            <span class="pregunta-txt">${pregunta}</span>
            <div class="selector-fna">
                <input type="radio" name="${id}" id="${id}_f">
                <label for="${id}_f" class="lbl-f">F</label>

                <input type="radio" name="${id}" id="${id}_x">
                <label for="${id}_x" class="lbl-x">X</label>

                <input type="radio" name="${id}" id="${id}_na">
                <label for="${id}_na" class="lbl-na">NA</label>
            </div>
        </div>`;
    }

    if (pregunta.tipo === "protecciones") {
        const checks = pregunta.opciones.map(op => `
            <label style="display:block;font-size:0.75rem;">
                <input type="checkbox"> ${op}
            </label>
        `).join("");

        return `
        <div class="fila-at fila-protecciones" style="flex-direction:column;align-items:flex-start;">
            <b>${pregunta.id} ${pregunta.titulo}</b>
            <div class="selector-fna">
                <input type="radio" name="${id}" id="${id}_f"><label for="${id}_f" class="lbl-f">F</label>
                <input type="radio" name="${id}" id="${id}_x"><label for="${id}_x" class="lbl-x">X</label>
                <input type="radio" name="${id}" id="${id}_na"><label for="${id}_na" class="lbl-na">NA</label>
            </div>
            <div>${checks}</div>
        </div>`;
    }
}

// ===================================================
// NAVEGACIÓN CHECKLIST
// ===================================================
function irAdelante() {
    if (seccionActual < seccionesChecklist.length - 1) {
        seccionActual++;
        renderSeccion();
    } else {
        alert("Inspección finalizada");
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

// ===================================================
// EQUIPOS / GPS
// ===================================================
function añadirEquipoMedida() {
    const i = document.getElementById("eq-referencia");
    const l = document.getElementById("lista-equipos");
    if (!i.value.trim()) return;
    const li = document.createElement("li");
    li.textContent = i.value;
    l.appendChild(li);
    i.value = "";
}

function iniciarInspeccion() {
    if (!navigator.geolocation) {
        alert("GPS no disponible");
        return;
    }
    navigator.geolocation.getCurrentPosition(pos => {
        datosSesion.gps = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        document.getElementById("gps-display").innerText = datosSesion.gps;
        document.getElementById("datos-inicio").style.display = "block";
    });
}

// ===================================================
// FIRMA
// ===================================================
let canvas, ctx, dib = false;

function iniciarFirma() {
    canvas = document.getElementById("canvas-firma");
    if (!canvas) return;

    const r = canvas.getBoundingClientRect();
    canvas.width = r.width;
    canvas.height = r.height;

    ctx = canvas.getContext("2d");
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    canvas.style.touchAction = "none";

    const pos = e => {
        const b = canvas.getBoundingClientRect();
        const p = e.touches ? e.touches[0] : e;
        return { x: p.clientX - b.left, y: p.clientY - b.top };
    };

    const start = e => {
        e.preventDefault();
        dib = true;
        const p = pos(e);
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
    };

    const move = e => {
        if (!dib) return;
        e.preventDefault();
        const p = pos(e);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
    };

    const end = () => dib = false;

    canvas.onmousedown = start;
    canvas.onmousemove = move;
    canvas.ontouchstart = start;
    canvas.ontouchmove = move;
    window.onmouseup = end;
    window.ontouchend = end;
}

function limpiarFirma() {
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===================================================
// TRANSFORMADOR
// ===================================================
function añadirFormularioTrafo() {
    contadorTrafos++;
    const c = document.getElementById("contenedor-trafos-datos");
    const d = document.createElement("div");
    d.className = "card";
    d.innerHTML = `<h3>Transformador ${contadorTrafos}</h3>
        <input class="input-modern" placeholder="Marca">
        <input class="input-modern" placeholder="Nº Serie">`;
    c.appendChild(d);
}

// ===================================================
// ARRANQUE SEGURO (LOCAL + GITHUB)
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
    cambiarHoja(1);
    iniciarFirma();
});
