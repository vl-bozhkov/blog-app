//basic config
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//connect to database
var uri = 'mongodb://vl_bozhkov:12345678@ds151702.mlab.com:51702/main_database';
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

app.get('/blogs', function(req, res) {
  Blog.find({}, function(e, blogs) {
    if (e) {
      console.log(e);
    } else {
      res.render('index', { blogs: blogs });
    }
  });
});
//set up server to run at port 3000
app.listen(3002, function() {
  console.log('server listen on port 30000');
});