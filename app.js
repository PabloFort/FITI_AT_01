// ===================================================
// VARIABLES GLOBALES
// ===================================================
let equiposMedida = [];
let datosSesion = { inspector:"", expediente:"", gps:"", firmaImg:"" };
let seccionActual = 1;
let contadorTrafos = 0;
let contadorTierras = 0;
let fotoTierraBase64 = "";

function cargarFotoTierra(input) {
    const file = input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        fotoTierraBase64 = e.target.result;
        const img = document.getElementById("preview_foto_tierra");
        img.src = fotoTierraBase64;
        img.style.display = "block";
    };
    reader.readAsDataURL(file);
}

// ===================================================
// CHECKLIST (INTACTO)
// ===================================================
const seccionesChecklist = [
{
    titulo: "1. DOCUMENTACIÓN",
    preguntas: [
        "1.1 Contrato de mantenimiento (según comunidad autónoma)",
        "1.2 Instrucciones de operación, libro de control y mantenimiento",
        "1.3 Correspondencia entre documentación e instalación",
        "1.4 La documentación es conforme (Proyecto, CFO, certificado de instalador autorizado)"
    ]

    },
    {
        titulo:"2. COMPROBACIONES TRANSFORMADOR",
        preguntas:[
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
            "4.1.2 Envolventes de los conjuntos de armarios metálicos",
            "4.1.3 Puertas y ventanas metálicas (excepto 3ª categoría)",
            "4.1.4 Vallas y cercas metálicas",
            "4.1.5 Columnas, soportes, pórticos, apoyos, etc.",
            "4.1.6 Estructuras y armaduras metálicas de edificios con AT",
            "4.1.7 Armaduras metálicas de los cables",
            "4.1.8 Tuberías y conductos metálicos",
            "4.1.9 Carcasas de transformadores, generadores y motores",
            "4.1.10 Hilos de guarda o cables de tierra de líneas aéreas",
            "4.1.11 Derivaciones a tierra de seccionadores de puesta a tierra",
            "4.1.12 Pantallas de separación primario/secundario",

            "4.2 Elementos a conectar a tierra por motivos de servicio",
            "4.2.1 Neutros de transformadores (rígido o por impedancia)",
            "4.2.2 Neutro de alternadores",
            "4.2.3 Circuitos BT de transformadores de medida/protección",
            "4.2.4 Autoválvulas, descargadores, pararrayos",
            "4.2.5 Envolventes BT sin aislamiento suficiente",
            "4.2.6 Tierras separadas (CT, limitadores, telefonía, etc.)",

            "4.3 Instalación de puesta a tierra",
            "4.3.1 Trazados cortos y sin interruptores ni fusibles",
            "4.3.2 Instalación visible o accesible",
            "4.3.3 Continuidad, empalmes y uniones correctos",
            "4.3.4 Sección de conductores correcta",

            "4.4 Valores de resistencia de tierra y tensiones",
            "4.4.1 Valores elevados respecto anteriores (3ª categoría)",
            "4.4.2 Valores por debajo de configuraciones tipo",
            "4.4.3 Tensiones de contacto bajo máximos admisibles",
            "4.4.4 Tensiones de paso bajo máximos admisibles",
            "4.4.5 No existen tensiones transferidas peligrosas"
        ]
    },
    {
    titulo: "5. INSTALACIONES DE INTERIOR",
    controlAplica: true,
    preguntas: [

        "5.1 Recinto",
        "5.1.1 Las condiciones de accesos y pasos son correctas",
        "5.1.2 Cerramientos de los recintos",
        "5.1.3 Entrada de líneas y canalizaciones al recinto",
        "5.1.4 Ventilación adecuada",

        "5.2 Características de la instalación",
        "5.2.1 Canalizaciones eléctricas; ubicación, accesibilidad y características",
        "5.2.2 Ubicación de cuadros y pupitres",
        "5.2.3 Celdas de alta tensión (características, separación, dieléctrico inflamable > 50 l con medios de propagación explosión, etc.)",
        "5.2.4 Instalaciones adecuadas de almacenamiento de aguas, alcantarillado y fluidos combustibles",
        "5.2.5 Instalaciones y objetos ajenos al servicio",
        "5.2.6 Iluminación adecuada",
        "5.2.7 Alumbrados especiales de emergencia (instalaciones con personal permanente o locales de pública concurrencia)",
        "5.2.8 Aislamiento de terminaciones de líneas con cables",
        "5.2.9 Aislamiento de puentes de cables",

        "5.3 Pasillos de servicio y maniobra",
        "5.3.1 Pasillos de servicio de características y dimensiones adecuadas",
        "5.3.2 Zonas de protección contra contactos accidentales (pantallas, barreras, bornas aisladas, mandos, etc.)",
        "5.3.3 Adecuados los medios para la limitación de campos magnéticos en edificios habitables o anexos",

        "5.4 Sistema contra incendios",
        "5.4.1 Dispositivo de recogida de aceites (> 50 litros)",
        "5.4.2 Fosos con cortafuegos (Tmin ≈ 300 ºC) (lechograva, sifones con fosos con colector único, etc.)",
        "5.4.3 Existencia, ubicación y eficacia adecuada para extintores móviles",
        "5.4.4 Sistemas de extinción fijos (características, instrucciones, plano, etc.)",

        "5.5 Elementos de seguridad y señalización",
        "5.5.1 Señalización e instrucciones (puertas de entrada, cabinas, elementos de maniobra, esquemas unifilares, instrucciones de servicio)",
        "5.5.2 Elementos de seguridad para realización de maniobras (guantes, banquetas, alfombra, pértigas, etc.)",
        "5.5.3 Instrucciones y elementos de primeros auxilios"
    ]

    },
    {
    titulo: "6. INSTALACIONES DE EXTERIOR",
    controlAplica: true,
    preguntas: [

        "6.1 Características de la instalación",

        "6.1.1 Vallado adecuado (altura ≥ 2,2 m)",
        "6.1.2 Carteles de riesgo eléctrico",
        "6.1.3 Terreno adecuado y protegido frente a polvo",
        "6.1.4 Canalizaciones con sistemas de drenaje",
        "6.1.5 Elementos metálicos sin corrosión",
        "6.1.6 Almacenamiento adecuado de aguas y fluidos combustibles",
        "6.1.7 Canalizaciones eléctricas; ubicación, accesibilidad y características",
        "6.1.8 Ubicación de cuadros y pupitres adecuados para intemperie",
        "6.1.9 Interruptores con aislantes inflamables en envolventes resistentes al fuego",
        "6.1.10 Alumbrados especiales de socorro o alumbrado auxiliar",
        "6.1.11 Aislamiento de terminaciones de líneas con cables",
        "6.1.12 Aislamiento de puentes de cables",

        "6.2 Pasillos de servicio y maniobra",

        "6.2.1 Pasillos de servicio de características y dimensiones adecuadas",
        "6.2.2 Zonas de protección contra contactos accidentales desde el interior",
        "6.2.3 Zonas de protección contra contactos accidentales desde el exterior",

        "6.3 Instalaciones en apoyo o a pie de apoyo",

        "6.3.1 Materiales de los apoyos (metálicos, hormigón o combinación)",
        "6.3.2 Partes en tensión no accesibles (altura ≥ 5 m o cierre de protección)",
        "6.3.3 Antiescalo en lugares frecuentados",
        "6.3.4 Dispositivo de maniobra: características y posición correctas",
        "6.3.5 Elementos de maniobra visibles o con bloqueo desde el centro de transformación",
        "6.3.6 Centros de transformación a pie de apoyo ubicados a distancia ≤ 25 m",

        "6.4 Sistema contra incendios",

        "6.4.1 Pantalla de separación entre transformadores próximos",
        "6.4.2 Fosas colectoras de líquido aislante adecuadas",
        "6.4.3 Equipos de extinción apropiados",
        "6.4.4 Existencia, ubicación y eficacia adecuada de extintores móviles",
        "6.4.5 Sistemas de extinción fijos (características, instrucciones, plano, etc.)",
        "6.4.6 Proximidad y entrada de líneas aéreas"
    ]
},
{
    titulo: "7. CONTROL DE ENSAYOS",
    preguntas: [
        "7.1 El laboratorio está acreditado para realizar los ensayos",
        "7.2 Comprobación del aislamiento principal",
        "7.3 Comprobación del aislamiento de la cubierta"
    ]
}
];

