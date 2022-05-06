// PostgreSQL init options
const pgpInitOptions = {
    error(err, e) {
        if (e.cn) {
            console.log('Error during DB connection');
        }

        if (e.query) {
            res.json(error(err.message))
        }

        if (e.ctx) {
            res.json(error(err.message))
        }
    }
};

const pgp = require('pg-promise')(pgpInitOptions);

// DB connexion options
const db = pgp({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    ssl: { rejectUnauthorized: false }
});

module.exports = {
    db: db
}