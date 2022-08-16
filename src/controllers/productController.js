const path = require('path');
const fs = require('fs');
const { validationResult } = require("express-validator");

const universalModel = require('../model/universalModel'); 
const productModel = universalModel('products');
const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const productController = {

    listadoProductos: (req,res) =>{
        const allProducts = productModel.findAll() // productos todo lo que labura con el array de productos va con allproducts
        const table = allProducts.filter( product => product.category == "table" );
        const coffeeTable = allProducts.filter( product => product.category == "coffeeTable" );
        const desk = allProducts.filter( product => product.category == "desk" );
        const mirror = allProducts.filter( product => product.category == "mirror" );
        res.render("productos/products",
        {
            title: "Productos",
            table,
            coffeeTable,
            desk,
            mirror
        }
        )
    },

    
    carrito:(req,res) =>{
        res.render("productos/productCart",
        {
            title: "Carrito",
            product,
            
        }
        )
    },

    // Detail

    detail: (req,res) =>{
        const product = productModel.findById(req.params.id);
        /*const product = productModel.find(product => product.id === id)*/
        res.render("./productos/productDetail",
        {
            title: "Detalle",
            product,
            toThousand

        }
        )
    },

   // Create - Form to create

    create: (req,res) =>{
        res.render("productos/addProduct", {title: "Crear producto"},)
    },

    // Create -  Method to store
    store: (req, res) => {
		const files = req.files
        
        const resultadosValidaciones = validationResult(req);
        if (!resultadosValidaciones.isEmpty()){
            console.log("----- ojo HAY ERRORES -----------------")
            
            // Si hay errores borramos los archivos que cargó multer
            files.forEach( file => {
                const filePath = path.join(__dirname, `../../public/images/products/${file.filename}`);
                fs.unlinkSync(filePath);
            })
            
            console.log("-------- my body -------------------")
            console.log(req.body);  

            console.log("-------- resultadosValidaciones.mapped() -------------------")
            console.log(resultadosValidaciones.mapped());  


            return res.render('./productos/addProduct', {
                title: "Crear producto",
                errors: resultadosValidaciones.mapped(),
                // oldData son los datos recién cargados es decir el req.body
                oldData: req.body
            })
        }

        console.log("--Muy bien, no hay errores ---------------------------");

        let images= []
        files.forEach(image => {
			images.push(image.filename)
		});

		const newProduct = {
			...req.body,
			image: req.files.length >= 1  ? images : ["default-image.svg"]

		}
		productModel.create(newProduct)
		console.log('cree un nuevo producto')
		res.redirect('/products')
	},

    // Update - Form to edit

    edit: (req,res) =>{
        let productToEdit = productModel.findById(req.params.id)
        res.render("./productos/editProduct",
        {
            title: "Editar producto",
            productToEdit
        }
        )
    },

    // Update - Method to update

    update: (req, res) => {
		const files = req.files
        const id = req.params.id;

        const resultadosValidaciones = validationResult(req);
        console.log(resultadosValidaciones);
       
        // Con este if preguntamos si hay errores de validación
        if (!resultadosValidaciones.isEmpty()){
            console.log("----- ojo HAY ERRORES -----------------")
            
            // Si hay errores borramos los archivos que cargó multer
            files.forEach( file => {
                const filePath = path.join(__dirname, `../../public/images/products/${file.filename}`);
                fs.unlinkSync(filePath);
            })
            
            console.log("-------- my body -------------------")
            console.log(req.body);  

            const productToEdit = productModel.findById(id);

            return res.render('./productos/editProduct', {
                title: "Editar producto",
                productToEdit,
                errors: resultadosValidaciones.mapped(),
                // oldData son los datos recién cargados es decir el req.body
                oldData: req.body
            })
        }

		let productToEdit = productModel.findById(id);
		
        let images = [];
		
		
		// cambiamos ciclo for por forEach
		files.forEach(image => {
			images.push(image.filename)
		});

		productToEdit = {
			id: productToEdit.id,
			...req.body,
			// Si se suben imagenes se pone como valor el array imagenes y sino se queda el que ya estaba antes
			image: files.length >= 1  ? images : productToEdit.image
		}

		productModel.update(productToEdit)
		res.redirect("/");
	},


    // Update - Method to delete

    destroy: function(req,res){
        // Desestructuramos el id del req.params
        const { id } = req.params;

        // Desestructuramos la propiedad image del producto encontrado y lo renombramos
        const { image: imagenesBorrar} = productModel.findById(id);
        // Procedemos a iterar el array de imagenes con un forEach y borrarlas del FS
        imagenesBorrar.forEach( file => {
            const filePath = path.join(__dirname, `../../public/images/products/${file}`);
            fs.unlinkSync(filePath);
        });

        // Borramos el producto del archivo JSON
        productModel.delete(id);
        
        // Redirigimos al Home
        res.redirect("/");
    }

}

module.exports = productController