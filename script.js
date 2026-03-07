let productos = []
let ventas = JSON.parse(localStorage.getItem("ventas")) || []

// Cargar productos
async function cargarProductos(){
    const res = await fetch("./productos.json")
    productos = await res.json()

    const select = document.getElementById("producto")
    productos.forEach(p=>{
        const option = document.createElement("option")
        option.value = p.id
        option.textContent = p.nombre
        select.appendChild(option)
    })

}

// Guardar ventas en localstorage
function guardarVentas(){
    localStorage.setItem("ventas", JSON.stringify(ventas))
}

// Registrar venta
function registrarVenta(productoId, cantidad){
    const producto = productos.find(p=>p.id == productoId)
    if(!producto) return

    const venta = {
        fecha: new Date().toLocaleDateString(),
        producto: producto.nombre,
        cantidad: cantidad,
        ganancia: (producto.precio - producto.costo) * cantidad
    }

    ventas.push(venta)
    guardarVentas()
    render()
}

// Renderizar tabla y ganancia
function render(){
    const tabla = document.getElementById("tablaVentas")
    tabla.innerHTML = ""

    let gananciaTotal = 0

    // Solo las ultimas 6 ventas
    const ventasParaMostrar = ventas.slice(-10);
    ventasParaMostrar.forEach(v=>{

        gananciaTotal += v.ganancia

        const fila = `
        <tr>
        <td>${v.fecha}</td>
        <td>${v.producto}</td>
        <td>${v.cantidad}</td>
        </tr>
        `

        tabla.innerHTML += fila

    })

    document.getElementById("gananciaTotal").textContent =
    "$" + gananciaTotal
}

// Evento formulario
document.getElementById("formVenta").addEventListener("submit", e=>{

    e.preventDefault()

    const producto = document.getElementById("producto").value
    const cantidad = document.getElementById("cantidad").value

    registrarVenta(producto, cantidad)

    document.getElementById("cantidad").value = ""

})

// Boton de descarga
document.getElementById("exportarVentas").addEventListener("click", () => {
    const data = JSON.stringify(ventas, null, 2) // todas las ventas
    const blob = new Blob([data], { type: "application/json" })
    const a = document.createElement("a")
    a.href = URL.createObjectURL(blob)
    a.download = `ventas_${new Date().toISOString().slice(0,10)}.json`
    a.click()
})

cargarProductos().then(render)