// Generar un secret seguro para NextAuth
const crypto = require('crypto');

// Generar 32 bytes aleatorios y convertir a base64
const secret = crypto.randomBytes(32).toString('base64');

console.log('NEXTAUTH_SECRET generado:');
console.log(secret);
console.log('\nCopia este valor y pégalo en tu archivo .env.local');
console.log('Reemplaza: NEXTAUTH_SECRET=generate_a_random_secret_with_openssl_rand_base64_32');