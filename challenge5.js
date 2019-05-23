//Express routes for a CRUD API
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
var mongoose = require('mongoose');

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
  let albumData = {
    performer: req.body.performer,
    title: req.body.title,
    cost: req.body.cost
  };
  Album.create(albumData, (err, album) => {
    res.status(200).send({data: album});    
  }); 
});

// TODO: PUT /albums/:id
app.put('/albums/:id', (req, res) => {
  let update;
  let field;
  if(req.body.hasOwnProperty('performer')){
     Album.findOneAndUpdate({_id:req.params.id}, {$set: {performer:req.body.performer}}, {new: true})
      .then(album => {
      return res.status(200).send({data: album});
    }).catch(err => {
      res.end();
    });
  }else if(req.body.hasOwnProperty('title')){
     Album.findOneAndUpdate({_id:req.params.id}, {$set: {title: req.body.title}}, {new: true})
      .then(album => {
      return res.status(200).send({data: album});
    }).catch(err => {
      res.end();
    });
  }else if(req.body.hasOwnProperty('cost')){
     Album.findOneAndUpdate({_id:req.params.id}, {$set: {cost: parseFloat(req.body.cost)}}, {new: true})
      .then(album => {
      return res.status(200).send({data: album});
    }).catch(err => {
      res.end();
    });
  }else{
    return res.end();
  }
  
});

// TODO: DELETE /albums/:id
app.delete('/albums/:id', (req, res) => {
  Album.findOneAndRemove({_id: req.params.id})
  .then(album => {
    return res.status(204).end();
  });
});

// TODO: POST /purchases and populate data from User and Album models.
app.post('/purchases', (req, res) => {
  let purchaseData = {
    user: req.body.user,
    album: req.body.album
    };
 Purchase.create(purchaseData, (err, purchase) => {
   res.status(200); 
  }).then(p => {
   Purchase.findOne({_id: p._id})
   .populate({path:'user', model: User })
     .populate({path:'album', model: Album })
     .exec((err, populatedPurchase) => {
     if(err){
       res.end();
     }else{
       res.send({data: populatedPurchase})
     }
   });
 }); 
});