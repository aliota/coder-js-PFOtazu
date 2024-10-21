// Constantes
const IVA = 0.22;

// Inicializar Items Disponibles
const ITEMS = ["Sitio Institucional o Empresarial","Portafolio","Micrositio","Blog","Plataforma Educativa","eCommerce","Portal","Sitio de Noticias","Foro","Red Social"];     
const PRECIOS = [1000.00, 500.00, 600.00, 400.00, 700.00, 2000.00, 3000.00, 1500.00, 300.00, 2500.00];
const itemsDisponibles = [];
agregarItemsDisponibles(itemsDisponibles,ITEMS,PRECIOS);
console.log(itemsDisponibles);

// Inicializar descuentos
const dto0 = new Descuento("",0);
const dto5 = new Descuento("abc5",0.05);
const dto10 = new Descuento("def10",0.10);
const descuentosDisponibles = [dto0,dto5,dto10];
console.log(descuentosDisponibles);


// Carrito
const miCarrito = new Carrito(itemsDisponibles,descuentosDisponibles);
console.log(miCarrito);

let formulario = document.getElementById("formPremium");
let agregarSitio = formulario.addEventListener("submit",sitioYCantidad);  
let irCarrito = document.getElementById("irCarrito");
let resumen = irCarrito.addEventListener("click",resumenCarrito); 


