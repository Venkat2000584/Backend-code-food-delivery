const Vendor = require("../models/Vendor.js");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const dotEnv = require('dotenv')
dotEnv.config()

const secretkey = process.env.WhatIsYourName

const vendorRegister = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const vendorEmail = await Vendor.findOne({ email });
    if (vendorEmail) {
      return res.status(400).json("Email already taken");
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const newVendor = Vendor({
      username,
      email,
      password: hashedPass,
    });
    await newVendor.save();
    res.status(201).json({ message: "Vendor Registered Successfully"});
    console.log("Registered");
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error " });
  }
};

const vendorLogin = async (req,res) => {
    const {email,password} = req.body;
    try{
        const vendor = await Vendor.findOne({email})
        if(!vendor || !(bcrypt.compare(password,vendor.password))){
            return res.status(401).json({error:"Invalid username or password"})
        }
        const token = jwt.sign({vendorId: vendor._id},secretkey,{expiresIn: "1h"})

        res.status(200).json({success: "Login successfull", token})
        console.log("email:",email, "|| password:",password);
        console.log("this is a token:",token);
        
        
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal server error " });
    }
}

const getAllVendors = async (req,res) => {
    try{
        const vendors = await Vendor.find().populate('firm')
        res.json({vendors})
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal server error " });
    }
}

const getVendorById = async (req,res) => {
    const vendorId = req.params.id;
    try{
        const vendor = await Vendor.findById(vendorId).populate('firm');
        if(!vendor){
            return res.status(404).json({error: "Vendor not found"});
        }
        res.status(200).json({vendor});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ error: "Internal server error " });        
    }
}

module.exports = { vendorRegister,vendorLogin,getAllVendors,getVendorById };