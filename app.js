/* ============================================ */
/* app.js — BecaTrack                           */
/* Lógica principal de la aplicación SPA        */
/* ============================================ */

// ============================================
// CONSTANTES Y CLAVES DE LOCALSTORAGE
// ============================================
const STORAGE_KEY = 'becatrack_estudiantes';

// ============================================
// DATOS POR DEFECTO — 6 ESTUDIANTES
// ============================================
const ESTUDIANTES_POR_DEFECTO = [
    {
        id: 1,
        nombre: 'Ana María López',
        programa: 'Ingeniería de Sistemas',
        semestre: '3°',
        asistencia: '—',
        nota: null,
        estado: 'Normal',
        observaciones: []
    },
    {
        id: 2,
        nombre: 'Carlos Andrés Pérez',
        programa: 'Administración de Empresas',
        semestre: '2°',
        asistencia: '—',
        nota: null,
        estado: 'Normal',
        observaciones: []
    },
    {
        id: 3,
        nombre: 'Luisa Fernanda Torres',
        programa: 'Contaduría Pública',
        semestre: '4°',
        asistencia: '—',
        nota: null,
        estado: 'Normal',
        observaciones: []
    },
    {
        id: 4,
        nombre: 'Jhon Sebastián Ruiz',
        programa: 'Derecho',
        semestre: '1°',
        asistencia: '—',
        nota: null,
        estado: 'Normal',
        observaciones: []
    },
    {
        id: 5,
        nombre: 'Valentina Gómez',
        programa: 'Psicología',
        semestre: '5°',
        asistencia: '—',
        nota: null,
        estado: 'Normal',
        observaciones: []
    },
    {
        id: 6,
        nombre: 'Miguel Ángel Castro',
        programa: 'Medicina',
        semestre: '2°',
        asistencia: '—',
        nota: null,
        estado: 'Normal',
        observaciones: []
    }
];

// ============================================
// VARIABLES GLOBALES
// ============================================
let estudiantes = [];

// ============================================
// REFERENCIAS AL DOM
// ============================================
const vistaHome = document.getElementById('vista-home');
const vistaDocente = document.getElementById('vista-docente');
const vistaPsicologia = document.getElementById('vista-psicologia');

const btnDocente = document.getElementById('btn-docente');
const btnPsicologo = document.getElementById('btn-psicologo');
const btnVolverDocente = document.getElementById('btn-volver-docente');
const btnVolverPsicologia = document.getElementById('btn-volver-psicologia');

const tbodyEstudiantes = document.getElementById('tbody-estudiantes');
const bandejaAlertas = document.getElementById('bandeja-alertas');
const historialCasos = document.getElementById('historial-casos');

const statTotal = document.getElementById('stat-total');
const statAsistencias = document.getElementById('stat-asistencias');
const statInasistencias = document.getElementById('stat-inasistencias');
const statAlertas = document.getElementById('stat-alertas');
const statAlertaCard = document.getElementById('stat-alerta-card');

const linkAcerca = document.getElementById('link-acerca');
const linkAyuda = document.getElementById('link-ayuda');

// ============================================
// FUNCIONES DE PERSISTENCIA (LOCALSTORAGE)
// ============================================

/**
 * Carga los estudiantes desde localStorage.
 * Si no existen, carga los datos por defecto.
 */
function cargarEstudiantes() {
    const datos = localStorage.getItem(STORAGE_KEY);
    if (datos) {
        estudiantes = JSON.parse(datos);
    } else {
        // Primera vez: cargar datos por defecto
        estudiantes = JSON.parse(JSON.stringify(ESTUDIANTES_POR_DEFECTO));
        guardarEstudiantes();
    }
}

/**
 * Guarda el array de estudiantes en localStorage.
 */
function guardarEstudiantes() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estudiantes));
}

// ============================================
// FUNCIONES DE NAVEGACIÓN (SPA)
// ============================================

/**
 * Muestra una vista y oculta las demás.
 * @param {string} vistaId - ID de la vista a mostrar.
 */
