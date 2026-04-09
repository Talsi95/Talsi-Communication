const bcrypt = require('bcryptjs');
const password = "";
bcrypt.hash(password, 10, (err, hash) => {
    console.log("This is your hashed password:", hash);
});