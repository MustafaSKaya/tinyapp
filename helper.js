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
    for (let user in userDb) {
        if (userDb[user].email === email) {
            return userDb[user];
        } 
    }
    return false;
  };

module.exports = { generateRandomString, getUserByEmail }