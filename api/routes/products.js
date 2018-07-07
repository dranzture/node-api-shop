const express = require('express');
const router = express();
const checkAuth = require('../middleware/check-auth');
const multer = require('multer');

const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({ storage: storage, fileFilter: fileFilter });


router.get('/', ProductsController.get_all_products);

router.get('/:productID', ProductsController.get_products_by_id);

router.post('/', checkAuth, upload.single('productImage'), ProductsController.create_product);


router.patch('/:productID', checkAuth, ProductsController.product_update);

router.delete('/:productID', checkAuth, ProductsController.delete_product);

module.exports = router;