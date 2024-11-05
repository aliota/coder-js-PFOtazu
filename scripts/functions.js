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
    renderCarrito(compra,dto0);  
}

function cargoCarrito(miPedido){
    let carrito = JSON.parse(localStorage.getItem('carrito')); 
    let salida = "";    
    if (carrito){      
        miPedido.itemsPedidos=[];      
        carrito.forEach(element => {
            salida += `
            <p class="my-2 text-secondary">
                <strong>${darNombreArticulo(miPedido.itemsDisponibles,element.sitio)}</strong> (${element.cantidad} ${element.cantidad==1?"página":"páginas"}) 
                <span class="text-primary">
                    Precio por página $ ${darPrecio(miPedido.itemsDisponibles,element.sitio)} + IVA                     
                </span>
            </p>`;             
            miPedido.agregarArticulo(element.sitio,element.cantidad);                    
        });
    }
    return salida;            
}


function renderCarrito(pedido,miDescuento){
    //let miDescuento = pedido.descuentosDisponibles[indiceDto]||dto0;    
    let dto = new Descuento(miDescuento.id,miDescuento.valor)||dto0;;
    
    let sitiosPedidos = cargoCarrito(pedido);
    
    let miPedido = new Pedido(pedido.itemsDisponibles,pedido.descuentosDisponibles);
    miPedido.itemsPedidos=pedido.itemsPedidos;
    
    let sitiosCarrito = `${sitiosPedidos}`;  
    document.getElementById("sitiosCarrito").innerHTML = sitiosCarrito;
    
    let subtotalCarrito = `${miPedido.subtotalCarrito(dto0)}`;  
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

// Cargar Carrito desde local storage
let crearCarrito  = async (itemsPorDefecto,descuentosPorDefecto)=>{ 
    let itemsDisponibles = await actualizarItemsDisponibles();    
    itemsDisponibles=itemsDisponibles||itemsPorDefecto;
    let descuentosDisponibles = await actualizarDescuentosDisponibles();    
    descuentosDisponibles=descuentosDisponibles||descuentosPorDefecto;
    
    //Cargo servicios
    let sitios = "";
    let index = 0;
    itemsDisponibles.forEach(elem=>{
        sitios += `<option value=${++index}>${elem.nombre}</option>`;        
    })
    document.getElementById("sitio").innerHTML=sitios;

    // Carrito
    const miPedido = new Pedido(itemsDisponibles,descuentosDisponibles);    
    renderCarrito(miPedido,dto0);    
    return miPedido;    
}

//devuelve la IP 
const miIP = async () => {         
    const url = "//api.ipify.org?format=json";         
    const IP = await fetch(url)
    .then(respuesta => respuesta.json())   
    .then(datos => {return datos.ip}) 
    .catch(()=>{return ""});          
    return IP;       
}

const mostrarIP = async() =>{
    let ip = await miIP();   
    document.getElementById("ip").innerHTML = ip;
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
        renderCarrito(miPedido,dto0);           
        Swal.fire({
            title: "Carrito vaciado",         
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
        renderCarrito(miPedido,dto0);           
        Swal.fire({
            title: "Gracias por su compra",         
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#114c5f",         
            width: 400,        
            color: "#0799b6",
            background: "9cd2d3",        
        });        
    });            
    document.getElementById("aplicarDescuento").addEventListener("click", async function() {     
       
        const { value: dto } = await Swal.fire({
        title: "Ingresa tu código de descuento",
        input: "text",           
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#114c5f",          
        color: "#0799b6",
        background: "9cd2d3",
        width: "300px",        
        showCancelButton: false,        
        });
        let miDescuento = miPedido.descuentosDisponibles.find(elem=>elem.id===dto);
        if (miDescuento!=undefined) {
            
            Swal.fire({
                title: dto,  
                text: `Descuento ingresado: ${miDescuento.valor*100}%`,    
                showConfirmButton:true,  
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#114c5f",                         
                color: "#114c5f",
                background: "9cd2d3",
                width: "300px",                         
                });
        }else{
            miDescuento = dto0;
            Swal.fire({    

                text: `Código de descuento incorrecto`,    
                showConfirmButton:false,                      
                timer:2000,         
                color: "#114c5f",
                background: "9cd2d3",
                width: "300px",                         
            });

        }
        renderCarrito(miPedido,miDescuento);        
    });            
}

//Datos de Contacto
document.getElementById("enviarContacto").addEventListener("click",()=>{
    let contenidoOK = document.getElementById("nombre").value && document.getElementById("email").value && document.getElementById("tel").value && document.getElementById("consulta").value;
    if (contenidoOK){    
        Swal.fire({    
            text: `Gracias por enviarnos sus consultas`,    
            showConfirmButton:true,  
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#114c5f",                         
            color: "#114c5f",
            background: "9cd2d3",
            width: "300px",                        
        });
    }else{
        Swal.fire({    
            text: `Completa todos los campos`,    
            showConfirmButton:true,  
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#114c5f",                         
            color: "#114c5f",
            background: "9cd2d3",
            width: "300px",                        
        }); 
    }
});