// ===================================================
// NAVEGACIÓN
// ===================================================
function cambiarHoja(n){
    document.querySelectorAll('.page').forEach(p=>p.style.display="none");

    document.getElementById("hoja"+n).style.display = "block";

//  if(n === 2) renderDoc();            // 🔴 ESTO FALTABA
    if(n === 3 && contadorTrafos === 0) añadirFormularioTrafo();
    if(n === 4){ seccionActual = 0; renderSeccion(); }
    if(n === 1) setTimeout(iniciarFirma,50);
    if (n === 6 && contadorTierras === 0) {
          añadirSistemaTierra();
}


    window.scrollTo(0,0);
}

// ===================================================
// CHECKLIST RENDER
// ===================================================
function renderDoc(){
    const c=document.getElementById("contenedor-doc");
    let h='<div class="card">';
    seccionesChecklist[0].preguntas.forEach((p,i)=>{
        h+=filaChecklist(`d_${i}`,p);
    });
    c.innerHTML=h+'</div>';
}

function renderSeccion() {
    const seccion = seccionesChecklist[seccionActual];
    if (!seccion) return;

    document.getElementById("titulo-seccion").innerText = seccion.titulo;

    const contenedor = document.getElementById("contenedor-preguntas");
    contenedor.innerHTML = "";

    // === CASO ESPECIAL: secciones con "Aplica el punto" (5,6,7) ===
    if (seccion.controlAplica === true) {

        const idAplica = "aplica_" + seccionActual;
        const idBloque = "bloque_" + seccionActual;

        contenedor.innerHTML += `
            <div class="card">
                <label style="font-weight:700;">
                    <input type="checkbox" id="${idAplica}"
                        onchange="toggleAplica(this, '${idBloque}')">
                    Aplica el punto
                </label>
            </div>
        `;

        contenedor.innerHTML += `<div id="${idBloque}" style="display:none;"></div>`;

        const bloque = document.getElementById(idBloque);

        seccion.preguntas.forEach((p, i) => {
            bloque.innerHTML += filaChecklist(`s${seccionActual}_p${i}`, p);
        });

        return;
    }

    // === RESTO DE SECCIONES (1–4) ===
    seccion.preguntas.forEach((p, i) => {
        contenedor.innerHTML += filaChecklist(`s${seccionActual}_p${i}`, p);
    });
}

