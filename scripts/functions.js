//////a quitar ////////////////////////////////////
const buscarProductosAPI = async (texto) => {
    const url = "https://api.mercadolibre.com/sites/MLU/search?q=";
    await fetch(url + texto)
    .then(respuesta => respuesta.json())
    .then(datos => {
        console.log(datos);
        return datos;
    })
}

async function buscarCotizacionesAPI() {
    let salida = {};
    const url = "";//"https://uruguayapi.onrender.com/api/v1/banks/brou_rates";
    salida = await fetch(url)
    .then(respuesta => respuesta.json())
    .then(datos => {
        console.log("datos de uruguayapi: "+datos);
        salida = datos;
        return salida; 
    })
    .catch (()=>{ 
        const buscoJson = async () => { salida = await buscarCotizacionesJsonAPI(); console.log("busco en json desde el catch: "+salida.dolar.bid);return salida};
        
        return buscoJson();      
    })  
    console.log("busco en json porque no espero: "+salida+" "+(salida?.dolar?.bid || -1));
    return salida;      
}

const buscarCotizacionesJsonAPI = async () => {
    let salida = {}; 
    console.log("salida inicializada vacía: "+salida);      
    const url = "./json/cotizaciones.json";       
    await fetch(url)
    .then(respuesta => respuesta.json())   
    .then(datos => {salida = datos; console.log("datos de json sacado de uruguayapi"+datos); alert("datos de json sacado de uruguayapi: "+salida)})
    .catch(() => {salida = {
        "dolar": {
            "bid": "40,20000",
            "ask": "42,70000",
            "spread_bid": "1,00000",
            "spread_ask": "1,00000"
        },
        "dolar_ebrou": {
            "bid": "40,60000",
            "ask": "42,30000",
            "spread_bid": "1,00000",
            "spread_ask": "1,00000"
        },
        "euro": {
            "bid": "42,37000",
            "ask": "47,44000",
            "spread_bid": "1,05410",
            "spread_ask": "1,11090"
        },
        "peso_argentino": {
            "bid": "0,02400",
            "ask": "0,20000",
            "spread_bid": "1.779,16670",
            "spread_ask": "201,00000"
        },
        "real": {
            "bid": "7,00000",
            "ask": "8,70000",
            "spread_bid": "6,10000",
            "spread_ask": "4,62070"
        },
        "libra_esterlina": {
            "bid": "50,89000",
            "ask": "57,49000",
            "spread_bid": "1,26600",
            "spread_ask": "1,34630"
        },
        "franco_suizo": {
            "bid": "45,57000",
            "ask": "50,17000",
            "spread_bid": "0,88220",
            "spread_ask": "0,85120"
        },
        "guarani": {
            "bid": "0,00495",
            "ask": "0,00548",
            "spread_bid": "8.127,92000",
            "spread_ask": "7.796,32000"
        },
        "unidad_indexada": {
            "bid": "-",
            "ask": "6,12440",
            "spread_bid": "-",
            "spread_ask": "-"
        },
        "onza_troy_de_oro": {
            "bid": "109.233,85200",
            "ask": "117.209,79200",
            "spread_bid": "2.717,26000",
            "spread_ask": "2.744,96000"
        }
    }; 
    console.log("datos por defecto sacado de uruguayapi: "+salida.dolar.bid);
    }) 
    console.log("a ver que hay ahora: "+salida.dolar.bid);
    return salida;           
}
////////////////////////////////////////////////////////////////////

//agrega a 'itemsDisponibles' nuevos items creados a partir de 'items' y 'precios'
function agregarItemsDisponibles(itemsDisponibles,items,precios){
    if(items.length==precios.length){
        id = itemsDisponibles.length+1;
        for(let index=0; index<items.length;index++){
            const item = new Item(id,items[index],precios[index]);
            itemsDisponibles.push(item);
            id++;
        }
    }else{
        alert("Error en carga de ítems");
    }
}

