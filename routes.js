
function regex_checker_mail(email){
   let regex = new RegExp('^[a-zA-Z0-9._%+-]+@vitstudent+.\ac+.\in$');
   console.log(regex.test(email));
   if(regex.test(email)){
         return 1;
   }
   else{
      return 0;
   }
   
}

function regex_checker_reg(reg){
   let regex = new RegExp('^[0-9]{2}[A-Z]{3}[0-9]{4}');
   if(regex.test(reg)){
         return 1;
   }
   else{
      return 0;
   }
}

exports.index = function(req, res){
    message = '';
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.name;
      var mobile= post.mobile;
      var reg_no= post.reg_no;
      var email= post.email;
      var price= post.price;
      var category = post.category;
      var product_name= post.product_name;
      var time_used= post.time_used;
      var mail_check = regex_checker_mail(email);
      var reg_check = regex_checker_reg(reg_no);
      if(mail_check===1 && reg_check===1){
         if (!req.files)
				return res.status(400).send('No files were uploaded.');
 
		var file = req.files.image;
		var img_name=file.name;
	  	 if(file.mimetype == "image/jpeg" ||file.mimetype == "image/png"||file.mimetype == "image/gif" ){
                                 
              file.mv('storage/images/uploaded_images/'+file.name, function(err) {
                             
	              if (err)
 
	                return res.status(500).send(err);
      					var sql = "INSERT INTO `products`(`name`,`mobile`,`reg_no`,`mail`, `image` ,`price`,`product_name`,`category`,`time_used`) VALUES ('" + name + "','" + mobile + "','" + reg_no + "','" + email + "','" + img_name + "','" + price + "','" + product_name + "','" + category + "','" + time_used + "')";
 
    						var query = db.query(sql, function(err, result) {
    							 res.redirect('/buy');
    						});
					   });
          } else {
            message = "This format is not allowed , please upload file with '.png','.gif','.jpg'";
            res.render('index.ejs',{message: message});
          }
   } else {
      // if(!regex_checker_mail(email) && regex_checker_reg(reg_no))
      // {
      //    res.redirect('/incorrect');
      // }
      // if(!regex_checker_mail(reg_no) && regex_checker_mail(email))
      // {
      //    res.redirect('/incorrect');
      // }
      // else{
      //    res.redirect('/incorrect');
      // }
      res.redirect('/try_again');
      
   }
      }
      else{
         res.render('index');
      }
};


exports.buy = function(req, res){
	var message = '';
	var id = req.params.id;
    var sql="SELECT * FROM `products`";
    db.query(sql, function(err, result){
	  if(result.length <= 0)
	  message = "data not found!";
	  
      res.render('buy.ejs',{data:result, message:  message,sendobj :res,id:id});
   });
};


exports.try_again = function(req,res){
   res.render('try_again');
}

exports.carti = function(req, res){
   if(req.method == "POST"){
      var post  = req.body;
      var name= post.name; 
      var product= post.product_name;
      var price= post.price;
      var image = post.image;
      var id = post.id;
      var category = post.category;
      var time_used = post.time_used;
      res.render('cart.ejs',{name: name, product: product, price: price,image:image,id:id,category:category,time_used:time_used});
   }
}
 
exports.success = function(req, res){
   var sql="DELETE FROM `products` WHERE id='"+req.body.id+"'";
   db.query(sql, function(err, result){
      console.log(result);
      res.render('success.ejs');
   });
}

exports.payment = function(req, res){
      res.render('payment.ejs',{id: req.body.id,product: req.body.product,price: req.body.price,image: req.body.image,seller:req.body.name});
   }


exports.signin = function(req, res){
   res.render('signin.ejs');
}

exports.user_req = function(req, res){

   res.render('user_req.ejs');
}

exports.user_wish = function(req, res){
   var post = req.body;
   var category = post.category_drop;
   console.log(category);

   var sql="SELECT * FROM `products`";
    db.query(sql, function(err, result){
	  if(result.length <= 0)
	  message = "data not found!";
	  
     res.render('user_wish.ejs',{data:result,category:category});
   });
   
}

