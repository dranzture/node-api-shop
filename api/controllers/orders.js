const Order = require('../models/order');
const Product = require('../models/product')
const mongoose = require('mongoose');

exports.orders_get_all = (req, res, next) => {
    Order.find()
        .select('_id product quantity')
        .populate('product', 'name price')
        .exec()
        .then(docs => {
            const result = {
                count: docs.length,
                orders: docs.map(doc => {
                    return {
                        _id: doc._id,
                        product: doc.product,
                        quantity: doc.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + doc._id
                        }
                    }
                })
            }
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
}

exports.orders_get_by_id = (req, res, next) => {
    const orderID = req.params.ID;
    Order.findById(orderID)
        .select('_id product quantity')
        .populate('product', 'name price')
        .exec()
        .then(doc => {
            if (doc) {
                res.status(200).json({
                    orderID: doc._id,
                    productID: doc.product,
                    quantity: doc.quantity,
                    request: {
                        type: 'GET',
                        url: 'http://localhost:3000/orders/' + doc._id
                    }
                })
            }
            else {
                res.status(404).json({ message: 'No order w given ID!' });
            }
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
}

exports.create_order = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "product not found"
                })
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productID
            });
            return order.save()
        })
        .then(result => {
            console.log(result);
            res.status(201).json(result);
        })
        .catch(err => {
            res.status(500).json({
                message: 'product not found',
                error: err
            });
        })
}

exports.patch_order = (req, res, next) => {
    const orderID = req.params.orderId;
    const quantity = req.body.quantity;

    Order.where({ _id: orderID }).update({ $set: { quantity: quantity } })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order updated',
                request: {
                    type: 'PATCH',
                    description: 'Here i learnt the stuff again',
                    url: 'http://localhost:3000/orders/' + productID
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}

exports.delete_order = (req, res, next) => {
    const id = req.params.orderId;
    Order.findByIdAndRemove(id)
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                req: {
                    really: 'something really dont matter that much'
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        })
}