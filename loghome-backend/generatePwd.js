const bcrypt = require('bcryptjs');

bcrypt.hash('defaultPwd', 10, (err, pwd) => {
	console.log(pwd);
});
