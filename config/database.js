import mongoose from "mongoose"

mongoose.set('strictQuery', false)

let database = 'mongodb://127.0.0.1:27017/ecommerce';

mongoose.connect(database);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`Conectado a MongoDB: ${database}`);
});

export default db;
