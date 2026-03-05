let ventas = []

const boton = document.getElementById("nuevaVenta")

boton.addEventListener("click", nuevaVenta)

function nuevaVenta(){

    const producto = String(prompt("Nombre Producto"))
    const precio = Number(prompt("Precio de venta"))
    const cantidad = Number(prompt("Cantidad"))
    const costo = Number(prompt("Costo unitario"))

    ventas.push({
        precio: precio,
        cantidad: cantidad,
        costo: costo,
        producto: producto
    })

    actualizarResumen()
    actualizarTabla()

}

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
