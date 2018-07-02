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
    .exec()
    .then(docs=>{
        console.log(docs);
        res.status(200).json(docs);
        // if(docs.length>=0){
        //     res.status(200).json(docs);
        // }else{
        //     res.status(404).json({
        //         message:'No entries found'
        //     });
        // }
    })
    .catch(err=>{
        res.status(500).json({error:err});
    });
});

router.get('/:productID',(req,res,next)=>{
    const productID = req.params.productID;
    Product.findById(productID).exec()
    .then(doc=>{
        console.log('From database: ' + doc);
        if(doc){
            res.status(200).json(doc);
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
            createdProduct : product
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
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:productID}, {$set: updateOps})
    .exec()
    .then(res=>{
        console.log(res);
        res.status(200).json(res);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
    res.status(200).json({
        message: "product is updated w ID: " + productID
    });
});
router.delete('/:productID',(req,res,next)=>{
    const id = req.params.productID;
    Product.findByIdAndRemove({_id: id})
    .exec()
    .then(result=>{
        res.status(200).json(result);
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});
module.exports = router;