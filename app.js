const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');

var app = express();

app.set('view engine','ejs')
app.use( bodyParser.json() );
app.use(bodyParser.urlencoded(
  {extended:true}
));

app.use(express.static('public'))



mongoose.connect('mongodb://localhost:27017/wikiDB', { useNewUrlParser: true });

const articleSchema = mongoose.Schema({
  title:String,
  content:String
});

const Article = mongoose.model('article', articleSchema);

// requests targetting all articles

app.route('/articles')

.get(function(req,res){
  Article.find({},function(err,foundArticles){
    if(!err)
    {res.send(foundArticles);}else{
      res.send(err)
    }
  })
})

.post(function(req,res){
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  })

  newArticle.save(function(err){
    if(!err){
      res.send('Successfully created a new article')}else{
        res.send(err);
      }

  });
})

.delete(function(req,res){
  Article.deleteMany({},function(err){
    res.send('deleted')
  })
});

// requests targetting an individual article

app.route('/articles/:articleTitle')

.get(function(req,res){
Article.findOne({title:req.params.articleTitle}, function(err, foundArticle){
  if(foundArticle){
    res.send(foundArticle);
  }else{
    res.send('No articles matching that title was found')
  }
})
})

.put(function(req,res){
  Article.update({title:req.params.articleTitle}, {title:req.body.title, content:req.body.content}, function(err){})
});

app.listen(3000, function(){
  console.log('you are now connected to the server');
});
