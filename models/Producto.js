import mongoose from "mongoose";

const productoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    thumbnail: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    }
});

const Producto = mongoose.model("Producto", productoSchema);

export default Producto;