const historial = [
  { Producto: "Módulo Original Samsung A12", Cliente: "Juan Pérez", Costo: 25000, PrecioVenta: 45000 },
  { Producto: "Funda Anti-golpes iPhone 13", Cliente: "María Gómez", Costo: 3500, PrecioVenta: 8500 },
  { Producto: "Cambio Pin de Carga Moto G8", Cliente: "Lucas Fernández", Costo: 4000, PrecioVenta: 18000 }
];

// Formateador de moneda para pesos argentinos
const formatoMoneda = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
});

// 2. Función para renderizar la tabla y calcular las ganancias de cada fila
function renderizarTablaHistorial(lista) {
    const tbody = document.getElementById("cuerpoTablaHistorial");
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="celda texto-centro texto-gris">No se encontraron resultados.</td></tr>`;
        return;
    }

    lista.forEach(item => {
        // Cálculo automático de la ganancia por fila
        const gananciaCalculada = item.PrecioVenta - item.Costo;

        const fila = document.createElement("tr");
        fila.className = "fila-tabla";
        
        fila.innerHTML = `
            <td class="celda fuente-media">${item.Producto}</td>
            <td class="celda texto-gris">${item.Cliente}</td>
            <td class="celda texto-centro text-gris">${formatoMoneda.format(item.Costo)}</td>
            <td class="celda texto-centro">${formatoMoneda.format(item.PrecioVenta)}</td>
            <td class="celda texto-centro texto-azul">+$${formatoMoneda.format(gananciaCalculada)}</td>
        `;
        
        tbody.appendChild(fila);
    });
}

// 3. Funciones para calcular los totales de las tarjetas superiores
function CalcularIngresoBruto() {
    let total = 0;
    for (let i = 0; i < historial.length; i++) {
        total += historial[i].PrecioVenta;
    }
    return total;
}

function CalcularCostoTotal() {
    let total = 0;
    for (let i = 0; i < historial.length; i++) {
        total += historial[i].Costo;
    }
    return total;
}

function CalcularGananciaNeta() {
    let total = 0;
    for (let i = 0; i < historial.length; i++) {
        total += (historial[i].PrecioVenta - historial[i].Costo);
    }
    return total;
}

// 4. Ejecución al cargar el script para actualizar la interfaz
renderizarTablaHistorial(historial);

// Actualizamos las tarjetas métricas superiores
const resIngreso = CalcularIngresoBruto();
const resCosto = CalcularCostoTotal();
const resGanancia = CalcularGananciaNeta();

document.querySelector("#IngresoBrutoTotal").textContent = formatoMoneda.format(resIngreso);
document.querySelector("#CostoTotal").textContent = formatoMoneda.format(resCosto);
document.querySelector("#GananciaTotal").textContent = formatoMoneda.format(resGanancia);
document.querySelector("#monto-des").textContent = formatoMoneda.format(resIngreso);

// 1. Calculamos los totales generales (usando las funciones que ya tenés)
const totalIngreso = CalcularIngresoBruto();
const totalCosto = CalcularCostoTotal();
const totalGanancia = CalcularGananciaNeta();

// 2. Calculamos los porcentajes (evitando división por 0 por si la lista está vacía)
let porcentajeGanancia = 0;
let porcentajeCosto = 0;

if (totalIngreso > 0) {
    porcentajeGanancia = (totalGanancia / totalIngreso) * 100;
    porcentajeCosto = (totalCosto / totalIngreso) * 100;
}

// Redondeamos a 1 decimal (ej: 48.6)
const porgGananciaRedondeado = porcentajeGanancia.toFixed(1);
const porgCostoRedondeado = porcentajeCosto.toFixed(1);

// 3. Actualizamos dinámicamente la variable CSS del gráfico circular (--porcentaje)
const elementoGrafico = document.querySelector(".grafico-circular");
if (elementoGrafico) {
    elementoGrafico.style.setProperty("--porcentaje", porgGananciaRedondeado + "%");
}

// 4. Actualizamos los textos en pantalla
document.querySelector("#textoPorcentajeCentro").textContent = porgGananciaRedondeado + "%";
document.querySelector("#textoLeyendaGanancia").textContent = `Ganancia (${porgGananciaRedondeado}%)`;
document.querySelector("#textoLeyendaCosto").textContent = `Costo (${porgCostoRedondeado}%)`;