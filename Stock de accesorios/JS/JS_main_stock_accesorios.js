// Estado inicial de ejemplo (se guarda en localStorage para no perder cambios al recargar)
let accesorios = JSON.parse(localStorage.getItem("stock_accesorios")) || [
    { id: 1, nombre: "Módulo Original Samsung A12", categoria: "Repuestos", marca: "Samsung", stock: 4, precio: 45000 },
    { id: 2, nombre: "Funda Anti-golpes iPhone 13", categoria: "Accesorios", marca: "Apple", stock: 12, precio: 8500 }
];

document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("agregarAccesorio");
    const btnAbrir = document.querySelector(".agregarAccesorio");
    const formulario = document.getElementById("formularioAccesorio");

    // Renderizar la tabla al cargar la página
    renderizarTabla(accesorios);

    if (!modal || !btnAbrir || !formulario) return;

    // 1. ABRIR MODAL (Modo Nuevo)
    btnAbrir.addEventListener("click", () => {
        formulario.reset();
        document.getElementById("idAccesorio").value = "";
        document.querySelector(".modal-titulo").textContent = "Nuevo Accesorio";
        abrirModal();
    });

    // Cerrar si hace clic fuera de la caja del modal
    window.addEventListener("click", (event) => {
        if (event.target === modal) cerrarModal();

        // Cerrar menús desplegables de tres puntos si se hace clic fuera
        if (!event.target.closest(".menu-acciones")) {
            document.querySelectorAll(".menu-desplegable").forEach(m => m.classList.add("oculto"));
        }
    });

    // Cerrar con la tecla ESC
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
    const tbody = document.getElementById("cuerpoTablaAccesorios");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="celda texto-centro texto-gris">No se encontraron resultados.</td></tr>`;
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
            <td class="celda fuente-media">${item.nombre} <small class="texto-gris">(${item.marca})</small></td>
            <td class="celda texto-gris">${item.categoria}</td>
            <td class="celda ${claseStock}">${item.stock}</td>
            <td class="celda">${precioFormateado}</td>
            <td class="celda texto-centro">
                <div class="menu-acciones">
                    <button type="button" class="btn-tres-puntos" onclick="toggleMenu(event)">⋮</button>
                    <div class="menu-desplegable oculto">
                        <button type="button" class="opcion-menu" onclick="editarAccesorio(${item.id})">Editar</button>
                        <button type="button" class="opcion-menu eliminar" onclick="eliminarAccesorio(${item.id})">Eliminar</button>
                    </div>
                </div>
            </td>
        `;
        tbody.appendChild(fila);
    });
}

function sincronizarStorage() {
    localStorage.setItem("stock_accesorios", JSON.stringify(accesorios));
}

// --- CRUD: GUARDAR (CREAR O EDITAR) ---
function guardarAccesorio(event) {
    event.preventDefault();

    const id = document.getElementById("idAccesorio").value;
    const datos = {
        nombre: document.getElementById("nombre").value.trim(),
        categoria: document.getElementById("categoria").value.trim(),
        marca: document.getElementById("marca").value.trim(),
        stock: parseInt(document.getElementById("stock").value, 10),
        precio: parseFloat(document.getElementById("precio").value)
    };

    if (id) {
        // Editar existente
        const index = accesorios.findIndex(a => a.id === Number(id));
        if (index !== -1) {
            accesorios[index] = { id: Number(id), ...datos };
        }
    } else {
        // Crear nuevo
        const nuevoId = accesorios.length > 0 ? Math.max(...accesorios.map(a => a.id)) + 1 : 1;
        accesorios.push({ id: nuevoId, ...datos });
    }

    sincronizarStorage();
    filtrarAccesorios(); // Re-renderiza respetando el filtro activo si lo hay
    cerrarModal();
}

// --- CRUD: EDITAR ---
function editarAccesorio(id) {
    const item = accesorios.find(a => a.id === id);
    if (!item) return;

    document.getElementById("idAccesorio").value = item.id;
    document.getElementById("nombre").value = item.nombre;
    document.getElementById("categoria").value = item.categoria;
    document.getElementById("marca").value = item.marca;
    document.getElementById("stock").value = item.stock;
    document.getElementById("precio").value = item.precio;

    document.querySelector(".modal-titulo").textContent = "Editar Accesorio";
    abrirModal();
}

// --- CRUD: ELIMINAR ---
function eliminarAccesorio(id) {
    const item = accesorios.find(a => a.id === id);
    if (!item) return;

    if (confirm(`¿Seguro que deseas eliminar "${item.nombre}"?`)) {
        accesorios = accesorios.filter(a => a.id !== id);
        sincronizarStorage();
        filtrarAccesorios();
    }
}

// --- BÚSQUEDA EN TIEMPO REAL ---
function filtrarAccesorios() {
    const termino = document.getElementById("entradaBusqueda").value.toLowerCase().trim();
    const filtrados = accesorios.filter(item =>
        item.nombre.toLowerCase().includes(termino) ||
        item.categoria.toLowerCase().includes(termino) ||
        item.marca.toLowerCase().includes(termino)
    );
    renderizarTabla(filtrados);
}

// --- MENÚ DE ACCIONES (⋮) ---
function toggleMenu(event) {
    event.stopPropagation();
    const menuActual = event.currentTarget.nextElementSibling;

    // Cerrar cualquier otro menú abierto
    document.querySelectorAll(".menu-desplegable").forEach(menu => {
        if (menu !== menuActual) menu.classList.add("oculto");
    });

    menuActual.classList.toggle("oculto");
}