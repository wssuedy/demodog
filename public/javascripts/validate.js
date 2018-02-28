function validate(loginname,password){

  let errors = "";
  if(!(loginname && loginname.length > 2 && loginname.length <10)){
    errors = errors || {};
    errors.name = "name length >2 and <10";
  }

  if(!(password && /\w{5,12}$/.test(password))){
    errors = errors || {};
    errors.pw = "你的密码格式有问题";
  }

  return errors;
}


if(typeof window === 'undefined'){
  module.exports = validate;//非window说明是nodejs环境
}
