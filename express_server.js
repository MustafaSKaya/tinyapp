const express = require("express");
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

function generateRandomString(num) {
  let result = '';
  let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < num; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
    characters.length));
  }
  return result;
}

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { username: req.cookies['username'], urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  const newShortURL = generateRandomString(6);
  urlDatabase[newShortURL] = req.body.longURL;
  res.redirect(`/urls/${newShortURL}`);
  console.log(urlDatabase);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const urlToDelete = req.params.shortURL;
  delete urlDatabase[urlToDelete];
  res.redirect(`/urls`);
});

app.post("/urls/:id", (req, res) => {
  const id = req.params.id;
  const urlToEdit = req.body.longURL;
  urlDatabase[id] = urlToEdit;
  res.redirect(`/urls`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { username: req.cookies['username'], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.post("/login", (request, response) => {
  response.cookie('username', request.body.username);
  response.redirect('/urls');
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b><br>lol</body></html>");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});