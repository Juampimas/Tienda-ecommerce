// modulos
import express from "express"
import mongoose from "mongoose"
import session from "express-session"

// archivos
import database from "./config/database.js"
// import index from "./routes/index.js"
import getProductos from "./controllers/getProductos.js"

const app = express();

// db connection
mongoose.connect(database);
let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log(`Conectado a MongoDB: ${database}`);
});


// settings
app.set("views", "./views");
app.set("view engine", "ejs");

// middlewares
app.use(express.static("./public"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());

// Session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))

// routes
app.use("/", getProductos)

// port
const port = 3000;

app.listen(port, () => {
    console.log(`El servidor se está escuchando por el puerto ${port}`);
})