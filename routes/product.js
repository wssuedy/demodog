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

const pageper = 6;//每页显示数

/* GET users listing. */
router.get('/', async function(req, res, next) {
  res.locals.user = req.session.user || "";
  res.locals.list = await Product.find().limit(pageper)||[];
  res.locals.count = await Product.find().count();
  res.locals.pageper = pageper;
  res.locals.currpage = 1;
  res.render('product');
});

/* 日期排序. */
router.get('/dateold/:i', async function(req, res, next) {
  console.log("排序");
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  const currpage = req.params.i;
  const startnum = currpage*pageper-pageper;
  res.locals.list = await Product.find().skip(startnum).limit(pageper).sort('-createTime');
  res.locals.pageper = pageper;
  res.locals.currpage = currpage;
  res.locals.count = await Product.find().count();
  res.render('product');
});

/* 日期排序.*/
router.get('/datenew/:i', async function(req, res, next) {
  console.log("排序new");
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  const currpage = req.params.i;
  const startnum = currpage*pageper-pageper;
  res.locals.list = await Product.find().skip(startnum).limit(pageper).sort('createTime');
  res.locals.pageper = pageper;
  res.locals.currpage = currpage;
  res.locals.count = await Product.find().count();
  res.render('product');
});

router.get('/page/:i', async function(req, res, next) {
  console.log("page");
  const newcurrpage = req.params.i;
  const startnum = newcurrpage*pageper-pageper;
  res.locals.user = req.session.user || "";
  res.locals.list = await Product.find().skip(startnum).limit(pageper)||[];
  res.locals.count = await Product.find().count();
  res.locals.pageper = pageper;
  res.locals.currpage = newcurrpage;
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

router.get('/:id/update',async function(req, res, next) {
  res.locals.user = req.session.user || "";
  const id = req.params.id;
  console.log(id);

  res.locals.product = await Product.findById(id) || "";

  res.render('updateProduct');
});



router.get("/img/:filename",function(req,res){
  //读取
  console.log("读取"+req.params);

  let rs = fs.createReadStream("productPic/"+req.params.filename);

  rs.pipe(res);
});



module.exports = router;
