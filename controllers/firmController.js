const Firm = require("../models/Firm.js");
const Vendor = require("../models/Vendor.js");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, res, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const addFirm = async (req, res) => {
  try {
    const { firmName, area, category, region, offer } = req.body;
    const image = req.file ? req.file.filename : undefined;
    const vendor = await Vendor.findById(req.vendorId);
    if (!vendor) {
      res.status(404).json({ message: "vendor not found" });
    }

    const firm = new Firm({
      firmName,
      area,
      category,
      region,
      offer,
      image,
      vendor: vendor._id,
    });

    const savedFirm = await firm.save();
    vendor.firm.push(savedFirm);
    await vendor.save();

    return res.status(200).json({ message: "Firm Added successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json("Internal server error");
  }
};

const deleteFirmById = async (req,res) => {
  try{
    const firmId = req.params.firmId;

    const deletedFirm = await Firm.findByIdAndDelete(firmId);

    if(!deletedFirm){
      return res.status(404).json({error: "No firms found"});
    }
  }
  catch(err){
    console.log(err);
    res.status(500).json("Internal server error");
  }
}

module.exports = { addFirm: [upload.single("image"), addFirm],deleteFirmById };