function mostrarVista(vistaId) {
    // Ocultar todas las vistas
    vistaHome.classList.remove('activa');
    vistaDocente.classList.remove('activa');
    vistaPsicologia.classList.remove('activa');

    // Mostrar la vista solicitada
    const vista = document.getElementById(vistaId);
    vista.classList.add('activa');

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Navega a la vista Docente.
 */
function irADocente() {
    mostrarVista('vista-docente');
    renderizarTabla();
    actualizarEstadisticas();
}

/**
 * Navega a la vista Psicología.
 */
function irAPsicologia() {
    mostrarVista('vista-psicologia');
    renderizarBandejaAlertas();
    renderizarHistorialCasos();
}

/**
 * Navega a la vista Home.
 */
function irAHome() {
    mostrarVista('vista-home');
}

// ============================================
// FUNCIONES DE ESTADÍSTICAS
// ============================================

/**
 * Actualiza las tarjetas de resumen estadístico.
 */
function actualizarEstadisticas() {
    const total = estudiantes.length;
    const asistencias = estudiantes.filter(e => e.asistencia === 'Asistió').length;
    const inasistencias = estudiantes.filter(e => e.asistencia === 'Faltó').length;
    const alertas = estudiantes.filter(e => e.estado === 'Alerta').length;

    statTotal.textContent = total;
    statAsistencias.textContent = asistencias;
    statInasistencias.textContent = inasistencias;
    statAlertas.textContent = alertas;

    // Resaltar tarjeta de alertas si hay casos
    if (alertas > 0) {
        statAlertaCard.classList.add('alerta-activa');
    } else {
        statAlertaCard.classList.remove('alerta-activa');
    }
}

// ============================================
// FUNCIONES DE RENDERIZADO — DOCENTE
// ============================================

/**
 * Renderiza la tabla de estudiantes en la vista Docente.
 */
function renderizarTabla() {
    tbodyEstudiantes.innerHTML = '';

    estudiantes.forEach(function(est, index) {
        const tr = document.createElement('tr');

        // Clases condicionales para resaltar filas
        if (est.nota !== null && (est.nota === 1 || est.nota === 2)) {
            tr.classList.add('fila-nota-baja');
        } else if (est.estado === 'Alerta') {
            tr.classList.add('fila-alerta');
        }

        // N°
        const tdNum = document.createElement('td');
        tdNum.textContent = index + 1;
        tr.appendChild(tdNum);

        // Nombre
        const tdNombre = document.createElement('td');
        tdNombre.textContent = est.nombre;
        tr.appendChild(tdNombre);

        // Programa
        const tdPrograma = document.createElement('td');
        tdPrograma.textContent = est.programa;
        tr.appendChild(tdPrograma);

        // Semestre
        const tdSemestre = document.createElement('td');
        tdSemestre.textContent = est.semestre;
        tr.appendChild(tdSemestre);

        // Asistencia (botones o texto registrado)
        const tdAsistencia = document.createElement('td');
        tdAsistencia.setAttribute('data-id', est.id);
        if (est.asistencia === '—') {
            // Mostrar botones para registrar
            const btnAsistio = document.createElement('button');
            btnAsistio.className = 'btn-asistencia btn-asistio';
            btnAsistio.textContent = '✅ Asistió';
            btnAsistio.setAttribute('data-accion', 'asistio');
            btnAsistio.setAttribute('data-id', est.id);
            tdAsistencia.appendChild(btnAsistio);

            const btnFalto = document.createElement('button');
            btnFalto.className = 'btn-asistencia btn-falto';
            btnFalto.textContent = '❌ Faltó';
            btnFalto.setAttribute('data-accion', 'falto');
            btnFalto.setAttribute('data-id', est.id);
            tdAsistencia.appendChild(btnFalto);
        } else {
            // Mostrar resultado registrado
            const span = document.createElement('span');
            span.className = 'asistencia-registrada ' + (est.asistencia === 'Asistió' ? 'asistio' : 'falto');
            span.textContent = est.asistencia === 'Asistió' ? '✅ Asistió' : '❌ Faltó';
            tdAsistencia.appendChild(span);
        }
        tr.appendChild(tdAsistencia);

        // Nota (select)
        const tdNota = document.createElement('td');
        const selectNota = document.createElement('select');
        selectNota.className = 'select-nota';
        selectNota.setAttribute('data-id', est.id);

        // Opciones del select
        const opciones = ['-- Nota --', 1, 2, 3, 4, 5];
        opciones.forEach(function(opcion) {
            const option = document.createElement('option');
            if (opcion === '-- Nota --') {
                option.value = '';
                option.textContent = '-- Nota --';
            } else {
                option.value = opcion;
                option.textContent = opcion;
            }
            // Seleccionar valor actual
            if (est.nota !== null && est.nota === opcion) {
                option.selected = true;
            } else if (est.nota === null && opcion === '-- Nota --') {
                option.selected = true;
            }
            selectNota.appendChild(option);
        });

        // Resaltar si nota es 1 o 2
        if (est.nota !== null && (est.nota === 1 || est.nota === 2)) {
            selectNota.classList.add('nota-baja');
        }

        tdNota.appendChild(selectNota);
        tr.appendChild(tdNota);

        // Estado
        const tdEstado = document.createElement('td');
        const badge = document.createElement('span');
        badge.className = 'estado-badge ' + (est.estado === 'Normal' ? 'estado-normal' : 'estado-alerta');
        badge.textContent = est.estado === 'Normal' ? '✅ Normal' : '🚨 En Alerta';
        tdEstado.appendChild(badge);
        tr.appendChild(tdEstado);

        // Acciones (botón remitir)
        const tdAcciones = document.createElement('td');
        const btnRemitir = document.createElement('button');
        btnRemitir.className = 'btn-remitir';
        btnRemitir.setAttribute('data-id', est.id);
        btnRemitir.setAttribute('data-accion', 'remitir');

        if (est.estado === 'Alerta') {
            btnRemitir.textContent = 'Ya remitido';
            btnRemitir.disabled = true;
        } else {
            btnRemitir.textContent = '🚨 Remitir a Psicología';
            btnRemitir.disabled = false;
        }

        tdAcciones.appendChild(btnRemitir);
        tr.appendChild(tdAcciones);

        tbodyEstudiantes.appendChild(tr);
    });
}

// ============================================
// FUNCIONES DE RENDERIZADO — PSICOLOGÍA
// ============================================

/**
 * Renderiza la bandeja de alertas en la vista Psicología.
 */
function renderizarBandejaAlertas() {
    const enAlerta = estudiantes.filter(function(est) {
        return est.estado === 'Alerta';
    });

    bandejaAlertas.innerHTML = '';

    if (enAlerta.length === 0) {
        // Mostrar mensaje de bandeja vacía
        const divVacio = document.createElement('div');
        divVacio.className = 'bandeja-vacia';
        divVacio.innerHTML =
            '<span class="bandeja-vacia-icono">&#9989;</span>' +
            '<p class="bandeja-vacia-texto">' +
            'No hay estudiantes en alerta en este momento. ' +
            'El docente aún no ha remitido ningún caso.' +
            '</p>';
        bandejaAlertas.appendChild(divVacio);
        return;
    }

    // Renderizar tarjeta por cada estudiante en alerta
    enAlerta.forEach(function(est) {
        const card = document.createElement('div');
        card.className = 'alerta-card';
        card.setAttribute('data-id', est.id);

        // Encabezado
        const header = document.createElement('div');
        header.className = 'alerta-card-header';
        header.innerHTML =
            '<div class="alerta-card-nombre">&#128680; ' + est.nombre + '</div>' +
            '<div class="alerta-card-info">' +
            '<span>Programa: ' + est.programa + '</span>' +
            '<span>Semestre: ' + est.semestre + '</span>' +
            '</div>';
        card.appendChild(header);

        // Datos del estudiante
        const datos = document.createElement('div');
        datos.className = 'alerta-card-datos';
        datos.innerHTML =
            '<div class="alerta-dato">' +
            '<span class="alerta-dato-label">Asistencia</span>' +
            '<span class="alerta-dato-valor">' + est.asistencia + '</span>' +
            '</div>' +
            '<div class="alerta-dato">' +
            '<span class="alerta-dato-label">Nota</span>' +
            '<span class="alerta-dato-valor">' + (est.nota !== null ? est.nota : '—') + '</span>' +
            '</div>' +
            '<div class="alerta-dato">' +
            '<span class="alerta-dato-label">Estado</span>' +
            '<span class="alerta-dato-valor"><span class="estado-badge estado-alerta">EN ALERTA</span></span>' +
            '</div>';
        card.appendChild(datos);

        // Historial de observaciones
        const historial = document.createElement('div');
        historial.className = 'alerta-historial';
        let historialHTML = '<div class="alerta-historial-titulo">Historial de Observaciones</div>';

        if (est.observaciones.length === 0) {
            historialHTML += '<p class="historial-vacio">No hay observaciones registradas aún.</p>';
        } else {
            est.observaciones.forEach(function(obs) {
                historialHTML +=
                    '<div class="historial-item">' +
                    '<span class="historial-item-fecha">' + obs.fecha + '</span>' +
                    '<span class="historial-item-texto">' + obs.texto + '</span>' +
                    '</div>';
            });
        }
        historial.innerHTML = historialHTML;
        card.appendChild(historial);

        // Formulario de seguimiento
        const formulario = document.createElement('div');
        formulario.className = 'alerta-formulario';
        formulario.innerHTML =
            '<div class="alerta-formulario-titulo">Registrar Seguimiento</div>' +
            '<textarea class="alerta-textarea" data-id="' + est.id + '" ' +
            'placeholder="Escribe las observaciones de la llamada de seguimiento..."></textarea>' +
            '<div class="alerta-botones">' +
            '<button class="btn-accion btn-guardar" data-accion="guardar" data-id="' + est.id + '">' +
            '&#128190; Guardar Observación</button>' +
            '<button class="btn-accion btn-resolver" data-accion="resolver" data-id="' + est.id + '">' +
            '&#9989; Resolver Caso</button>' +
            '</div>';
        card.appendChild(formulario);

        bandejaAlertas.appendChild(card);
    });
}

/**
 * Renderiza el historial de casos atendidos en psicología.
 * Muestra todos los estudiantes que han tenido observaciones registradas.
 */
function renderizarHistorialCasos() {
    // Filtrar estudiantes que tengan al menos una observación
    const casosConHistorial = estudiantes.filter(function(est) {
        return est.observaciones && est.observaciones.length > 0;
    });

    historialCasos.innerHTML = '';

    if (casosConHistorial.length === 0) {
        const divVacio = document.createElement('div');
        divVacio.className = 'historial-caso-vacio';
        divVacio.innerHTML =
            '<span class="historial-caso-vacio-icono">&#128214;</span>' +
            '<p class="historial-caso-vacio-texto">' +
            'No hay casos registrados en el historial aún.' +
            '</p>';
        historialCasos.appendChild(divVacio);
        return;
    }

    // Ordenar: primero los que están en alerta, luego los resueltos
    casosConHistorial.sort(function(a, b) {
        if (a.estado === 'Alerta' && b.estado !== 'Alerta') return -1;
        if (a.estado !== 'Alerta' && b.estado === 'Alerta') return 1;
        return 0;
    });

    casosConHistorial.forEach(function(est) {
        const card = document.createElement('div');
        card.className = 'historial-caso-card' + (est.estado === 'Normal' ? ' caso-resuelto' : '');

        // Header
        const header = document.createElement('div');
        header.className = 'historial-caso-header';
        const badgeClase = est.estado === 'Alerta' ? 'activo' : 'resuelto';
        const badgeTexto = est.estado === 'Alerta' ? 'Activo' : 'Resuelto';
        header.innerHTML =
            '<span class="historial-caso-nombre">' + est.nombre + '</span>' +
            '<span class="historial-caso-badge ' + badgeClase + '">' + badgeTexto + '</span>';
        card.appendChild(header);

        // Info
        const info = document.createElement('div');
        info.className = 'historial-caso-info';
        info.innerHTML =
            '<span>Programa: ' + est.programa + '</span>' +
            '<span>Semestre: ' + est.semestre + '</span>' +
            '<span>Nota: ' + (est.nota !== null ? est.nota : '—') + '</span>' +
            '<span>Asistencia: ' + est.asistencia + '</span>';
        card.appendChild(info);

        // Observaciones
        const obsDiv = document.createElement('div');
        obsDiv.className = 'historial-caso-observaciones';
        let obsHTML = '<div class="historial-caso-obs-titulo">Observaciones (' + est.observaciones.length + ')</div>';

        est.observaciones.forEach(function(obs) {
            obsHTML +=
                '<div class="historial-caso-obs-item">' +
                '<span class="historial-caso-obs-fecha">' + obs.fecha + '</span>' +
                '<span class="historial-caso-obs-texto">' + obs.texto + '</span>' +
                '</div>';
        });

        obsDiv.innerHTML = obsHTML;
        card.appendChild(obsDiv);

        historialCasos.appendChild(card);
    });
}

// ============================================
// FUNCIONES DE ACCIONES — DOCENTE
// ============================================

/**
 * Registra la asistencia de un estudiante.
 * @param {number} id - ID del estudiante.
 * @param {string} tipo - 'asistio' o 'falto'.
 */
function registrarAsistencia(id, tipo) {
    const est = estudiantes.find(function(e) { return e.id === id; });
    if (!est) return;

    est.asistencia = tipo === 'asistio' ? 'Asistió' : 'Faltó';
    guardarEstudiantes();
    renderizarTabla();
    actualizarEstadisticas();
}

/**
 * Cambia la nota de un estudiante.
 * @param {number} id - ID del estudiante.
 * @param {string} valor - Valor seleccionado del select (string vacío si no tiene nota).
 */
function cambiarNota(id, valor) {
    const est = estudiantes.find(function(e) { return e.id === id; });
    if (!est) return;

    est.nota = valor === '' ? null : parseInt(valor, 10);
    guardarEstudiantes();
    renderizarTabla();
    actualizarEstadisticas();
}

/**
 * Remite un estudiante al área de Psicología (cambia estado a Alerta).
 * @param {number} id - ID del estudiante.
 */
function remitirAPsicologia(id) {
    const est = estudiantes.find(function(e) { return e.id === id; });
    if (!est) return;

    const confirmar = confirm(
        '¿Deseas remitir a ' + est.nombre + ' al área de Psicología? ' +
        'Esto marcará al estudiante como En Alerta.'
    );

    if (confirmar) {
        est.estado = 'Alerta';
        guardarEstudiantes();
        renderizarTabla();
        actualizarEstadisticas();
    }
}

// ============================================
// FUNCIONES DE ACCIONES — PSICOLOGÍA
// ============================================

/**
 * Guarda una observación para un estudiante.
 * @param {number} id - ID del estudiante.
 * @param {string} texto - Texto de la observación.
 */
function guardarObservacion(id, texto) {
    if (!texto || texto.trim() === '') {
        alert('Por favor escribe una observación antes de guardar.');
        return;
    }

    const est = estudiantes.find(function(e) { return e.id === id; });
    if (!est) return;

    // Agregar observación con fecha y hora automática
    const ahora = new Date();
    const fechaHora = ahora.toLocaleString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    est.observaciones.push({
        fecha: fechaHora,
        texto: texto.trim()
    });

    guardarEstudiantes();
    renderizarBandejaAlertas();
    renderizarHistorialCasos();
}

/**
 * Resuelve el caso de un estudiante (cambia estado a Normal).
 * @param {number} id - ID del estudiante.
 */
function resolverCaso(id) {
    const est = estudiantes.find(function(e) { return e.id === id; });
    if (!est) return;

    const confirmar = confirm(
        '¿Confirmas que el caso de ' + est.nombre + ' ha sido resuelto? ' +
        'El estudiante regresará a estado Normal.'
    );

    if (confirmar) {
        est.estado = 'Normal';
        guardarEstudiantes();

        // Animación de desvanecimiento
        const card = bandejaAlertas.querySelector('.alerta-card[data-id="' + id + '"]');
        if (card) {
            card.classList.add('resolviendo');
            setTimeout(function() {
                renderizarBandejaAlertas();
                renderizarHistorialCasos();
            }, 500);
        } else {
            renderizarBandejaAlertas();
            renderizarHistorialCasos();
        }
    }
}

// ============================================
// ASIGNACIÓN DE EVENT LISTENERS
// ============================================

/**
 * Inicializa todos los event listeners de la aplicación.
 */
function inicializarEventListeners() {
    // Navegación principal
    btnDocente.addEventListener('click', irADocente);
    btnPsicologo.addEventListener('click', irAPsicologia);
    btnVolverDocente.addEventListener('click', irAHome);
    btnVolverPsicologia.addEventListener('click', irAHome);

    // Enlaces del footer Home
    linkAcerca.addEventListener('click', function(e) {
        e.preventDefault();
        alert('BecaTrack — Sistema Integral de Seguimiento Académico\n\nProyecto de apoyo a becas y salud mental para estudiantes universitarios.\n\nDesarrollado como herramienta de gestión académica y psicológica.');
    });

    linkAyuda.addEventListener('click', function(e) {
        e.preventDefault();
        alert('¿Necesitas ayuda?\n\n• Si eres Docente: Usa el portal para registrar asistencia, notas y remitir estudiantes.\n• Si eres Psicólogo/a: Revisa la bandeja de alertas y registra observaciones de seguimiento.\n\nPara soporte técnico, contacta al administrador del sistema.');
    });

    // Delegación de eventos en la tabla de estudiantes (vista Docente)
    tbodyEstudiantes.addEventListener('click', function(e) {
        const target = e.target;

        // Botones de asistencia
        const btnAsistencia = target.closest('.btn-asistencia');
        if (btnAsistencia) {
            const id = parseInt(btnAsistencia.getAttribute('data-id'), 10);
            const accion = btnAsistencia.getAttribute('data-accion');
            registrarAsistencia(id, accion);
            return;
        }

        // Botón de remitir
        const btnRemitir = target.closest('.btn-remitir');
        if (btnRemitir && !btnRemitir.disabled) {
            const id = parseInt(btnRemitir.getAttribute('data-id'), 10);
            remitirAPsicologia(id);
            return;
        }
    });

    // Delegación de eventos para selects de nota (vista Docente)
    tbodyEstudiantes.addEventListener('change', function(e) {
        const target = e.target;
        if (target.classList.contains('select-nota')) {
            const id = parseInt(target.getAttribute('data-id'), 10);
            cambiarNota(id, target.value);
        }
    });

    // Delegación de eventos en la bandeja de alertas (vista Psicología)
    bandejaAlertas.addEventListener('click', function(e) {
        const target = e.target;

        // Botón guardar observación
        const btnGuardar = target.closest('.btn-guardar');
        if (btnGuardar) {
            const id = parseInt(btnGuardar.getAttribute('data-id'), 10);
            const textarea = bandejaAlertas.querySelector('.alerta-textarea[data-id="' + id + '"]');
            if (textarea) {
                guardarObservacion(id, textarea.value);
            }
            return;
        }

        // Botón resolver caso
        const btnResolver = target.closest('.btn-resolver');
        if (btnResolver) {
            const id = parseInt(btnResolver.getAttribute('data-id'), 10);
            resolverCaso(id);
            return;
        }
    });
}

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================
window.addEventListener('load', function() {
    // Cargar datos desde localStorage o usar defaults
    cargarEstudiantes();

    // Asignar todos los event listeners
    inicializarEventListeners();

    // Mostrar vista Home por defecto
    mostrarVista('vista-home');
});
