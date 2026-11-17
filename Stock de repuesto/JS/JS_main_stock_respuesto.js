// Estado inicial de repuestos con persistencia en localStorage
let repuestos = JSON.parse(localStorage.getItem("stock_repuestos")) || [
    { id: 1, nombre: "Módulo Original", codigo: "REP-SAM-A12", modelo: "Samsung A12", stock: 4, precio: 45000 },
    { id: 2, nombre: "Pin de Carga Tipo C", codigo: "REP-GEN-C01", modelo: "Universal / Varios", stock: 15, precio: 3500 }
];

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("agregarAccesorio");
    const btnAbrir = document.querySelector(".agregarRespuesto"); // Corregido al selector del HTML
    const formulario = document.getElementById("formularioAccesorio");

    renderizarTabla(repuestos);

    if (!modal || !btnAbrir || !formulario) return;

    // 1. ABRIR MODAL (Modo Nuevo)
    btnAbrir.addEventListener("click", () => {
        formulario.reset();
        document.getElementById("idAccesorio").value = "";
        document.querySelector(".modal-titulo").textContent = "Nuevo Repuesto";
        abrirModal();
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener("click", (event) => {
        if (event.target === modal) cerrarModal();

        // Cerrar menú de tres puntos si se hace clic fuera
        if (!event.target.closest(".menu-acciones")) {
            document.querySelectorAll(".menu-desplegable").forEach(m => m.classList.add("oculto"));
        }
    });

    // Cerrar con tecla ESC
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.classList.contains("oculto")) {
            cerrarModal();
        }
    });
});

// --- FUNCIONES DE MODAL ---
function abrirModal() {
    const modal = document.getElementById("agregarAccesorio");
    modal.classList.remove("oculto");
    modal.setAttribute("aria-hidden", "false");
}

function cerrarModal() {
    const modal = document.getElementById("agregarAccesorio");
    modal.classList.add("oculto");
    modal.setAttribute("aria-hidden", "true");
}

// --- RENDERIZADO DE TABLA ---
function renderizarTabla(lista) {
    const tbody = document.getElementById("cuerpoTablaRepuestos");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="celda texto-centro texto-gris">No se encontraron repuestos.</td></tr>`;
        return;
    }

    lista.forEach(item => {
        const claseStock = item.stock <= 3 ? "texto-rojo" : "texto-verde";
        const precioFormateado = new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            maximumFractionDigits: 0
        }).format(item.precio);

        const fila = document.createElement("tr");
        fila.className = "fila-tabla";
        fila.innerHTML = `
            <td class="celda fuente-media">
                ${item.nombre} 
                <br><small class="texto-gris">SKU: ${item.codigo}</small>
            </td>
            <td class="celda texto-gris">${item.modelo}</td>
            <td class="celda ${claseStock}">${item.stock}</td>
            <td class="celda">${precioFormateado}</td>
            <td class="celda texto-centro">
                <div class="menu-acciones">
                    <button type="button" class="btn-tres-puntos" onclick="toggleMenu(event)">⋮</button>
                    <div class="menu-desplegable oculto">
                        <button type="button" class="opcion-menu" onclick="editarRepuesto(${item.id})">Editar</button>
                        <button type="button" class="opcion-menu eliminar" onclick="eliminarRepuesto(${item.id})">Eliminar</button>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function sincronizarStorage() {
    localStorage.setItem("stock_repuestos", JSON.stringify(repuestos));
}

// --- CRUD: GUARDAR (CREAR O EDITAR) ---
function guardarRepuesto(event) {
    event.preventDefault();

    const id = document.getElementById("idAccesorio").value;
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        codigo: document.getElementById("codigo").value.trim(),
        modelo: document.getElementById("modelo").value.trim(),
        stock: parseInt(document.getElementById("stock").value, 10),
        precio: parseFloat(document.getElementById("precio").value)
    };

    if (id) {
        // Editar
        const index = repuestos.findIndex(r => r.id === Number(id));
        if (index !== -1) {
            repuestos[index] = { id: Number(id), ...datos };
        }
    } else {
        // Crear
        const nuevoId = repuestos.length > 0 ? Math.max(...repuestos.map(r => r.id)) + 1 : 1;
        repuestos.push({ id: nuevoId, ...datos });
    }

    sincronizarStorage();

    // Limpiar buscador para asegurar visibilidad del nuevo elemento
    const inputBusqueda = document.getElementById("entradaBusqueda");
    if (inputBusqueda) inputBusqueda.value = "";

    renderizarTabla(repuestos);
    cerrarModal();
}

// --- CRUD: EDITAR ---
function editarRepuesto(id) {
    const item = repuestos.find(r => r.id === id);
    if (!item) return;

    document.getElementById("idAccesorio").value = item.id;
    document.getElementById("nombre").value = item.nombre;
    document.getElementById("codigo").value = item.codigo;
    document.getElementById("modelo").value = item.modelo;
    document.getElementById("stock").value = item.stock;
    document.getElementById("precio").value = item.precio;

    document.querySelector(".modal-titulo").textContent = "Editar Repuesto";
    abrirModal();
}

// --- CRUD: ELIMINAR ---
function eliminarRepuesto(id) {
    const item = repuestos.find(r => r.id === id);
    if (!item) return;

    if (confirm(`¿Seguro que deseas eliminar el repuesto "${item.nombre}" (${item.modelo})?`)) {
        repuestos = repuestos.filter(r => r.id !== id);
        sincronizarStorage();
        filtrarRepuestos();
    }
}

// --- BÚSQUEDA EN TIEMPO REAL ---
function filtrarRepuestos() {
    const termino = document.getElementById("entradaBusqueda").value.toLowerCase().trim();
    const filtrados = repuestos.filter(item =>
        item.nombre.toLowerCase().includes(termino) ||
        item.codigo.toLowerCase().includes(termino) ||
        item.modelo.toLowerCase().includes(termino)
    );
    renderizarTabla(filtrados);
}

// --- MENÚ DE ACCIONES (⋮) ---
function toggleMenu(event) {
    event.stopPropagation();
    const menuActual = event.currentTarget.nextElementSibling;

    document.querySelectorAll(".menu-desplegable").forEach(menu => {
        if (menu !== menuActual) menu.classList.add("oculto");
    });

    menuActual.classList.toggle("oculto");
}