function filaChecklist(id, pregunta) {

    /* ============================
       CASO 1: TEXTO SIMPLE
       ============================ */
    if (typeof pregunta === "string") {

        /*
           TÍTULOS SIN CHECK:
           - 4.x
           - 5.x
           - 6.x
           (pero NO 4.x.y / 5.x.y / 6.x.y)
        */
        const esTitulo =
            /^([4-6])\.\d+\s/.test(pregunta) &&
            !/^([4-6])\.\d+\.\d+/.test(pregunta);

        if (esTitulo) {
            return `
            <div class="fila-at fila-titulo">
                <span class="pregunta-txt"><b>${pregunta}</b></span>
            </div>`;
        }

        // ÍTEM NORMAL → con F / X / NA
        return `
<div class="fila-at">
    <span class="pregunta-txt">${pregunta}</span>

    <div class="selector-fna">
        <input type="radio" name="${id}" id="${id}_f"
               onchange="toggleObs('${id}', false)">
        <label for="${id}_f" class="lbl-f">F</label>

        <input type="radio" name="${id}" id="${id}_x"
               onchange="toggleObs('${id}', true)">
        <label for="${id}_x" class="lbl-x">X</label>

        <input type="radio" name="${id}" id="${id}_na"
               onchange="toggleObs('${id}', false)">
        <label for="${id}_na" class="lbl-na">NA</label>
    </div>

    <div id="obs_${id}" style="display:none; margin-top:6px;">
        <textarea id="obs_text_${id}"
                  class="input-modern"
                  rows="2"
                  placeholder="Observación del defecto (opcional)"></textarea>
    </div>
</div>`;
    }

    /* ============================
       CASO 2: PROTECCIONES (3.4.x)
       ============================ */
    if (pregunta.tipo === "protecciones") {

        const checks = pregunta.opciones.map((op, i) => `
            <label style="display:block;font-size:0.7rem;">
                <input type="checkbox" name="${id}_opt_${i}"> ${op}
            </label>
        `).join("");

        return `
        <div class="fila-at fila-protecciones" style="flex-direction:column;align-items:flex-start;">
            <span class="pregunta-txt"><b>${pregunta.id} ${pregunta.titulo}</b></span>

            <div class="selector-fna" style="margin:6px 0;">
                <input type="radio" name="${id}" id="${id}_f">
                <label for="${id}_f" class="lbl-f">F</label>

                <input type="radio" name="${id}" id="${id}_x">
                <label for="${id}_x" class="lbl-x">X</label>

                <input type="radio" name="${id}" id="${id}_na">
                <label for="${id}_na" class="lbl-na">NA</label>
            </div>

            <div style="margin-left:10px;">
                ${checks}
            </div>
        </div>`;
    }
}
function irAdelante(){
    if (seccionActual < seccionesChecklist.length - 1) {
        seccionActual++;
        renderSeccion();
    } else {
        // ✅ FIN DEL CHECKLIST → GENERAR CERTIFICADO
        generarCertificado();
    }
}

