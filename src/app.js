const express = require('express')
const app = express()
const path = require('path')
const methodOverride =  require('method-override'); // Pasar poder usar los métodos PUT y DELETE
const session = require('express-session');
const cookies = require('cookie-parser');

const userLoggedMiddleware = require('./middleware/userLoggedMiddleware');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false })); // para poder trabajar con formularios
app.use(express.json()); // para poder trabajar con información que llegue en formato json
app.use(methodOverride('_method'));  // Pasar poder pisar el method="POST" en el formulario por PUT y DELETE

app.use(session({
	secret: "Shhh, It's a secret",
	resave: false,
	saveUninitialized: false,
}));

app.use(cookies());
app.use(userLoggedMiddleware);




app.set('views', path.resolve(__dirname, './views')); 
app.set('view engine', 'ejs');

const mainRouter = require("./routes/mainRouter")
app.use("/" ,mainRouter)

//Users
const userRouter = require("./routes/userRouter")
app.use("/users", userRouter)

// Products
const productRouter = require("./routes/productRouter")
app.use("/products", productRouter)

const port = process.env.PORT || 3030;

app.use((req, res, next) => {
    const error = new Error('Error 404 - No se encontró la pagina solicitada');
    res.status(404).render('/partials/404', {
        message: error.message,
        path: `http://${req.hostname}:${port}${req.url}`,
        status: 404,
        error
    })

})

app.listen(port, () => {
    console.log("Servidor corriendo en el puerto " + port);
})


