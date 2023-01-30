function Cart(antiguoCarrito) {
        this.productos = antiguoCarrito.productos || {};
        this.cantidadTotal = antiguoCarrito.cantidadTotal || 0;
        this.precioTotal = antiguoCarrito.precioTotal || 0;

        this.agregarProducto= function(producto,id){
            let productoGuardado = this.productos[id];
            if (!productoGuardado) {
                productoGuardado = this.productos[id] = {producto: producto, cantidad: 0, price: 0}
            }
            productoGuardado.cantidad++;
            productoGuardado.price = productoGuardado.producto.price * productoGuardado.cantidad;
            this.cantidadTotal++;
            this.precioTotal += productoGuardado.producto.price;
        }
    this.reducirUno = function (id) {
        this.productos[id].cantidad--;
        this.productos[id].price -= this.productos[id].producto.price;
        this.cantidadTotal--;
        this.precioTotal -= this.productos[id].producto.price;

        if(this.productos[id].cantidad <= 0) {
            delete this.productos[id];
        }
    };

    this.eliminarProducto = function (id) {
        this.cantidadTotal -= this.productos[id].cantidad;
        this.precioTotal -= this.productos[id].price;
        delete this.productos[id];
    };

    this.crearArray= function(){
        let array = [];
        for(let id in this.productos){
            array.push(this.productos[id]);
        }
        return array;
    }
}

export default Cart;