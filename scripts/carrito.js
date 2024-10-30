// Constantes
const IVA = 0.22;




//////a quitar ////////////////////////////////////
buscarProductosAPI("linterna");

let cotizacionDolar = {};
let bid = 0;
let ask = 0;
const cotizacion =  async () => { 
    cotizacionDolar = await buscarCotizacionesAPI();  
    bid = (cotizacionDolar?.dolar?.bid ?? -1);
    ask = (cotizacionDolar?.dolar?.ask ?? -1);
    alert("cotización del dolar\ncompra:  "+ bid+"\nventa: "+ask)
}
cotizacion();
//////////////////////////////////////////////////////////////////////////////////////////

// Inicializar descuentos
const dto0 = new Descuento("",0);
const dto5 = new Descuento("abc5",0.05);
const dto10 = new Descuento("def10",0.10);
const descuentosDisponibles = [dto0,dto5,dto10];
console.log(descuentosDisponibles);

// Inicializar items Disponibles y cargar Carrito

let crearCarrito  = async (items,descuentosDisponibles)=>{ 
    let itemsDisponibles = await buscarItemsDisponibles(items);
    // Carrito
    const miCarrito = new Carrito(itemsDisponibles,descuentosDisponibles);
    console.log(miCarrito);
    renderCarrito(miCarrito);
    document.getElementById("aplicar").addEventListener("click",sitioYCantidad); 
    return miCarrito;    
}
let itemsDisponibles = [];
crearCarrito(itemsDisponibles,descuentosDisponibles);





