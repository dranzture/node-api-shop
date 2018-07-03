const express = require('express');
const router = express();
const mongoose = require('mongoose');
const Product = require('../models/product');

// router.use('/',(req,res,next)=>{
//     res.status(200).json({
//         message:"on the product page.."
//     });
// });

router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id')
    .exec()
    .then(docs=>{
        const response ={
            count: docs.length,
            products: docs.map(doc => {
                return{
                    name: doc.name,
                    price: doc.price,
                    _id: doc._id,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/products/' + doc._id
                    }
                }
            })
        }
        // if(doc){
            res.status(200).json(response);
        // }else{
        //     res.status(404).json({message: 'No product w given ID!'});
        // }
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
});

router.get('/:productID',(req,res,next)=>{
    const productID = req.params.productID;
    Product.findById(productID)
    .select('name price _id')
    .exec()
    .then(doc=>{
        if(doc){
            res.status(200).json({
                product: doc,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+doc._id
                }
            });
        }else{
            res.status(404).json({message: 'No product w given ID!'});
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    });
    
});

router.post('/',(req,res,next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
    .then(result=>{
        console.log(result);
        res.status(201).json({
            message: "product is created!",
            createdProduct : {
                name: result.name,
                price: result.price,
                _id: result._id,
                request:{
                    type:'POST',
                    url:'http://localhost:3000/products/' + result.id
                }
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});

    });


});
router.patch('/:productID',(req,res,next)=>{
    const productID = req.params.productID;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.updateName] = ops.updateValue;
    }
    Product.update({_id:productID}, {$set: updateOps})
    .exec()
    .then(result=>{
        res.status(200).json({
            message: 'Product updated',
            request:{
                type:'PATCH',
                url:'http://localhost:3000/products/'+ productID
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});
router.delete('/:productID',(req,res,next)=>{
    const id = req.params.productID;
    Product.findByIdAndRemove({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'Product deleted',
            ashley: "Loves polat",
            req:{
                really: 'something really dont matter that much'
            }
        });
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});
module.exports = router;