// Constantes
const IVA = 0.22;
const mensajeContinuarOSalir = "Elija Aceptar para continuar o Cancelar para salir del simulador";
const mensajeCarritoOSalir = "Elija Aceptar para comenzar de nuevo o Cancelar para salir del simulador";

// Inicializar Items Disponibles
const ITEMS = ["Paragüas","Botas","Pilots","Cobertores","Enteritos"];
const PRECIOS = [100.00,200.00,300.00,400.00,500.00];
const itemsDisponibles = [];
agregarItemsDisponibles(itemsDisponibles,ITEMS,PRECIOS);
console.log(itemsDisponibles);

// Inicializar descuentos
const dto0 = new Descuento("",0);
const dto5 = new Descuento("abc5",0.05);
const dto10 = new Descuento("def10",0.10);
const descuentosDisponibles = [dto0,dto5,dto10];
console.log(descuentosDisponibles);


//Simular carrito
const carrito = new Carrito(itemsDisponibles,descuentosDisponibles);
console.log(carrito);

carrito.simulador();
