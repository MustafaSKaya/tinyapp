const generateRandomString = function (num) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            characters.length));
    }
    return result;
};

const getUserByEmail = (email, userDb) => {
    if(!email.includes('@')) {
        return "Not an email";
    }
    for (let user in userDb) {
        if (!userDb[user].email) {
            return undefined;
        } else if (userDb[user].email === email) {
            return userDb[user];
        } 
    }
  };

const urlsForUser = (id, urlDb) => {
    let result = {};
    for (let url in urlDb) {
      if (urlDb[url].userID === id) {
        result[url] = urlDb[url];
      }
    }
    return result;
  };

module.exports = { generateRandomString, getUserByEmail, urlsForUser }