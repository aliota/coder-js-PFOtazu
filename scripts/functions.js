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

//devuelve los items disponibles cargados desde archivo sitios.json o cero en caso de no acceder al archivo
const actualizarItemsDisponibles = async () => {         
    const url = "./json/sitios.json";         
    const items = await fetch(url)
    .then(respuesta => respuesta.json())   
    .then(datos => {return datos}) 
    .catch(()=>{return 0});          
    return items;       
}

//devuelve los descuentos disponibles cargados desde archivo descuentos.json o cero en caso de no acceder al archivo
const actualizarDescuentosDisponibles = async () => {         
    const url = "./json/descuentos.json";         
    const descuentos = await fetch(url)
    .then(respuesta => respuesta.json())   
    .then(datos => {return datos}) 
    .catch(()=>{return 0});          
    return descuentos;       
}

// verifica si numeroArticulo es un artículo válido de itemsDisponibles
function articuloValido(itemsDisponibles,numeroArticulo){  
    return ((numeroArticulo>0)&&(numeroArticulo<=(itemsDisponibles?.length || 0)))?true:false;
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
        alert(`Este número de artículo: ${numeroArticulo} no pertenece a los items disponibles: ${itemsDisponibles} `);
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
function sitioYCantidad(miPedido){    
    const pedido= { sitio:codigoSitio(),cantidad:cantidadDePaginas()};     
    let mensaje = `El sitio no está disponible en este momento`;
    let carrito = [];
    if (articuloValido(miPedido.itemsDisponibles,pedido.sitio)){
        let nombreSitio = darNombreArticulo(miPedido.itemsDisponibles,pedido.sitio); 
        mensaje = `Se agregó al carrito ${pedido.cantidad} ${pedido.cantidad==1?"página":"páginas"} de un sitio tipo ${nombreSitio}`;               
        carrito = JSON.parse(localStorage.getItem('carrito'));        
        if (carrito){            
            let sitioExistente = carrito.find((elem)=>elem.sitio === pedido.sitio); 
            if (sitioExistente!=undefined){
                sitioExistente.cantidad += pedido.cantidad;
            }else{
                carrito.push(pedido);
            }
        }
        else{ 
            carrito = [];         
            carrito.push(pedido);
        }            
        localStorage.setItem('carrito',JSON.stringify(carrito));       
    }        
    Swal.fire({
        text: mensaje,         
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#114c5f",         
        width: 400,        
        color: "#0799b6",
        background: "9cd2d3",        
      });  
    compra = new Pedido(miPedido.itemsDisponibles,miPedido.descuentosDisponibles);
    carrito.forEach(elem =>{compra.agregarArticulo(elem.sitio,elem.cantidad)});    
    renderCarrito(compra,0);  
}

function cargoCarrito(miPedido){
    let carrito = JSON.parse(localStorage.getItem('carrito')); 
    let salida = "";
    // const ipAPI = "//api.ipify.org?format=json";
    // const response = await fetch(ipAPI);
    // const data = await response.json();
    // const inputValue = data.ip;       
    // salida += "IP: "+inputValue;
    if (carrito){      
        miPedido.itemsPedidos=[];      
        carrito.forEach(element => {
            salida += `
            <p class="my-2 text-secondary">
                <strong>${darNombreArticulo(miPedido.itemsDisponibles,element.sitio)}</strong> (${element.cantidad} páginas) 
                <span class="text-primary">
                    Precio por página $ ${darPrecio(miPedido.itemsDisponibles,element.sitio)} + IVA   
                    <button type="button" class="btn btn-primary px-1 ms-4"  id="mas">+</button>
                    <button type="button" class="btn btn-primary px-1 ms-1"  id="menos">-</button>
                    <button type="button" class="btn btn-primary px-1 ms-1"  id="papelera">x</button>
                </span>
            </p>`;             
            miPedido.agregarArticulo(element.sitio,element.cantidad);             
        });
    }
    return salida;            
}


function renderCarrito(pedido,indiceDto){
    let miDescuento = pedido.descuentosDisponibles[indiceDto]||dto0;
    let dto = new Descuento(miDescuento.id,miDescuento.valor);
    
    let sitiosPedidos = cargoCarrito(pedido);
    
    let miPedido = new Pedido(pedido.itemsDisponibles,pedido.descuentosDisponibles);
    miPedido.itemsPedidos=pedido.itemsPedidos;
    
    let sitiosCarrito = `${sitiosPedidos}`;  
    document.getElementById("sitiosCarrito").innerHTML = sitiosCarrito;
    
    let subtotalCarrito = `${miPedido.subtotalCarrito(dto)}`;  
    document.getElementById("subtotalCarrito").innerHTML = subtotalCarrito;

    let descuento = `${dto.valor*100}`;  
    document.getElementById("descuento").innerHTML = descuento;

    let subtotalCarritoDto = `${miPedido.subtotalCarrito(dto)}`;  
    document.getElementById("subtotalCarritoDto").innerHTML = subtotalCarritoDto;


    let porcentajeIVA = `${IVA*100}`; 
    document.getElementById("porcentajeIVA").innerHTML = porcentajeIVA;

    let iva = `${miPedido.subtotalCarrito(dto)*IVA}`;
    document.getElementById("iva").innerHTML = iva;

    let subtotalIVA = `${miPedido.subtotalCarrito(dto)*(1+IVA)}`;  
    document.getElementById("subtotalIVA").innerHTML = subtotalIVA;     
}

function descontar(miPedido){
    let sitiosPedidos = cargoCarrito(miPedido);
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
                <p>Subtotal Carrito $ ${miPedido.subtotalCarrito(dto0)} + IVA  </p>   
                <p>IVA ${IVA*100}% $ ${miPedido.subtotalCarrito(dto0)*IVA}</p>  
                <p>Subtotal IVA incluido $ ${miPedido.subtotalCarrito(dto0)*(1+IVA)}</p>      
            </div> 
        </section>
    `;  
    let mainPremium = document.getElementById("mainPremium");
    mainPremium.innerHTML = resumenCarrito;
}

// Cargar Carrito desde local storage
let crearCarrito  = async (itemsPorDefecto,descuentosPorDefecto)=>{ 
    let itemsDisponibles = await actualizarItemsDisponibles();    
    itemsDisponibles=itemsDisponibles||itemsPorDefecto;
    let descuentosDisponibles = await actualizarDescuentosDisponibles();    
    descuentosDisponibles=descuentosDisponibles||descuentosPorDefecto;
    
    // Carrito
    const miPedido = new Pedido(itemsDisponibles,descuentosDisponibles);    
    renderCarrito(miPedido,0);    
    return miPedido;    
}

// Actualizar carrito 
let actualizarCarrito  = async (itemsDisponibles,descuentosDisponibles)=>{ 
    let miPedido = await crearCarrito(itemsDisponibles,descuentosDisponibles);     
    document.getElementById("aplicar").addEventListener("click", function() {           
        sitioYCantidad(miPedido);
    });
    document.getElementById("vaciar").addEventListener("click", function() {        
        miPedido.vaciarCarrito();
        localStorage.setItem('carrito',JSON.stringify([]));
        renderCarrito(miPedido,0);           
        Swal.fire({
            text: "Carrito vaciado",         
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#114c5f",         
            width: 400,        
            color: "#0799b6",
            background: "9cd2d3",        
        });        
    });        
    document.getElementById("pagar").addEventListener("click", function() {  
        // cliente paga      
        miPedido.vaciarCarrito();
        localStorage.setItem('carrito',JSON.stringify([]));
        renderCarrito(miPedido,0);           
        Swal.fire({
            text: "Gracias por su compra",         
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#114c5f",         
            width: 400,        
            color: "#0799b6",
            background: "9cd2d3",        
        });        
    });            
    document.getElementById("aplicarDescuento").addEventListener("click", async function() {              
        const inputValue = "";
        const { value: dto } = await Swal.fire({
        title: "Ingrese su código de descuento",
        input: "text",
        inputLabel: "",
        inputValue,
        showCancelButton: true,
        inputValidator: (value) => {
            if (!value) {
            return "Ingrese";
            }
        }
        });
        if (dto) {
        Swal.fire(`Descuento ingresado ${dto}`);
        }
        renderCarrito(miPedido,0);        
    });            
}
