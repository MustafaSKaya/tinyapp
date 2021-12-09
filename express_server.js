const express = require("express");
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { request, response } = require("express");
const { generateRandomString } = require('./helper');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const usersDatabase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

const getUserByEmail = (email, userDb) => {
  for (let user in userDb) {
      if (usersDatabase[user].email === email) {
          return user;
      } 
  }
  return false;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { user: usersDatabase[req.cookies['user_id']], urls: urlDatabase };
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
  const templateVars = { user: usersDatabase[req.cookies['user_id']], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_new", templateVars);
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { user: usersDatabase[req.cookies['user_id']], shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  let longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/login", (request, response) => {
  const templateVars = { user: usersDatabase[request.cookies['user_id']], shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL] };
  response.render('urls_login', templateVars);
});

app.post("/login", (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const user = getUserByEmail(email, usersDatabase);
  console.log(user);
  if (user && usersDatabase[user].password === password) {
    response.cookie('user_id', usersDatabase[user].id);
    response.redirect('/urls');
    return;
  };
  response.status(401).send('wrong credentials');
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/urls');
});

app.get('/register', (request, response) => {
  const templateVars = { user: usersDatabase[request.cookies['user_id']], shortURL: request.params.shortURL, longURL: urlDatabase[request.params.shortURL] };
  response.render('urls_registration', templateVars);
});

app.post('/register', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const userID = generateRandomString(8);

  if (!email || !password) {
    return response.status(403).send('Incomplete registration request!');
  };

  const user = getUserByEmail(email, usersDatabase);
  console.log(user);
  if (user) {
    return response.status(403).send('User is already exist in database.');
  };
  
  const newUser = {
    id: userID,
    email,
    password
  };
  usersDatabase[userID] = newUser;
  response.cookie('user_id', userID);
  response.redirect('/urls');
  console.log(usersDatabase);
})

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b><br>lol</body></html>");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});