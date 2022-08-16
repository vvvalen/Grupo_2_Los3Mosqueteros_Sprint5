const universalModel = require('../model/universalModel');
const productModel = universalModel('products');

const mainController = {
    home: (req,res) =>{
        const allProductos = productModel.findAll()
        const saleProducts = allProductos.filter( product => product.discount != 0 );
        res.render("productos/home",
        {
            title:"Home",
            saleProducts
        }
        )
    },

}

module.exports = mainController