function irAtras(){
    if(seccionActual>0){ seccionActual--; renderSeccion(); }
    else cambiarHoja(3);
}

function toggleInicial(esInicial) {
    document.getElementById("bloque_inicial").style.display =
        esInicial ? "block" : "none";
}

// ===================================================
// EQUIPOS / GPS / FIRMA
// ===================================================
function añadirEquipoMedida(){
    const i=document.getElementById("eq-referencia");
    const l=document.getElementById("lista-equipos");
    if(!i.value.trim())return;
    const li=document.createElement("li");
    li.textContent=i.value;
    l.appendChild(li);
    i.value="";
}

function iniciarInspeccion(){
    if(!navigator.geolocation) return alert("GPS no disponible");
    navigator.geolocation.getCurrentPosition(p=>{
        datosSesion.gps=`${p.coords.latitude.toFixed(5)}, ${p.coords.longitude.toFixed(5)}`;
        document.getElementById("gps-display").innerText=datosSesion.gps;
        document.getElementById("datos-inicio").style.display="block";
    });
}

// ===================================================
// FIRMA
// ===================================================
let canvas,ctx,dib=false;
function iniciarFirma(){
    canvas=document.getElementById("canvas-firma");
    if(!canvas)return;
    const r=canvas.getBoundingClientRect();
    canvas.width=r.width; canvas.height=r.height;
    ctx=canvas.getContext("2d");
    ctx.lineWidth=2; ctx.lineCap="round";
    canvas.style.touchAction="none";

    const pos=e=>{
        const b=canvas.getBoundingClientRect();
        const p=e.touches?e.touches[0]:e;
        return {x:p.clientX-b.left,y:p.clientY-b.top};
    };
    const start=e=>{e.preventDefault();dib=true;const p=pos(e);ctx.beginPath();ctx.moveTo(p.x,p.y);}
    const move=e=>{if(!dib)return;e.preventDefault();const p=pos(e);ctx.lineTo(p.x,p.y);ctx.stroke();}
    const end=()=>dib=false;

    canvas.onmousedown=start;
    canvas.onmousemove=move;
    canvas.ontouchstart=start;
    canvas.ontouchmove=move;
    window.onmouseup=end;
    window.ontouchend=end;
}
function limpiarFirma(){ if(ctx)ctx.clearRect(0,0,canvas.width,canvas.height); }

