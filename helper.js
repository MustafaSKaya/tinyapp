const generateRandomString = function (num) {
    let result = '';
    let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < num; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            characters.length));
    }
    return result;
};

/*
const getUserByEmail = (email, password) => {
    for (let element in usersDatabase) {
        if (usersDatabase[element].email === email) {
            return response.status(403).send('User is already exist in database.');
        } else if (!email || !password) {
            return response.status(403).send('No input was received.');
        }
    };
}
*/
module.exports = { generateRandomString }