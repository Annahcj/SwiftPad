const express = require('express');
const app = express();

const Document = require('./models/Document');

const mongoose = require('mongoose');

const mongoURI = require('./config/keys.js').mongoURI;
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log(err));

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    const code = `Welcome to SwiftPad! 

Write some code, text, or anything you feel like!
Navigate using the buttons in the top right corner`;

    res.render('code-display', { code, language: 'plaintext', display: true });
});

app.get('/new', (req, res) => {
    res.render('new', { newPage: true });
})

app.post('/save', async (req, res) => {
    const value = req.body.value;
    try {
        const document = await Document.create({ value, views: 0 });
        res.redirect(`/${document.id}`);
    } catch(err) {
        res.render('new', { value, newPage: true });
    }
})

app.get("/:id/duplicate", async (req, res) => {
    const id = req.params.id;
    try {
      const document = await Document.findById(id);
      res.render('new', { value: document.value, newPage: true });
    } catch (e) {
      res.redirect(`/${id}`);
    }
})
  
app.get("/:id", async (req, res) => {
    const id = req.params.id;
    try {
      const document = await Document.findById(id);
      res.render("code-display", { code: document.value, id, timestamp: document.createdAt, views: document.views, display: true });
      document.views++;
      document.save();
    } catch (e) {
      res.redirect("/");
    }
})

app.listen(7000);