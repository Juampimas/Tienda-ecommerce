import mongoose from "mongoose";
import Productos from "../models/Producto.js"

const getProductos = async (req,res) => {
  const productos = await Productos.find();
  res.render("index", {productos})
}

export default getProductos;