const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController")

const multerMiddleware = require('../middleware/middlemulter');
const upload = multerMiddleware('products', 'Product');

const productCreateValidation = require('../middleware/productCreateValidation');
const productEditValidation = require('../middleware/productEditValidation');


router.get("/", productController.listadoProductos)

router.get("/create", productController.create)

router.post('/', upload.array("image"), productCreateValidation , productController.store);

router.get("/detalle/:id", productController.detail)

router.get("/productCart", productController.carrito)

router.get("/edit/:id", productController.edit)
router.put('/edit/:id', upload.array("image"), productEditValidation, productController.update); 

router.delete('/delete/:id', productController.destroy); 


module.exports = router