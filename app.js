/* 

author : deen
date : 28/1/2009


*/
// required 
const express = require('express');
const path =  require('path');
const body_parser = require('body-parser');
const mongojs = require('mongojs');

// set express
const app = express();

// set port
const port = 4000;

// set db
const db = mongojs('bookstore', ['books']);

// set static folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(body_parser.json());

// allow requests from any framework
app.use((req, res, next) => {
    // website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');
    // request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    // request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // pass to next layer of middleware
    next();
});

// set route
app.get('/', (req, res)=>{
    res.send('please use api/books');
});

// get list of books
app.get('/api/books', (req, res, next)=>{
    db.books.find().sort({book_name:1}, (err, books)=>{
        if(err){
            res.send(err);
        }else{
            res.json(books);
        }
    });
});

// get one book
app.get('/api/books/:id', (req, res, next)=>{
    const id = req.params.id;
    db.books.find({_id: mongojs.ObjectId(id)}, (err, books)=>{
        if(err){
            res.send(err);
        }else{
            res.json(books);
        }
    });
});

// add books
app.post('/api/books', (req, res, next)=>{
    db.books.insert(req.body, (err, books)=>{
        if(err){
            res.send(err);
        } else{
            res.json(books);
        }
    })
});

// update books
app.put('/api/books/:id', (req, res, next)=>{
    const id = req.params.id;
    db.books.findAndModify({query: {_id: mongojs.ObjectId(id)},
    update: {
        $set: {
            ISBN: req.body.ISBN,
            title: req.body.title,
            genre: req.body.genre,
            released_year: req.body.released_year,
            author: req.body.author
        }
    },
    new: true
    }, (err, books)=>{
        if(err){
            res.send(err);
        }else{
            res.json(books);
        }
    });
});

// delete books
app.delete('/api/books/:id', (req, res, next)=>{
    const id = req.params.id;
    db.books.remove({_id: mongojs.ObjectId(id)}, (err, books)=>{
        if(err){
            res.send(err);
        }else{
            res.json(books);
        }
    });
});





// listen port
app.listen(port, ()=>{
    console.log(`server started on port ${port}`);
});

