//basic config
require('dotenv').config();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var expressSanitizer = require('express-sanitizer');
var port = process.env.PORT || 3000;

//connect to database
var uri = process.env.DATABASE_URI;

mongoose.connect(
  uri,
  { useNewUrlParser: true }
);
// set template engine
app.set('view engine', 'ejs');
//set up public directory
app.use(express.static('public'));
// set up body parser
app.use(bodyParser.urlencoded({ extended: true }));
//express sanitizer setup
app.use(expressSanitizer());
//method-override
app.use(methodOverride('_method'));

//mongoose schema config
var blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: { type: Date, default: Date.now }
});
var Blog = mongoose.model('Blog', blogSchema);

//RESTFULL ROUTES
app.get('/', function(req, res) {
  res.redirect('/blogs');
});
//INDEX ROUTE
app.get('/blogs', function(req, res) {
  Blog.find({}, function(e, blogs) {
    if (e) {
      console.log(e);
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});
//NEW ROUTE
app.get('/blogs/new', function(req, res) {
  res.render('new');
});

//CREATE ROUTE
app.post('/blogs', function(req, res) {
  //sanitize so user cannot income harmful information like script tags
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(e, newBlog) {
    if (e) {
      res.render('new');
    } else {
      res.redirect('/');
    }
  });
});
//SHOW ROUTE
app.get('/blogs/:id', function(req, res) {
  Blog.findById(req.params.id, function(e, foundBlog) {
    if (e) {
      console.log(e);
    } else {
      res.render('show', { blog: foundBlog });
    }
  });
});
//EDIT ROUTE
app.get('/blogs/:id/edit', function(req, res) {
  Blog.findById(req.params.id, function(e, foundBlog) {
    if (e) {
      res.redirect('/blogs');
    } else {
      res.render('edit', { blog: foundBlog });
    }
  });
});
//UPDATE ROUTE
app.put('/blogs/:id', function(req, res) {
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(
    e,
    updatedBlog
  ) {
    if (e) {
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs/' + req.params.id);
    }
  });
});
//DELETE ROUTE
app.delete('/blogs/:id', function(req, res) {
  Blog.findByIdAndRemove(req.params.id, function(e) {
    if (e) {
      res.redirect('/');
    } else {
      res.redirect('/');
    }
  });
});

//set up server to run at port 3000
app.listen(port, function() {
  console.log('server listen on port = ', port);
});
