const Product = require("../models/Product.js");
const multer = require("multer");
const Firm = require("../models/Firm.js");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const addProduct = async (req, res) => {
  try {
    const { productName, price, category, bestSeller, description } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);

    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const product = new Product({
      productName,
      price,
      category,
      bestSeller,
      description,
      image,
      firm: firm._id,
    });

    const savedProduct = await product.save();

    firm.product.push(savedProduct);
    await firm.save();

    return res.status(200).json(savedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error from product controller");
  }
};

const getProductByFirm = async (req, res) => {
  try {
    const firmId = req.params.firmId;
    const firm = await Firm.findById(firmId);
    if (!firm) {
      return res.status(404).json({ error: "No firm found" });
    }

    const firmName = firm.firmName;
    const products = await Product.find({ firm: firmId });
    res.status(200).json({ firmName,products });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

const deleteProductById = async (req,res) => {
  try{
    const productId = req.params.productId;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if(!deletedProduct){
      return res.status(404).json({error: "No product found"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json("Internal server error");
  }
}

module.exports = {
  addProduct: [upload.single("image"), addProduct],
  getProductByFirm,deleteProductById
};