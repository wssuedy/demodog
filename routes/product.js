var express = require('express');
var router = express.Router();
const multer = require("multer");
const fs = require("fs");
const upload = multer({
  dest:"productPic",
  limits:{
    fileSize:1024*1024*15
  }
});

const arr = upload.array("myfiles",5);
const single = upload.single("myfile");

var models = require("./models");
var Picture = models.Picture;
var Product = models.Product;

/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.locals.user = req.session.user || "";
  res.locals.list = await Product.find() ||[];
  res.render('product');
});

router.get('/create',function(req, res, next) {
  res.locals.user = req.session.user || "";

  res.render('createProduct');
});

router.post("/xhrup",arr,function(req,res){
  console.log(req.files);

  res.send(req.files);

});

router.post('/create',arr,async function(req,res,next){
  const picture = await Picture.create(req.files);
  console.log(await Picture.find());
  // console.log("create product files**************");
  console.log(await req.files);

  var pic = [];
  for(var p of req.files){
    pic.push(p.filename);
  }
  // console.log("picture ***"+pic+"$$$$$$$$$$$$$$$$$$$$$");

  // console.log("create product picture**************");
  const {title,description,price} = req.body;
  console.log(req.body);

  const product = new Product({
    title,description,price,
    createTime:new Date(),
    updateTime:new Date(),
    picture:pic
  });

  console.log(await picture);

  await product.save();

  // console.log("*****"+await Product.find());
  res.redirect('/product');
});


router.get('/:id/read',async function(req, res, next) {
  res.locals.user = req.session.user || "";
  const id = req.params.id;
  console.log(id);

  res.locals.product = await Product.findById(id) || "";

  res.render('readProduct');
});



router.get("/img/:filename",function(req,res){
  //读取
  console.log("读取"+req.params);

  let rs = fs.createReadStream("productPic/"+req.params.filename);

  rs.pipe(res);
});



module.exports = router;
