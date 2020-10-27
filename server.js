const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejsLint = require('ejs-lint');
const ShortUrl = require('./models/shortUrls');

mongoose.connect('mongodb+srv://dhiru:abcdef123456@cluster0.nvhht.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser:true,
    useUnifiedTopology:true
})
.then(() => console.log('Mongodb connected'))
.catch(err => console.log(err));

app.use( express.static( "views" ) );
app.use(express.urlencoded({extended:true}));

app.set('view engine', 'ejs')

app.get('/', async(req,res) => {
    try {
        const shortUrls = await ShortUrl.find();
         res.render('index', {shortUrls : shortUrls});
        
    } catch (error) {
        res.status(400).json({msg: error});
    }
    
})

app.post('/shortUrls',async (req,res) => {
    try {
        await ShortUrl.create({full : req.body.fullurl})
        res.status(200).json({msg: Done})
    } catch (error) {
        console.log(error)
    }
    res.redirect('/');
})

app.get('/:shortUrl',async(req,res) => {
    try {
        const shortUrl = await ShortUrl.findOne({short: req.params.shortUrl})
        if(shortUrl == null) return res.sendStatus(404);

        shortUrl.clicks++;
        shortUrl.save()

        res.redirect(shortUrl.full);
    } catch (error) {
        console.log(error);
    }
  
})
app.listen( process.env.Port || 5000);
