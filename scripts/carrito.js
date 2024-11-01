// Constantes
const IVA = 0.22;
const dto0 = new Descuento("",0);
const dto5 = new Descuento("abc5",0.05);
const dto10 = new Descuento("def10",0.10);
const descuentosDisponibles = [dto0,dto5,dto10];


let itemsDisponibles = [];
crearCarrito(itemsDisponibles,descuentosDisponibles);
document.getElementById("aplicar").addEventListener("click",sitioYCantidad); 
cotizacion();





