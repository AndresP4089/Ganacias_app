let ventas = []

// Capturar el formulario
const form = document.getElementById("formVenta")
// Crear evento formulario
form.addEventListener("submit", agregarVenta)
// Capturar botón
const boton = document.getElementById("nuevaVenta")
// Crear evento botón
boton.addEventListener("click", () => {
    form.classList.toggle("oculto")
})

function actualizarResumen(){

    let ingresos = 0
    let costos = 0

    ventas.forEach(v => {

        ingresos += v.precio * v.cantidad
        costos += v.costo * v.cantidad

    })

    const ganancias = ingresos - costos

    document.getElementById("ingresos").innerText = "$" + ingresos
    document.getElementById("costos").innerText = "$" + costos
    document.getElementById("ganancias").innerText = "$" + ganancias

}

function actualizarTabla(){

    const tbody = document.getElementById("tablaVentas")

    let html = ""

    ventas.forEach(v => {

        const ingreso = v.precio * v.cantidad
        const costo = v.costo * v.cantidad
        const ganancia = ingreso - costo

        html += `
        <tr>
            <td>${v.producto}</td>
            <td>$${v.precio}</td>
            <td>${v.cantidad}</td>
            <td>$${costo}</td>
            <td>$${ganancia}</td>
        </tr>
        `
    })

    tbody.innerHTML = html

}

function agregarVenta(e){
    // Evita que recargue la pagina
    e.preventDefault()
    
    const producto = document.getElementById("producto").value
    const precio = Number(document.getElementById("precio").value)
    const cantidad = Number(document.getElementById("cantidad").value)
    const costo = Number(document.getElementById("costo").value)

    ventas.push({
        producto: producto,
        precio: precio,
        cantidad: cantidad,
        costo: costo
    })

    actualizarResumen()
    actualizarTabla()

    form.reset()
}