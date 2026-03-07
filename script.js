let productos = []
let ventas = JSON.parse(localStorage.getItem("ventas")) || []
let productoSeleccionado = null;

const inputBuscar = document.getElementById("buscarProducto")
const lista = document.getElementById("listaProductos")

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
function registrarVenta(cantidad){
    if(!productoSeleccionado){
        alert("Selecciona un producto")
        return;
    }

    cantidad = Number(cantidad)

    const venta = {
        fecha: new Date().toLocaleDateString(),
        producto: productoSeleccionado.nombre,
        cantidad: cantidad,
        ganancia: (productoSeleccionado.precio - productoSeleccionado.costo) * cantidad
    }

    ventas.push(venta)
    guardarVentas()
    render()

    productoSeleccionado = null;
    document.getElementById("buscarProducto").value = "";
}

// Renderizar tabla y ganancia
function render(){
    const tabla = document.getElementById("tablaVentas")
    tabla.innerHTML = ""

    let gananciaTotal = 0

    // Solo las ultimas 6 ventas
    const ventasParaMostrar = ventas.slice(-6);
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

inputBuscar.addEventListener("input", () => {

  const texto = inputBuscar.value.toLowerCase();
  lista.innerHTML = "";

  if(texto.length === 0){
    lista.style.display = "none";
    return;
  }

  const coincidencias = productos.filter(p =>
    p.nombre.toLowerCase().includes(texto)
  );

  coincidencias.forEach(p => {

    const item = document.createElement("div");
    item.className = "item-producto";
    item.textContent = p.nombre;

    item.onclick = () => {
      inputBuscar.value = p.nombre;
      productoSeleccionado = p;
      lista.style.display = "none";
    };

    lista.appendChild(item);
  });

  lista.style.display = "block";
});

cargarProductos().then(render)