import mongoose from "mongoose";

const ordenSchema = mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    },
    carrito: {
        type: Object,
        required: true
    },
    cantidadOrdenes: {
        type: Number
    },
    fechaYHora: {
        type: String
    },
    estado: {
        type: String
    },
    email: {
        type: String, 
        required: true
    }
});


const Orden = mongoose.model("Orden", ordenSchema);

export default Orden;