//agrega a 'itemsDisponibles' nuevos items creados a partir del archivo sitios.json o carga items por defecto en caso de no acceder al archivo
const buscarItemsDisponibles = async (itemsDisponibles) => {   
    console.log("entro a cargar items disponibles");
    // Inicializar Items Disponibles por defecto
    const ITEMS = ["Sitio_Institucional/Empresarial","Sitio_Personal/Portafolio","Micrositio","Blog","Plataforma Educativa","Comercio electrónico","Portal","Noticias/Revista","Wiki/Foro","Red Social"];     
    const PRECIOS = [1000.00, 500.00, 600.00, 400.00, 700.00, 2000.00, 3000.00, 1500.00, 300.00, 2500.00];
    
    const url = "./json/sitios.json"; 
    console.log("pido al fetch del json de items disponibles");      
    await fetch(url)
    .then(respuesta => {respuesta.json(); console.log("primer then")})   
    .then(datos => {itemsDisponibles = datos; console.log("segundo then")})
    .catch(()=>{agregarItemsDisponibles(itemsDisponibles,ITEMS,PRECIOS); console.log("catch items dispo x def")});
    console.log("salí del fetch de json de items disponibles");    
    return itemsDisponibles;       
}


// verifica si numeroArticulo es un artículo válido de itemsDisponibles
function articuloValido(itemsDisponibles,numeroArticulo){
    if((numeroArticulo>0)&&(numeroArticulo<=itemsDisponibles.length)){
        return true;                    
    }else{
        return false;
    }
}

//Devuelve el nombre del artículo si numeroArticulo es un artículo válido de itemsDisponibles o "Descatalogado" en caso contrario
function darNombreArticulo(itemsDisponibles,numeroArticulo){
    if(articuloValido(itemsDisponibles,numeroArticulo)){
        return itemsDisponibles[numeroArticulo-1].nombre;                    
    }else{        
        return "No disponible";
    }
}

//Devuelve el precio del artículo si numeroArticulo es un artículo válido de itemsDisponibles o -1 en caso contrario
function darPrecio(itemsDisponibles,numeroArticulo){    
    if(articuloValido(itemsDisponibles,numeroArticulo)){       
        return itemsDisponibles[numeroArticulo-1].precio;  
    }else{
        alert("Número de artículo incorrecto");
        return -1;
    }
}



// codigoSitio(): devuelve el código del sitio elegido si es un valor válido o 0 sino
function codigoSitio(){   
    let sitioElegido = parseInt(document.getElementById("sitio").value);      
    let resultado = sitioElegido>0? sitioElegido : 0;    
    return resultado;                
}

// cantidadDePaginas(): devuelve la cantidad de páginas elegidas si es un valor válido o 1 sino
function cantidadDePaginas(){            
    let cantidad = parseInt(document.getElementById("cantidad").value);    
    let resultado = cantidad>0? cantidad : 1;    
    return resultado;                 
}



//guarda en local storage el sitio y cantidad ingresado en el formulario de servicios premium
function sitioYCantidad(){    
    const resultado = { sitio:codigoSitio(),cantidad:cantidadDePaginas()}; 
    let mensaje = `El sitio no está disponible en este momento`;
    if (articuloValido(itemsDisponibles,resultado.sitio)){
        let nombreSitio = darNombreArticulo(itemsDisponibles,resultado.sitio); 
        mensaje = `Se agregó al carrito ${resultado.cantidad} páginas de un sitio ${nombreSitio}`;               
        let carrito = JSON.parse(localStorage.getItem('carrito'));        
        if (carrito){            
            let sitioExistente = carrito.find((elem)=>elem.sitio === resultado.sitio); 
            if (sitioExistente!=undefined){
                sitioExistente.cantidad += resultado.cantidad;
            }else{
                carrito.push(resultado);
            }
        }
        else{
            carrito = [];
            carrito.push(resultado);
        }            
        localStorage.setItem('carrito',JSON.stringify(carrito));       
    }        
    Swal.fire({
        text: mensaje,         
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#114c5f",         
        width: 800,        
        padding: "6em",
        color: "#0799b6",
        background: "9cd2d3",        
      });  
    actualizoCarrito();  
}

