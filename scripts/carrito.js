// Constantes
const IVA = 0.22;

// Inicializar códigos de descuento por defecto
const dto0 = new Descuento("",0);
const dto5 = new Descuento("abc5",0.05);
const dto10 = new Descuento("def10",0.10);
const descuentosDisponibles = [dto0,dto5,dto10];

// Inicializar Items Disponibles por defecto
const ITEMS = ["Institucional-Empresarial","Personal-Portafolio","Micrositio","Blog","Plataforma Educativa","Comercio electrónico","Portal","Noticias-Revista","Wiki-Foro","Red Social"];     
const PRECIOS = [1000.00, 500.00, 600.00, 400.00, 700.00, 2000.00, 3000.00, 1500.00, 300.00, 2500.00];
let itemsDisponibles = [];
agregarItemsDisponibles(itemsDisponibles,ITEMS,PRECIOS);


actualizarCarrito(itemsDisponibles,descuentosDisponibles);






