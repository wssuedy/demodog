var express = require('express');
var router = express.Router();
var PW = require("png-word");
var pw = new PW();
var R = require("random-word");

var models = require("./models");
var Users = models.Users;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.locals.user = req.session.user;
  res.locals.vimg = req.session.vimg;
  console.log("config-vimg"+res.locals.vimg);

  res.render('config');
});


router.post('/updatepw',async function(req,res,next){
  const {loginname,password,newpassword,confirm,vimg}= req.body;
  console.log(loginname);

  const query = await Users.find().where("loginname").eq(loginname);

  console.log("update********"+query);
  console.log(typeof query);
  console.log("query[0]"+query[0]);
  console.log(query[0].password +"  password  "+password +"    newpass: "+newpassword + '/n'+
  "  confirm:  "+confirm +"  vimg  " +vimg +"  req  "+req.session.vimg);
  if(await query && await query[0].password == password && newpassword && newpassword === confirm &&
  vimg && vimg == req.session.vimg){
      // 修改密码增加
      console.log("修改密码");
      query[0].password = newpassword;
      await query.save();
      console.log(await User.find());
      console.log(req.session.user);
      console.log("修改密码成功");
      res.send("");
  }else if(query[0].password != password){
    let errors = {};
    errors.password = "原有密码输入不正确";
    console.log("原有密码输入不正确");
    res.send(errors);
  }else if (vimg != req.session.vimg) {
    let errors = {};
    errors.vimg = "验证码不正确";
    res.send(errors);
  }else{
    console.log(await query);
    console.log("query[0].password"+query[0].password);
    res.send("");
  }

})


router.get("/vimg",function(req,res){

  var r = new R("123456789");
  req.session.vimg = r.random(3);
  pw.createReadStream(req.session.vimg).pipe(res);

  // pw.on("parsed",function(){
  //   this.createReadStream("11132221").pipe(res);
  // })
})

module.exports = router;
