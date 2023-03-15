import mongoose from "mongoose";
import Producto from "../models/Producto.js"

const getProductos = async (req,res) => {
  const productos = await Producto.find();
  res.render("index", {productos})
}


// class Productos{
//   constructor(){
    
//   }
//   async getProducts(){
//     let array = [];
//     const productos = await Producto.find();
//     array.push(productos);
//     return array
//   }
//   async deleteOneProduct(id){
//     this.getProducts()
//     const producto = await Producto.findOne(id);
//     const productoEncontrado = array.filter(p => p.id == producto.id)
//   }
// }

export default getProductos;