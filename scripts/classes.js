class Item{
    constructor(id, nombre, precio){
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
    }  
}

class Descuento{
    constructor(id, valor){
        this.id = id;
        this.valor = valor;        
    }
    aplicarDescuento(importe) {
        return(importe*(1-this.valor));            
    }
}

class Carrito{
    constructor(itemsDisponibles,descuentosDisponibles){
        this.itemsPedidos = [];
        this.itemsDisponibles = itemsDisponibles;
        this.descuentosDisponibles = descuentosDisponibles;        
    }
    vaciarCarrito(){
        this.itemsPedidos = [];
    }

    //Devuelve la cantidad de artículos con número de artículo numeroArticulo
    darCantidad(numeroArticulo){        
        const articulo = this.itemsPedidos.find((elem) => elem.numeroArticulo === numeroArticulo);
        if( articulo == undefined){
            return 0;                 
        }else{
            return articulo.cantidad;
        }      
    }    

    agregarArticulo(numeroArticulo, cantidad){
        if(articuloValido(this.itemsDisponibles,numeroArticulo)){
            const articulo = this.itemsPedidos.find((elem) => elem.numeroArticulo === numeroArticulo);
            if( articulo == undefined){
                this.itemsPedidos.push({ numeroArticulo: numeroArticulo, cantidad: cantidad });                        
            }else{
                articulo.cantidad += cantidad;                
            }                                           
        }else{
            alert("Artículo no disponible");
        }                       
    }

    quitarArticulo(numeroArticulo, cantidad){
        if(this.articuloValido(this.itemsDisponibles,numeroArticulo)){
            const articulo = this.itemsPedidos.find((elem) => elem.numeroArticulo === numeroArticulo);
            if( articulo != undefined){
                articulo.cantidad -= cantidad;
                if(articulo.cantidad<0){
                    articulo.cantidad = 0;
                }               
            }                           
        }else{
            alert("Número de artículo incorrecto");
        }   
    }

    subtotalCarrito(descuento){                      
        return this.itemsPedidos.reduce((acumulador,elem) => acumulador + elem.cantidad * descuento.aplicarDescuento(darPrecio(itemsDisponibles,elem.numeroArticulo)),0);          
    }
    
    mostrarCarrito(){   
        let mensaje ="Carrito:\n";              
        for(const elem of this.itemsPedidos){
            mensaje = mensaje + "\n"+elem.cantidad+" "+this.darNombreArticulo(elem.numeroArticulo)+"\n Precio unitario: "+this.darPrecio(elem.numeroArticulo)+" UYU + IVA   Precio subtotal: "+(this.darPrecio(elem.numeroArticulo)*elem.cantidad)+" UYU + IVA";
        }
        return (confirm(mensaje));
        
    }
    
    mostrarCarritoDto(descuento){
        let mensaje ="Carrito:\n";
        let precio = 0;
        let precioConDescuento = 0;
        let precioSubtotalConDescuento = 0;
        let subtotal = 0;
        for(const elem of this.itemsPedidos){           
            precio = this.darPrecio(elem.numeroArticulo);
            precioConDescuento = descuento.aplicarDescuento(precio);
            precioSubtotalConDescuento = precioConDescuento*elem.cantidad;
            mensaje = mensaje + "\n"+elem.cantidad+" "+this.darNombreArticulo(elem.numeroArticulo)+"\n   Precio unitario: "+precio+" UYU + IVA\n   Precio unit. con "+descuento.valor*100+"% dto: "+ precioConDescuento+" UYU + IVA\n   Precio subtotal: "+precioSubtotalConDescuento+" UYU + IVA\n";
            subtotal += precioSubtotalConDescuento;            
        }   
        console.log("Total carrito con descuento = "+subtotal+" UYU + IVA");
        console.log("Total carrito con descuento IVA incluido = "+subtotal*(1+IVA)+" UYU + IVA"); 
        return(confirm(mensaje+"\nTotal con "+descuento.valor*100+"% dto: "+subtotal+" UYU\nIVA "+IVA*100+"%: "+(subtotal*IVA)+" UYU\nTotal IVA incluido: "+(subtotal*(1+IVA))+" UYU"));    
    }
    
    cargarCarrito(){        
        let item = 0;   
        let continuar = false; 
        let verCarrito = false;    
        alert('cargar carrito');    
        do {
            alert('entro cargar carrito'); 
            ///////////////////////
            //let codigoSitio = this.codigoSitio(); // devuelve el código de sitio elegido o 0 
            let sitio = document.getElementById("sitio").value;
            alert("entrada sitio:" + sitio); 
            if(sitio==NaN)
                sitio=0;
            alert("entrada sitio:" + sitio); 
            //////////////////////////////////
            let codigoSitio = sitio;
    
            if(articuloValido(this.itemsDisponibles,codigoSitio)){
                //Número de item correcto, ver cantidad de páginas web del sitio
                let cantidad = cantidadDePaginas();
                    if (cantidad>0){
                        this.agregarArticulo(codigoSitio, cantidad);
                    }else {
                        alert("La cantidad de páginas debe ser mayor que cero");
                    }           
            }else{
                codigoSitio = 0; // si el sitio no está disponible devuelve cero
                alert("Sitio no disponible");            
            }  
    
    
            item = codigoSitio;  
            alert("item cargar carrito: "+item);             
             if ((item>0)){
                 continuar = confirm("¿Desea agregar más artículos?");   
                 verCarrito = true;            
             }else{ 
               continuar = false;
               alert("Error en la carga del carrito, inténtelo de nuevo más tarde");              
             }          
        } while (continuar);    
        return(verCarrito); 
    }
    
    
    
    aplicarDescuentoCarrito(){
        let intentoDto = 0;
        const salida = new Descuento("",0);
        let ingresaDescuento = confirm("¿Desea ingresar un código de descuento?");                   
        while(ingresaDescuento && (intentoDto<3)){           
            let codigoDto = prompt("Ingrese código de descuento:");
            intentoDto++;
            const descuento = this.descuentosDisponibles.find((elem)=>elem.id===codigoDto);
            if (descuento!=undefined){
                salida.valor = descuento.valor;
                salida.id = descuento.id;                
                alert("Se aplica un "+salida.valor*100+"% de descuento");
                ingresaDescuento = false;
            }else{
                if (intentoDto<3){
                    ingresaDescuento = confirm("Código de descuento incorrecto. ¿Desea volver a ingresar el código?");
                }else{
                    alert("Código de descuento incorrecto");
                    ingresaDescuento = false;
                }
            }                
        } 
        return salida;       
    }


}