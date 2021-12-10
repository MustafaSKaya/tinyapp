const express = require("express");
const app = express();
const PORT = 3000; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const { request, response } = require("express");
const { generateRandomString, getUserByEmail } = require('./helper');
const bcrypt = require('bcryptjs');

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW"
  }
};

const usersDatabase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: bcrypt.hashSync("purple-monkey-dinosaur")
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: bcrypt.hashSync("dishwasher-funk")
  }
};

const urlsForUser = (id) => {
  let result = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      result[url] = urlDatabase[url];
    }
  }
  return result;
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls", (req, res) => {
  const templateVars = { user: usersDatabase[req.cookies['user_id']], urls: urlsForUser(req.cookies.user_id) };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  if (!req.cookies.user_id) {
    res.status(403).send("Not today you cur");
  } else {
    const newShortURL = generateRandomString(6);
    urlDatabase[newShortURL] = {
      longURL: req.body.longURL,
      userID: req.cookies.user_id
    };
    res.redirect(`/urls/${newShortURL}`);
    console.log(urlDatabase);
  }
});

app.post("/urls/:id", (req, res) => {
  if (urlDatabase[req.params.id].userID === req.cookies.user_id) {
    urlDatabase[req.params.id].longURL = req.body.longURL;
    res.redirect(`/urls/${req.params.id}`);
  } else {
    res.status(403).send("Not authorized");
  };
  console.log(urlDatabase)
});

app.get("/urls/new", (req, res) => {
  const templateVars = { 
    user: usersDatabase[req.cookies.user_id]
  };
  if (!templateVars.user) {
    res.redirect("/login");
  } else {
    res.render("urls_new", templateVars);
  }
})

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { 
    user: usersDatabase[req.cookies['user_id']], 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL].longURL
  };

  if (!usersDatabase[req.cookies['user_id']]) {
    return res.redirect('/login', 403)
  };
  if (req.cookies.user_id !== urlDatabase[req.params.shortURL].userID) {
    return res.redirect("/urls", 403);
  };

  res.render("urls_show", templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  if (urlDatabase[req.params.shortURL].userID === req.cookies.user_id) {
    delete urlDatabase[req.params.shortURL];
  } else {
    return res.status(403).send("Not authorized");
  };
  res.redirect("/urls");
});

app.get("/u/:shortURL", (request, response) => {
  const url = urlDatabase[request.params.shortURL];
  if (!url) {
    response.status(404).send("Link not found");
  }
  response.redirect(url.longURL);
});

app.get("/login", (request, response) => {
  const templateVars = { user: usersDatabase[request.cookies['user_id']] };
  response.render('urls_login', templateVars);
});

app.post("/login", (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const user = getUserByEmail(email, usersDatabase);
  console.log(user)

  if (!email || !password) {
    response.status(401).send('Incomplete credentials');
  };
  
  if (bcrypt.compareSync(password, user.password)) {
    response.cookie('user_id', user.userID);
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
  let email = request.body.email;
  let password = request.body.password;
  const userID = generateRandomString(8);

  if (!email || !password) {
    return response.status(403).send('Incomplete registration request!');
  };

  const user = getUserByEmail(email, usersDatabase);
  if (user) {
    return response.status(403).send('User is already exist in database.');
  };
  
  password = bcrypt.hashSync(password);
  usersDatabase[userID] = {
    userID,
    email,
    password
  };

  response.cookie('user_id', userID);
  console.log(usersDatabase);
  response.redirect('/urls');
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