const pg = require('pg');
const pool = new pg.Pool({
    host : 'localhost',
    port : 5432,
    database : 'hrdb',
    user : 'postgres',
    password : 'root'
});
pool.connect().then((val)=>console.log(`connected to ${val.database} as ${val.user} on ${val.host}@${val.port}`)).catch((err)=>console.log(err+'...error'));
module.exports = {pool};