// ===================================================
// TRANSFORMADOR – HOJA OCA
// ===================================================
function añadirFormularioTrafo(){
    contadorTrafos++;
    const id = contadorTrafos;
    const c = document.getElementById("contenedor-trafos-datos");

    const d = document.createElement("div");
    d.className = "card";

    d.innerHTML = `
    <h3 class="trafo-header">Transformador nº ${id}</h3>

    <!-- ================= CARACTERÍSTICAS ================= -->
    <div class="ensayo-seccion">
        <p class="section-tag">Características</p>

        <div class="grid-tecnico">
            <div><label class="mini-label">Marca</label><input class="input-modern"></div>
            <div><label class="mini-label">Modelo</label><input class="input-modern"></div>

            <div><label class="mini-label">Norma UNE</label><input class="input-modern"></div>
            <div><label class="mini-label">Nº fabricación</label><input class="input-modern"></div>

            <div><label class="mini-label">Fecha fabricación</label><input type="date" class="input-modern"></div>
            <div><label class="mini-label">Potencia (kVA)</label><input class="input-modern"></div>

            <div><label class="mini-label">Impedancia (%) / T(ºC)</label><input class="input-modern"></div>
            <div><label class="mini-label">Grupo conexión</label><input class="input-modern"></div>

            <div><label class="mini-label">Tensión P/S (V)</label><input class="input-modern"></div>
            <div><label class="mini-label">Intensidad P/S (A)</label><input class="input-modern"></div>

            <div><label class="mini-label">Dieléctrico</label><input class="input-modern"></div>
            <div><label class="mini-label">Volumen de aceite (L)</label><input class="input-modern"></div>

            <div><label class="mini-label">Posición regulador tensión</label><input class="input-modern"></div>
        </div>

        <label class="mini-label" style="margin-top:8px;">Conexión del neutro</label>
        <div class="grid-tecnico">
            <label><input type="radio" name="neutro_${id}"> Rígido a tierra</label>
            <label><input type="radio" name="neutro_${id}"> Aislado</label>
            <label><input type="radio" name="neutro_${id}"> Por impedancia</label>
        </div>

                    <label class="mini-label" style="margin-top:8px;">Tipo de transformador</label>
                    <div class="grid-tecnico">
                    <label><input type="radio" name="tipo_${id}"> Seco</label>
                    <label><input type="radio" name="tipo_${id}"> Baño de líquido</label>
</div>

<label class="mini-label" style="margin-top:8px;">Tipo de refrigeración</label>
<div class="grid-tecnico">
    <label><input type="radio" name="refrig_${id}"> Natural</label>
    <label><input type="radio" name="refrig_${id}"> Forzada</label>
</div>

    </div>

    <!-- ================= ELEMENTOS ================= -->
    <div class="ensayo-seccion">
        <p class="section-tag">Elementos y protecciones</p>

        ${elem("Relé Buchholz / Jansen")}
        ${elem("Termostato", true)}
        ${elem("Silicagel")}
        ${elem("Nivel dieléctrico")}
        ${elem("Ventilación forzada")}
        ${elem("Foso recogida aceites / apagafuegos")}
        ${elem("Conexión a tierra chasis")}
        ${elem("Anclaje")}
    </div>

    <!-- ================= ENSAYOS ================= -->
    <div class="ensayo-seccion">
        <label>
            <input type="checkbox" onchange="this.nextElementSibling.style.display=this.checked?'block':'none'">
            Se realizan ensayos eléctricos
        </label>

        <div style="display:none; margin-top:10px;">
            <p class="section-tag">Rigidez dieléctrica</p>
            <div class="grid-ensayos">
                <input class="input-mini"><input class="input-mini"><input class="input-mini">
                <input class="input-mini"><input class="input-mini">
                <input class="input-mini media-box" readonly placeholder="Media">
            </div>

            <p class="section-tag">Resistencia de aislamiento</p>
            <table class="tabla-aislamiento">
                <tr><td>Izq.</td><td><input class="input-mini"></td><td><input class="input-mini"></td></tr>
                <tr><td>Central</td><td><input class="input-mini"></td><td><input class="input-mini"></td></tr>
                <tr><td>Der.</td><td><input class="input-mini"></td><td><input class="input-mini"></td></tr>
            </table>
        </div>
    </div>
    `;

    c.appendChild(d);
}

function elem(nombre, conTemp = false) {
    const id = nombre.replace(/\s+/g, "_");

    return `
    <div class="elem-row" style="flex-direction:column;align-items:flex-start;gap:6px;">
        <span><b>${nombre}</b></span>

        <label style="font-size:0.75rem;">
            <input type="checkbox"
                   onchange="document.getElementById('det_${id}').style.display=this.checked?'flex':'none'">
            Aplica
        </label>

        <div id="det_${id}" style="display:none; gap:10px; align-items:center;">
            <label><input type="radio" name="estado_${id}"> C</label>
            <label><input type="radio" name="estado_${id}"> N/C</label>
            ${conTemp ? '<input class="input-mini" placeholder="ºC">' : ''}
        </div>
    </div>`;
}

