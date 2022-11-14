var express = require("express"),
  routes = require("./routes"),
  path = require("path"),
  fileUpload = require("express-fileupload"),
  app = express(),
  mysql = require("mysql"),
  bodyParser = require("body-parser");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "se_testing",
});

const PORT = process.env.PORT || 3000;

connection.connect();

global.db = connection;

app.set("port", process.env.PORT || 3000);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "storage")));
// app.use(fileUpload());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// design file
app.use(express.static("public"));

const compressImages = require("compress-images");
const formidable = require("express-formidable");
app.use(formidable());

const fileSystem = require("fs");

app.get("/", function (request, res) {
  res.render("index");
});
app.post("/", function (request, res) {
	console.log(request);
  //   var mail_check = regex_checker_mail(email);
  //   var reg_check = regex_checker_reg(reg_no);
  //   if(mail_check===1 && reg_check===1){
  //      if (!req.files)
  // 			return res.status(400).send('No files were uploaded.');

  const image = request.files.image;
  if (image.size > 0) {
    fileSystem.readFile(image.path, function (error, data) {
      if (error) throw error;

      const filePath = "uploads/" + image.name;
      const compressedFilePath = "uploadscomp/" + image.name;
      console.log(filePath, compressedFilePath);
      const compression = 80;
      fileSystem.writeFile(filePath, data, async function (error) {
        if (error) throw error;

        compressImages(
          filePath,
          compressedFilePath,
          { compress_force: false, statistic: true, autoupdate: true },
          false,
          { jpg: { engine: "mozjpeg", command: ["-quality", compression] } },
          {
            png: {
              engine: "pngquant",
              command: ["--quality=" + compression + "-" + compression, "-o"],
            },
          },
          { svg: { engine: "svgo", command: "--multipass" } },
          {
            gif: {
              engine: "gifsicle",
              command: ["--colors", "64", "--use-col=web"],
            },
          },
          async function (error, completed, statistic) {
            message = "";
            var post = request.fields;
            var name = post.name;
            var mobile = post.mobile;
            var reg_no = post.reg_no;
            var email = post.email;
            var price = post.price;
            var category = post.category;
            var product_name = post.product_name;
            var time_used = post.time_used;
            console.log(name, mobile);
            var img_name = request.files.image.name;
            console.log("-------------");
            console.log(error);
            console.log(completed);
            console.log(statistic);
            console.log("-------------");
            var sql =
              "INSERT INTO `products`(`name`,`mobile`,`reg_no`,`mail`, `image` ,`price`,`product_name`,`category`,`time_used`) VALUES ('" +
              name +
              "','" +
              mobile +
              "','" +
              reg_no +
              "','" +
              email +
              "','" +
              img_name +
              "','" +
              price +
              "','" +
              product_name +
              "','" +
              category +
              "','" +
              time_used +
              "')";
           db.query(sql, function (err, result) {
              res.redirect("/buy");
              console.log(err);
            });
            fileSystem.unlink(filePath, function (error) {
              if (error) throw error;
            });
          }
        );
      });

      fileSystem.unlink(image.path, function (error) {
        if (error) throw error;
      });
    });
  }
});

// routers

app.get("/signin", routes.signin);
// app.get('/', routes.index);//call for main index page
// app.post('/', routes.index);//call for signup post
app.get("/buy/", routes.buy);
app.post("/carti/", routes.carti);
app.post("/success/", routes.success);
app.post("/payment/", routes.payment);
app.get("/try_again", routes.try_again);
app.get("/user_req", routes.user_req);
app.post("/user_wish", routes.user_wish);

app.listen(3000);
