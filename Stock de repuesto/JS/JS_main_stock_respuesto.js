document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("agregarRespuesto");
    const btnAbrir = document.querySelector(".agregarRespuesto");
    const formulario = document.getElementById("formularioRespuesto");

    // Verificar que los elementos existan para evitar errores
    if (!modal || !btnAbrir || !formulario) return;

    // 1. FUNCIÓN PARA ABRIR EL MODAL
    btnAbrir.addEventListener("click", () => {
        formulario.reset(); 
        document.getElementById("idRespuesto").value = ""; 
        modal.classList.remove("oculto"); 
    });

    // 2. FUNCIÓN GLOBAL PARA CERRAR EL MODAL
    window.cerrarModal = function() {
        modal.classList.add("oculto"); 
    }

    // Cerrar si hace clic fuera de la caja
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            cerrarModal();
        }
    });

    // Cerrar con la tecla ESC
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.classList.contains("oculto")) {
            cerrarModal();
        }
    });
});

// 3. FUNCIÓN PARA GUARDAR (Debe ser global para el onsubmit="")
function guardarRespuesto(event) {
    event.preventDefault();

    const Respuesto = {
        id: document.getElementById("idRespuesto").value,
        nombre: document.getElementById("nombre").value.trim(),
        categoria: document.getElementById("categoria").value.trim(),
        marca: document.getElementById("marca").value.trim(),
        stock: parseInt(document.getElementById("stock").value, 10),
        precio: parseFloat(document.getElementById("precio").value)
    };

    console.log("Respuesto a guardar:", Respuesto);
    alert(`¡Respuesto "${Respuesto.nombre}" guardado con éxito!`);
    
    cerrarModal();
}