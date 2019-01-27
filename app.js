
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

// set route
app.get('/', (req, res)=>{
    res.send('<h1>please use api/books</h1>');
});

app.get('/api/books', (req, res, next)=>{
    db.books.find().sort({book_name:1}, (err, books)=>{
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

