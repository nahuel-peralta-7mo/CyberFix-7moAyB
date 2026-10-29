/* ==========================================================
   1. ESTADOS Y DATOS INICIALES (Simulación de Base de Datos)
   ================================================---------- */
let equipos = [
    { id: 1, equipo: "Motorola Moto G22", cliente: "Carlos Gómez", estado: "En Proceso", problema: "No enciende / Pin de carga" },
    { id: 2, equipo: "Samsung Galaxy A52", cliente: "Lucía Martínez", estado: "Esperando Repuesto", problema: "Módulo roto / Pantalla negra" }
];


/* ==========================================================
   2. FUNCIONES DE INTERFAZ Y ACTUALIZACIÓN (DOM)
   ================================================---------- */

// Actualiza los contadores numéricos de las tarjetas superiores
function actualizarContadores() {
    const enProceso = equipos.filter(e => e.estado === "En Proceso").length;
    const esperando = equipos.filter(e => e.estado === "Esperando Repuesto").length;
    const listos = equipos.filter(e => e.estado === "Listos para entregar").length;
    const total = equipos.length;

    const elProceso = document.getElementById('count-proceso');
    const elEsperando = document.getElementById('count-esperando');
    const elListos = document.getElementById('count-listos');
    const elTotal = document.getElementById('count-total');

    if (elProceso) elProceso.textContent = enProceso;
    if (elEsperando) elEsperando.textContent = esperando;
    if (elListos) elListos.textContent = listos;
    if (elTotal) elTotal.textContent = total;
}

// Dibuja y redibuja la tabla HTML con los equipos actuales del array
function renderizarTabla() {
    const tbody = document.getElementById('cuerpoTablaEquipos');
    if (!tbody) return;
    
    tbody.innerHTML = ""; // Limpiamos la tabla antes de volver a llenarla

    equipos.forEach(eq => {
        let claseBadge = "";
        if (eq.estado === "En Proceso") claseBadge = "badge-proceso";
        else if (eq.estado === "Esperando Repuesto") claseBadge = "badge-repuesto";
        else if (eq.estado === "Listos para entregar") claseBadge = "badge-listo";

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${eq.equipo}</td>
            <td>${eq.cliente}</td>
            <td><span class="badge ${claseBadge}">${eq.estado}</span></td>
            <td>${eq.problema}</td>
            <td class="texto-centro">
                <!-- Menú de acciones (3 puntos) -->
                <div class="menu-acciones">
                    <button class="btn-acciones" onclick="toggleMenu(event)">⋮</button>
                    <div class="menu-desplegable oculto">
                        <button class="opcion-menu" onclick="cambiarEstado(${eq.id}, 'En Proceso')">En Proceso</button>
                        <button class="opcion-menu" onclick="cambiarEstado(${eq.id}, 'Esperando Repuesto')">Esperando Repuesto</button>
                        <button class="opcion-menu" onclick="cambiarEstado(${eq.id}, 'Listos para entregar')">Listo para entregar</button>
                        <button class="opcion-menu eliminar" onclick="eliminarEquipo(${eq.id})">Eliminar</button>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });
}


/* ==========================================================
   3. GESTIÓN DE DATOS (CRUD: Crear, Modificar, Eliminar)
   ================================================---------- */

// Guarda un equipo nuevo proveniente del formulario del modal
function guardarEquipo(event) {
    event.preventDefault();

    const nuevoEquipo = {
        id: equipos.length > 0 ? equipos[equipos.length - 1].id + 1 : 1,
        equipo: document.getElementById("equipo").value.trim(),
        cliente: document.getElementById("cliente").value.trim(),
        estado: document.getElementById("estado").value,
        problema: document.getElementById("problema").value.trim()
    };

    equipos.push(nuevoEquipo);

    actualizarContadores();
    renderizarTabla();
    cerrarModal();
}

// Cambia el estado de un equipo específico
function cambiarEstado(id, nuevoEstado) {
    const equipo = equipos.find(e => e.id === id);
    if (equipo) {
        equipo.estado = nuevoEstado;
        actualizarContadores();
        renderizarTabla();
    }
}

// Elimina un equipo de la lista por su ID
function eliminarEquipo(id) {
    equipos = equipos.filter(e => e.id !== id);
    actualizarContadores();
    renderizarTabla();
}


/* ==========================================================
   4. CONTROL DEL MENÚ DESPLEGABLE (3 PUNTOS)
   ================================================---------- */

// Abre o cierra el menú desplegable de la fila seleccionada
function toggleMenu(event) {
    event.stopPropagation(); // Evita que el evento burbujee y cierre el menú al instante

    const boton = event.currentTarget;
    const menuActual = boton.nextElementSibling;

    // Cierra cualquier otro menú que esté abierto en la tabla
    document.querySelectorAll('.menu-desplegable').forEach(menu => {
        if (menu !== menuActual) {
            menu.classList.add('oculto');
        }
    });

    // Alterna la visibilidad del menú actual
    menuActual.classList.toggle('oculto');
}

// Cierra todos los menús desplegables si se hace clic fuera de ellos
window.addEventListener('click', () => {
    document.querySelectorAll('.menu-desplegable').forEach(menu => {
        menu.classList.add('oculto');
    });
});


/* ==========================================================
   5. EVENTOS GLOBALES E INICIALIZACIÓN (DOMContentLoaded)
   ================================================---------- */
document.addEventListener('DOMContentLoaded', () => {
    // Inicializamos datos visuales al cargar la página
    actualizarContadores();
    renderizarTabla();

    // Lógica para el manejo de la ventana Modal
    const modal = document.getElementById("agregarEquipo");
    const btnAbrir = document.querySelector(".agregarEquipo");
    const formulario = document.getElementById("formularioEquipo");

    if (!modal || !btnAbrir || !formulario) return;

    btnAbrir.addEventListener("click", () => {
        formulario.reset(); 
        document.getElementById("idEquipo").value = ""; 
        modal.classList.remove("oculto"); 
    });

    window.cerrarModal = function() {
        modal.classList.add("oculto"); 
    }

    // Cerrar modal al hacer clic fuera del contenido principal
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Cerrar modal al presionar la tecla ESC
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.classList.contains("oculto")) {
            cerrarModal();
        }
    });
});