function toggleAplica(checkbox, idBloque) {
    document.getElementById(idBloque).style.display =
        checkbox.checked ? "block" : "none";
}

function generarTextoTransformadores() {
    if (contadorTrafos === 0) return "";

    let texto = `Centro con ${contadorTrafos} transformador(es):\n\n`;

    for (let i = 1; i <= contadorTrafos; i++) {
        const marca = document.querySelector(`#trafo_${i}_marca`)?.value || "";
        const modelo = document.querySelector(`#trafo_${i}_modelo`)?.value || "";
        const numero = document.querySelector(`#trafo_${i}_numero`)?.value || "";
        const potencia = document.querySelector(`#trafo_${i}_potencia`)?.value || "";

        texto += `– Transformador ${i}:\n`;
        if (marca) texto += `  Marca: ${marca}\n`;
        if (modelo) texto += `  Modelo: ${modelo}\n`;
        if (numero) texto += `  Nº: ${numero}\n`;
        if (potencia) texto += `  Potencia: ${potencia} kVA\n`;
        texto += `\n`;
    }

    return texto;
}

async function exportarCertificadoPDF() {
    try {
        const { PDFDocument } = PDFLib;

        const response = await fetch("modelo_certificado.pdf");
        if (!response.ok) throw new Error("No se pudo cargar el PDF base");

        const pdfBytes = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const form = pdfDoc.getForm();

        // ================= CABECERA =================
        form.getTextField("N_expediente")
            .setText(cert_expediente.value || "");

        // ================= TITULAR =================
        form.getTextField("Nombre_titular")
            .setText(cert_titular_nombre.value || "");
        form.getTextField("CIF_titular")
            .setText(cert_titular_cif.value || "");
        form.getTextField("Telefono_titular")
            .setText(cert_titular_telefono.value || "");
        form.getTextField("Domicilio_social")
            .setText(cert_titular_direccion.value || "");
        form.getTextField("CP_titular")
            .setText(cert_titular_cp.value || "");
        form.getTextField("Poblacion_titular")
            .setText(cert_titular_cp.value || "");
        form.getTextField("Provincia_titular")
            .setText(cert_titular_provincia.value || "");

        // ================= INSTALACIÓN =================
        form.getTextField("Denominacion_de_la_instalacion")
            .setText(cert_inst_denominacion.value || "");
        form.getTextField("Direccion_instalacion")
            .setText(cert_inst_direccion.value || "");
        form.getTextField("CP_instalacion")
            .setText(cert_inst_cp.value || "");
        form.getTextField("Poblacion_instalacion")
            .setText(cert_inst_cp.value || "");
        form.getTextField("Provincia_instalacion")
            .setText(cert_inst_provincia.value || "");

        // ================= DATOS TÉCNICOS =================
        form.getTextField("Tensiones_servicio")
            .setText(cert_tensiones.value || "");
        form.getTextField("Potencia_instalada")
            .setText(cert_potencia_total.value || "");

        // ================= FECHA =================
        form.getTextField("Fecha_ultima_inspeccion")
            .setText(cert_fecha.value || "");

// ================= REGLAMENTO =================
if (cert_inst_reglamento.value === "1982") {
    form.getCheckBox("RCE_1982").check();
}
if (cert_inst_reglamento.value === "2014") {
    form.getCheckBox("RAT_2014").check();
}

// ================= TIPO DE INSPECCIÓN =================
const tipoPrincipal =
    document.querySelector('input[name="insp_tipo_principal"]:checked')?.value || "";

if (tipoPrincipal === "Inicial") {
    form.getCheckBox("Inicial").check();

    if (document.getElementById("insp_nueva")?.checked)
        form.getCheckBox("Nueva").check();

    if (document.getElementById("insp_ampliacion")?.checked)
        form.getCheckBox("Ampliacion").check();

    if (document.getElementById("insp_modificacion")?.checked)
        form.getCheckBox("Modificacion").check();
}

if (tipoPrincipal === "Periodica") {
    form.getCheckBox("Periodica").check();
}

// ================= TIPO DE INSTALACIÓN =================
if (cert_tipo_instalacion.value === "Interior")
    form.getCheckBox("Interior").check();

if (cert_tipo_instalacion.value === "Exterior")
    form.getCheckBox("Exterior").check();

// (si más adelante usas CT poste)
if (cert_tipo_instalacion.value === "CT_poste")
    form.getCheckBox("CT_poste_Intemperie").check();

// ================= SOBRETENSIONES =================
if (cert_sobretensiones.value === "Si")
    form.getCheckBox("Sobretensiones_SI").check();

if (cert_sobretensiones.value === "No")
    form.getCheckBox("Sobretensiones_NO").check();

// =================LINEA DE ALIMENTACION=============

if (cert_linea_alimentacion.value === "Aerea")
    form.getCheckBox("LA").check();

if (cert_linea_alimentacion.value === "Subterranea")
    form.getCheckBox("LS").check();

if (cert_linea_alimentacion.value === "Mixta")
    form.getCheckBox("LM").check();

// =================VALORES DE TIERRA===============

const estadoTerreno =
    document.querySelector('input[name="estado_terreno"]:checked')?.value || "";

form.getTextField("Estado_terreno").setText(estadoTerreno);

form.getTextField("Tierra_1")
    .setText(document.getElementById("tierra_1")?.value || "");
form.getTextField("Valor_t1")
    .setText(document.getElementById("valor_t1")?.value || "");

form.getTextField("Tierra_2")
    .setText(document.getElementById("tierra_2")?.value || "");
form.getTextField("Valor_t2")
    .setText(document.getElementById("valor_t2")?.value || "");

form.getTextField("Tierra_3")
    .setText(document.getElementById("tierra_3")?.value || "");
form.getTextField("Valor_t3")
    .setText(document.getElementById("valor_t3")?.value || "");

form.getTextField("Tierra_4")
    .setText(document.getElementById("tierra_4")?.value || "");
form.getTextField("Valor_t4")
    .setText(document.getElementById("valor_t4")?.value || "");

// =================TRANSFORMADOR===============
const textoTrafos = generarTextoTransformadores();

if (textoTrafos) {
    form.getTextField("Elementos_instalacion").setText(textoTrafos);
}

// ================= DEFECTOS DEL CHECKLIST (TABLA PDF) =================
const defectos = recogerDefectos();
const MAX_DEFECTOS = 10;

defectos.slice(0, MAX_DEFECTOS).forEach((def, i) => {
    const idx = i + 1;

    // Nº
    form.getTextField(`N${idx}`).setText(String(idx));

    // REF (numeración checklist)
    form.getTextField(`RF${idx}`).setText(def.ref || "");

    // Descripción + observación
    const descripcion = def.obs
        ? `${def.texto}. ${def.obs}`
        : def.texto;

    form.getTextField(`D${idx}`).setText(descripcion);

    // Calificación: se deja vacía (la elige el inspector en el PDF)
    // form.getTextField(`CD${idx}`)

    // Plazo: se calculará después según CDx
});


// ❗ NO flatten todavía
const pdfFinal = await pdfDoc.save();
const blob = new Blob([pdfFinal], { type: "application/pdf" });

const a = document.createElement("a");
a.href = URL.createObjectURL(blob);
a.download = "certificado_campos_texto_completo.pdf";
a.click();

    } catch (e) {
        alert("ERROR PDF: " + e.message);
        console.error(e);
    }
}

