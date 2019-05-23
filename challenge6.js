// Authenticaltion using a custom token for a CRUD API
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var mongoose = require('mongoose');
let token; 
let blacklistTokens = [];
let authorized;


const userSchema = mongoose.Schema({
  name: String,
  email: String,
  password: String
})
const User = mongoose.model('User', userSchema)

const albumSchema = mongoose.Schema({
  performer: String,
  title: String,
  cost: Number,
})
const Album = mongoose.model('Album', albumSchema);

const puchaseSchema = mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album' }
})
const Purchase = mongoose.model('Purchase', puchaseSchema);


app.use(bodyParser.json());
app.listen(3000);

// TODO: GET /albums
app.get('/albums', (req, res) => {
  Album.find()
  .then((albums) =>{
    res.status(200).send({data: albums});
  })
  
});

// TODO: GET /albums/:id
app.get('/albums/:id', (req, res) => {
  Album.findById(req.params.id)
  .then(album => {
    res.status(200).send({data:album});
  });
  
});

// TODO: POST /albums
app.post('/albums', (req, res) => { 
  authorized = req.headers['authorization'];
  if(authorized && (blacklistTokens.includes(authorized) ===false) ){
    let albumData = {
      performer: req.body.performer,
      title: req.body.title,
      cost: req.body.cost
      };
      //use schema.create to insert data into the db
      Album.create(albumData, (err, album) => {
        res.status(200).send({data: album});    
    }); 
  }else{
    res.status(401).end();
  }
});

// TODO: PUT /albums/:id
app.put('/albums/:id', (req, res) => {

  authorized = req.headers['authorization'];
  if(authorized && (blacklistTokens.includes(authorized) ===false) ){
    if(req.body.hasOwnProperty('performer')){
       Album.findOneAndUpdate({_id:req.params.id}, {$set: {performer:req.body.performer}}, {new: true})
        .then(album => {
        return res.status(200).send({data: album});
      }).catch(err => {
        console.log(err);
      });
    }else if(req.body.hasOwnProperty('title')){
       Album.findOneAndUpdate({_id:req.params.id}, {$set: {title: req.body.title}}, {new: true})
        .then(album => {
        return res.status(200).send({data: album});
      }).catch(err => {
        console.log(err);
      });
    }else if(req.body.hasOwnProperty('cost')){
       Album.findOneAndUpdate({_id:req.params.id}, {$set: {cost: parseFloat(req.body.cost)}}, {new: true})
        .then(album => {
        return res.status(200).send({data: album});
      }).catch(err => {
        console.log(err);
      });
    }else{
      return res.end();
    }
  }else{
    return res.status(401).end();
  }
  
});

// TODO: DELETE /albums/:id
app.delete('/albums/:id', (req, res) => {
  authorized = req.headers['authorization'];
  if(authorized){
    Album.findOneAndRemove({_id: req.params.id})
    .then(album => {
      return res.status(204).end();
    });
  }else{
    return res.status(401).end();
  }
});

// TODO: POST /purchases
app.post('/purchases', (req, res) => {
  let purchaseData = {
    user: req.body.user,
    album: req.body.album
    };
  Purchase.create(purchaseData, (err, purchase) => {
    User.findById(purchase.user)
    .then(user => {
      purchase.user = user;
    });
   Album.findById(purchase.id)
   .then( album => {
     purchase.album = album;
   });
    return res.status(200).send({data: purchase})
  });
  
});

// TODO: POST /signup
app.post('/signup', (req, res) => {
  if (req.body.name &&
    req.body.email &&
    req.body.password ){
      const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    }
    //use schema.create to insert data into the db
    User.create(userData, function (err, user) {
      if (err) {
        return next(err)
      } else {
        token = 'thetoken'+ user._id + Math.random() * 1000;
        res.status(204).setHeader("authorization", token);
        res.send({data: user});
      }
    });
  }
});

// TODO: POST /logout
app.post('/logout',(req, res) => { 
  const usedToken = req.headers['authorization'];
  blacklistTokens.push(usedToken);
  res.status(204)
  res.removeHeader("authorization");
  delete req.headers['authorization'];
  res.end();
});

// TODO: POST /login
app.post('/login', (req, res) => {
  if (req.body.email && req.body.password ){
    User.findOne({email: req.body.email })
      .then(user => {
       if(!user){
         res.status(404).send('User Not Found');
       }else{
        if(req.body.password === user.password){
          token = 'thetoken'+ user._id + Math.random() * 1000;
          res.status(204).setHeader("authorization", token);
          res.send(user);
        }
      }
    });
      
    }
});