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
    alert(mensaje);          
}


function renderCarrito(){
    let carrito = JSON.parse(localStorage.getItem('carrito'));        
    let salida = "";
    if (carrito){      
        miCarrito.vaciarCarrito();      
        carrito.forEach(element => {
            salida += `
            <p class="my-2 text-secondary">
                <strong>${darNombreArticulo(itemsDisponibles,element.sitio)}</strong> (${element.cantidad} páginas) - <span class="text-primary">Precio por página $ ${darPrecio(itemsDisponibles,element.sitio)} + IVA </span>
            </p>`;
            miCarrito.agregarArticulo(element.sitio,element.cantidad);            
        });
    }
    return salida;            
}

function resumenCarrito(){
    let sitiosPedidos = renderCarrito();
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

function descontar(){
    let sitiosPedidos = renderCarrito();
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