function generarCertificado() {
    const cert = {
        expediente: document.getElementById("expediente")?.value || "",
        fecha: new Date().toLocaleDateString(),

        titular: {
            nombre: titular_nombre.value,
            cif: titular_cif.value,
            telefono: titular_telefono.value,
            direccion: titular_direccion.value,
            cp: titular_cp.value,
            provincia: titular_provincia.value
        },

        instalacion: {
            denominacion: inst_denominacion.value,
            direccion: inst_direccion.value,
            cp: inst_cp.value,
            provincia: inst_provincia.value,
            registro: inst_registro.value,
            reglamento: document.querySelector('input[name="inst_reglamento"]:checked')?.value || ""
        }
    };

    // Rellenar formulario certificado
    cert_expediente.value = cert.expediente;
    cert_fecha.value = cert.fecha;

    cert_titular_nombre.value = cert.titular.nombre;
    cert_titular_cif.value = cert.titular.cif;
    cert_titular_telefono.value = cert.titular.telefono;
    cert_titular_direccion.value = cert.titular.direccion;
    cert_titular_cp.value = cert.titular.cp;
    cert_titular_provincia.value = cert.titular.provincia;

    cert_inst_denominacion.value = cert.instalacion.denominacion;
    cert_inst_direccion.value = cert.instalacion.direccion;
    cert_inst_cp.value = cert.instalacion.cp;
    cert_inst_provincia.value = cert.instalacion.provincia;
    cert_inst_registro.value = cert.instalacion.registro;
    cert_inst_reglamento.value = cert.instalacion.reglamento;

// ===== DATOS TÉCNICOS =====
const tipoInst = document.querySelector('input[name="tipo_inst"]:checked')?.value || "";
const lineaAlim = document.querySelector('input[name="linea_alim"]:checked')?.value || "";
const sobret = document.querySelector('input[name="sobretensiones"]:checked')?.value || "";

cert_tipo_instalacion.value = tipoInst;
cert_linea_alimentacion.value = lineaAlim;
cert_sobretensiones.value = sobret;

cert_tensiones.value =
    document.querySelector('#inst_tensiones')?.value || "";

cert_potencia_total.value =
    document.querySelector('#inst_potencia_total')?.value || "";

cert_empresa_distribuidora.value =
    document.querySelector('#inst_empresa_distribuidora')?.value || "";

    cambiarHoja(5);
}

