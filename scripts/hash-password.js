const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'jhe.eifer3001';
  const saltRounds = 10;
  
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('Your hashed password is:');
    console.log(hashedPassword);
  } catch (error) {
    console.error('Error hashing password:', error);
  }
}

hashPassword();
