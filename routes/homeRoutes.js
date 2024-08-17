const express=require('express');
const router=express.Router();
const axios=require('axios');
const Blog=require('../src/models/blog');
router.get('/',async (req,res)=>{
   try{
   const response=await axios.get('http://localhost:5000/api/blogs',{
    params:req.query
   });
   const blogs=response.data;
   res.render('home',{blogs});
   } catch (error){
    console.log(error);
    res.status(500).json({
        message:error.message
    });
   }
});

module.exports=router;
