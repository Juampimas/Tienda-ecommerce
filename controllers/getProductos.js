import mongoose from "mongoose";
import Producto from "../models/Producto.js"

const getProductos = async (req,res) => {
  const productos = await Producto.find();
  res.render("index", {productos})
}

export default getProductos;