function toggleObs(id, show) {
    const el = document.getElementById(`obs_${id}`);
    if (el) el.style.display = show ? "block" : "none";
}
function recogerDefectos() {
    const defectos = [];

    document.querySelectorAll('.fila-at').forEach(fila => {
        const marcadoX = fila.querySelector('input[id$="_x"]:checked');
        if (!marcadoX) return;

        const idBase = marcadoX.id.replace('_x', '');
        const textoCompleto = fila.querySelector('.pregunta-txt')?.innerText || "";
        const match = textoCompleto.match(/^([\d.]+)\s+(.*)$/);

        const ref = match ? match[1] : "";
        const texto = match ? match[2] : textoCompleto;

        const obs = document.getElementById(`obs_text_${idBase}`)?.value || "";

        defectos.push({
                    ref,
                    texto,
                    obs
});


    return defectos;
}

function textoDefectosParaPDF(defectos) {
    if (!defectos.length) return "Sin defectos.";

    let texto = "DEFECTOS DETECTADOS:\n\n";

    defectos.forEach((d, i) => {
        texto += `${i + 1}. ${d.pregunta}\n`;
        if (d.obs) texto += `   Observación: ${d.obs}\n`;
        texto += `\n`;
    });

    return texto;
}

function añadirSistemaTierra() {
    contadorTierras++;
    const id = contadorTierras;

    const cont = document.getElementById("contenedor-tierras");

    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p class="section-tag">Sistema de puesta a tierra ${id}</p>

      <label class="mini-label">Sistema de puesta a tierra</label>
      <input id="tierra_sistema_${id}" class="input-modern">

      <div class="grid-tecnico">
        <div>
          <label class="mini-label">Valor inspección (Ω)</label>
          <input id="tierra_valor_${id}" class="input-modern" type="number" step="any">
        </div>

        <div>
          <label class="mini-label">Valor anterior (Ω)</label>
          <input id="tierra_valor_ant_${id}" class="input-modern" type="number" step="any">
        </div>
      </div>
    `;

    cont.appendChild(div);
}

function plazoSegunCalificacion(calificacion) {
    if (calificacion === "Leve") return "Próxima inspección";
    if (calificacion === "Grave") return "6 meses";
    if (calificacion === "Muy Grave") return "Inmediato";
    return "";
}

// ===================================================
// ARRANQUE SEGURO (LOCAL + GITHUB PAGES)
// ===================================================
document.addEventListener("DOMContentLoaded", () => {
    // Mostrar hoja inicial
    cambiarHoja(1);

    // Inicializar firma cuando el canvas ya existe
    iniciarFirma();
});

