//*******************************************
// Elementos pagina y variables
//*******************************************

// Productos
let productos = []

// Producto seleccionado
let productoSeleccionado = null;

// Input texto buscador
const inputBuscar = document.getElementById("buscarProducto")

// Lista opciones buscador
const lista = document.getElementById("listaProductos")

// Crear base de datos
const db = new Dexie("ventasDB");

// Tabla ventas y productos
db.version(1).stores({
  ventas: "++id, fecha, productoId",
  productos: "++id, codigo, nombre, marca, categoria"
});


//*******************************************
// Funciones
//*******************************************

// Cargar productos de json a db
async function cargarProductosDb(){

    const cantidad = await db.productos.count()

    if(cantidad === 0){

        const res = await fetch("./productos.json")
        const productos = await res.json()

        await db.productos.bulkAdd(productos)

    }

}

// Cargar productos db
async function cargarProductos(){
    productos = await db.productos.toArray()
}

// Registrar venta
async function registrarVenta(cantidad){

    if(!productoSeleccionado){
        alert("Selecciona un producto")
        return;
    }

    cantidad = Number(cantidad)

    const venta = {
        fecha: new Date().toISOString(),
        codigo_producto: productoSeleccionado.codigo,
        producto: productoSeleccionado.nombre,
        marca: productoSeleccionado.marca,
        categoria: productoSeleccionado.categoria,
        cantidad: cantidad,
        precio: productoSeleccionado.precio,
        costo: productoSeleccionado.costo,
        ganancia: (productoSeleccionado.precio - productoSeleccionado.costo) * cantidad
    }

    await db.ventas.add(venta)

    render()

    productoSeleccionado = null
    document.getElementById("buscarProducto").value = ""
    lista.innerHTML = ""
}

// Renderizar datos
async function render(){

    const tabla = document.getElementById("tablaVentas")
    tabla.innerHTML = ""

    let gananciaHoy = 0
    //let gananciaMes = 0

    const hoy = new Date()
    const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate())
    //const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1)

    const ventas = await db.ventas.toArray()

    ventas.forEach(v => {

        const fechaVenta = new Date(v.fecha)

        if(fechaVenta >= inicioHoy){
            gananciaHoy += v.ganancia
        }

        /*if(fechaVenta >= inicioMes){
            gananciaMes += v.ganancia
        }*/

    })

    // última venta
    const ultimaVenta = await db.ventas
        .orderBy("id")
        .last()

    if(ultimaVenta){
        tabla.innerHTML = `
        <tr>
        <td>${new Date(ultimaVenta.fecha).toLocaleString()}</td>
        <td>${ultimaVenta.producto}</td>
        <td>${ultimaVenta.cantidad}</td>
        </tr>`
    }

    document.getElementById("gananciaHoy").textContent =
        "$" + gananciaHoy

    /*document.getElementById("gananciaMes").textContent =
        "$" + gananciaMes*/
}

// Evento formulario
document.getElementById("formVenta").addEventListener("submit", e=>{

    e.preventDefault()
    const cantidad = document.getElementById("cantidad").value

    registrarVenta(cantidad)

    document.getElementById("cantidad").value = ""

})

// Boton de descarga
document.getElementById("exportarVentas").addEventListener("click", async () => {

    const ventas = await db.ventas.toArray()

    const datos = ventas.map(v => ({
        Fecha: new Date(v.fecha).toLocaleString(),
        Producto: v.producto,
        Marca: v.marca,
        Cantidad: v.cantidad,
        Precio: v.precio,
        Costo: v.costo,
        Ganancia: v.ganancia
    }))

    const worksheet = XLSX.utils.json_to_sheet(datos)

    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Ventas")

    XLSX.writeFile(
        workbook,
        `ventas_${new Date().toISOString().slice(0,10)}.xlsx`
    )

})

// Buscador de productos
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

    item.textContent = `${p.nombre} ${p.marca} - ${p.presentacion}`;

    item.onclick = () => {
      inputBuscar.value = `${p.nombre} ${p.marca} - ${p.presentacion}`;
      productoSeleccionado = p;
      lista.style.display = "none";
    };

    lista.appendChild(item);
  });

  lista.style.display = "block";
});

async function iniciarApp(){
    await cargarProductosDb()
    await cargarProductos()    
    render()
}

iniciarApp()