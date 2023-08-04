var express = require('express');
var app = express();
var expresshbs= require('express-handlebars');
var Product= require("./model/product");
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer =require('multer');
var fs=require('fs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://phuoclhph21930:namthanh@cluster0.xjibhgp.mongodb.net/sinhvienns',{
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.engine('.hbs', expresshbs.engine({extname:'.hbs'}));
app.set('view engine', '.hbs');

app.get('/danhsach', async(req,res)=>{
  try{const data = await Product.find({}).lean();

  res.render('home',{
    layout:'list',
    data: data
  });
  }catch(e){console.log('loi');
  res.status(500).json({e:'loi lay du lieu'});
}
});
app.post('/addproduct', async (req, res) => {
  let masp = req.body.masp;
  let tensp = req.body.tensp;
  let loaisp = req.body.loaisp;
  let price = req.body.price;
  let color = req.body.color;

  
  let addProduct = new Product({
      masp: masp,
      tensp: tensp,
      loaisp: loaisp,
      price: price,
      image: "",
      color: color,
  })

  addProduct.save();
  let listproduct= Product.find().lean();

  res.redirect('/danhsach');
});
app.get('/addproduct/delete/:id', async (req, res)=>{
  try {
    const product=await Product.findByIdAndDelete(req.params.id);
    
    if(!product){
      res.status(404).send("Không tìm thấy sản phẩm");
      res.status(200).send();
    }else{
      res.redirect('/danhsach');
    }
  } catch (error) {
    res.status(500).send(error);
  }
  });
  app.post('/updateproduct/update/:id', async (req, res) => {
    const productId = req.params.id;
    const { masp, tensp, loaisp, price, image, color } = req.body;
    // Thực hiện lưu dữ liệu vào MongoDB
    try {
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { masp, tensp, loaisp, price, image, color },
        { new: true }
      );
      console.log('Dữ liệu đã được cập nhật:', updatedProduct);
      res.redirect('/danhsach'); 
    } catch (error) {
      console.error('Lỗi khi cập nhật dữ liệu:', error);
     
    }
  });
  app.get('/updateproduct/:id', async(req, res)=>{
    const product=await Product.findById(req.params.id).lean();
    res.render('home',{
      layout:'update',
      data:product
    });
});
app.get('/addproduct',function(req, res){
  res.render('home',{
    layout:'add'
  });
});

app.listen(8000, function(){
  console.log("Server is running on port 8000");
});