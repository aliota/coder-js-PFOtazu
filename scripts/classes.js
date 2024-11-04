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

class Pedido{
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
        return this.itemsPedidos.reduce((acumulador,elem) => acumulador + elem.cantidad * descuento.aplicarDescuento(darPrecio(this.itemsDisponibles,elem.numeroArticulo)),0);          
    }   

}




