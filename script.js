let productos = []
let ventas = JSON.parse(localStorage.getItem("ventas")) || []

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

function guardarVentas(){
    localStorage.setItem("ventas", JSON.stringify(ventas))
}

function registrarVenta(productoId, cantidad){

    const producto = productos.find(p=>p.id == productoId)

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

function render(){

    const tabla = document.getElementById("tablaVentas")
    tabla.innerHTML = ""

    let gananciaTotal = 0

    ventas.forEach(v=>{

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

document.getElementById("formVenta").addEventListener("submit", e=>{

    e.preventDefault()

    const producto = document.getElementById("producto").value
    const cantidad = document.getElementById("cantidad").value

    registrarVenta(producto, cantidad)

    document.getElementById("cantidad").value = ""

})

cargarProductos()
render()