function agregarArticulo(miCarrito, numeroArticulo, cantidad){
    if(articuloValido(miCarrito.itemsDisponibles,numeroArticulo)){
        const articulo = miCarrito.itemsPedidos.find((elem) => elem.numeroArticulo === numeroArticulo);
        if( articulo == undefined){
            miCarrito.itemsPedidos.push({ numeroArticulo: numeroArticulo, cantidad: cantidad });                        
        }else{
            articulo.cantidad += cantidad;                
        }                                           
    }else{
        alert("Artículo no disponible");
    }                       
}

function cargoCarrito(miCarrito){
    let carrito = JSON.parse(localStorage.getItem('carrito'));        
    let salida = "";
    if (carrito){      
        miCarrito.itemsPedidos=[];      
        carrito.forEach(element => {
            salida += `
            <p class="my-2 text-secondary">
                <strong>${darNombreArticulo(itemsDisponibles,element.sitio)}</strong> (${element.cantidad} páginas) 
                <span class="text-primary">
                    Precio por página $ ${darPrecio(itemsDisponibles,element.sitio)} + IVA   
                    <button type="button" class="btn btn-primary px-1 ms-4"  id="mas">+</button>
                    <button type="button" class="btn btn-primary px-1 ms-1"  id="menos">-</button>
                    <button type="button" class="btn btn-primary px-1 ms-1"  id="papelera">x</button>
                </span>
            </p>`;
            agregarArticulo(miCarrito,element.sitio,element.cantidad);            
        });
    }
    return salida;            
}


function renderCarrito(carrito){
   
    let sitiosPedidos = cargoCarrito(carrito);
    
    let miCarrito = new Carrito(carrito.itemsDisponibles,carrito.descuentosDisponibles);
    miCarrito.itemsPedidos=carrito.itemsPedidos;
    
    let sitiosCarrito = `
        ${sitiosPedidos}
    `;  
    document.getElementById("sitiosCarrito").innerHTML = sitiosCarrito;
    
    let subtotalCarrito = `
        ${miCarrito.subtotalCarrito(dto0)} 
    `;  
    document.getElementById("subtotalCarrito").innerHTML = subtotalCarrito;

    let porcentajeIVA = `
        ${IVA*100} 
    `; 
    document.getElementById("porcentajeIVA").innerHTML = porcentajeIVA;

    let iva = `
        ${miCarrito.subtotalCarrito(dto0)*IVA}
    `;
    document.getElementById("iva").innerHTML = iva;

    let subtotalIVA = `                                   
        ${miCarrito.subtotalCarrito(dto0)*(1+IVA)}   
    `;  
    document.getElementById("subtotalIVA").innerHTML = subtotalIVA;   
    
}

function descontar(){
    let sitiosPedidos = cargoCarrito();
    let resumenCarrito = `

        <div class="row">
            <h1 class="col-12 text-center">Resumen del carrito</h1>            
        </div>

        <section class="row justify-content-center align-items-center bg-warning-subtle rounded my-3 px-2">
            <div class="p-xl-3 p-1 col-12 m-2" id="mostrarCarrito">
                <h2 class="text-primary ">
                    Sitios solicitados:
                </h2>
                ${sitiosPedidos} 
                <p>Subtotal Carrito $ ${miCarrito.subtotalCarrito(dto0)} + IVA  </p>   
                <p>IVA ${IVA*100}% $ ${miCarrito.subtotalCarrito(dto0)*IVA}</p>  
                <p>Subtotal IVA incluido $ ${miCarrito.subtotalCarrito(dto0)*(1+IVA)}</p>      
            </div> 
        </section>
              

    `;  
    let mainPremium = document.getElementById("mainPremium");
    mainPremium.innerHTML = resumenCarrito;
}