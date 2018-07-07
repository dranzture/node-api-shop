const Product = require('../models/product')
const mongoose = require('mongoose');

exports.get_all_products = (req, res, next) => {
    Product.find()
        .select('name price _id productImage')
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                products: docs.map(doc => {
                    return {
                        name: doc.name,
                        price: doc.price,
                        _id: doc._id,
                        productImage: 'http://localhost:3000/' + doc.productImage.replace('\\', '/'),
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/products/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(response);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

exports.get_products_by_id = (req, res, next) => {
    const productID = req.params.productID;
    Product.findById(productID)
        .select('name price _id productImage')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    product: doc,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/products/' + doc._id
                    }
                });
            } else {
                res.status(404).json({ message: 'No product w given ID!' });
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });

}

exports.create_product = (req, res, next) => {
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
        productImage: req.file.path
    });

    product.save()
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: "product is created!",
                createdProduct: {
                    name: result.name,
                    price: result.price,
                    _id: result._id,
                    filename: req.file,
                    request: {
                        type: 'POST',
                        url: 'http://localhost:3000/products/' + result.id
                    }
                }
            });
        }).catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.product_update = (req, res, next) => {
    const productID = req.params.productID;
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.updateName] = ops.updateValue;
    }
    Product.update({ _id: productID }, { $set: updateOps })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product updated',
                request: {
                    type: 'PATCH',
                    description: 'Here i learnt the stuff again',
                    url: 'http://localhost:3000/products/' + productID
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}

exports.delete_product = (req, res, next) => {
    const id = req.params.productID;
    Product.findByIdAndRemove({ _id: id })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Product deleted',
                req: {
                    really: 'something really dont matter that much'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
}