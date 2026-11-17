const accesorio =[
    {producto: "Funda Anti-golpes iPhone 13", precio: 8500}
]
const servicio=[
    {producto: "Cambio de Módulo Samsung A12", precio: 15000}
]

function calcularMontoCobrar(ticket) {
    let totalAccesorios = 0;
    let totalServicio = 0;

    for(let i=0; i<ticket.accesorio.length; i++){
        totalAccesorios += ticket.accesorio[i].precio;
    }

    for(let i=0; i<ticket.servicio.length; i++){
        totalServicio += ticket.servicio[i].precio;
    }

    let cobroTotal=totalAccesorios+totalServicio

    return{
        TotalCobrar: cobroTotal
    };
}
const miTicket={
    accesorio:accesorio,
    servicio:servicio
};
const resultadoCobro = calcularMontoCobrar(miTicket);

const mostrarPantalla = document.querySelector("#montoTotalVenta");
mostrarPantalla.textContent = "$" + resultadoCobro.TotalCobrar;