const userparams = 'uid, username, email, firstname, lastname, role, leavestaken';
const leavesparams = ['leave', 'username', 'email', 'firstname', 'lastname', 'role', 'leavestaken'];
const getTopNUsers = (n) => `SELECT ${userparams} FROM users LIMIT ${n} ORDERBY uid ASC`;
const getUsers = () => `SELECT ${userparams} FROM users ORDER BY uid DESC`;
const getUserWithUid = (uid) => `SELECT ${userparams} FROM users WHERE uid = CAST(${uid} AS BIGINT)`;
const getLeaves = () => `SELECT ${leavesparams} FROM users ORDER BY uid ASC`;
const deleteUser = (uid) => `DELETE FROM users WHERE uid = CAST(${uid} AS BIGINT)`
module.exports = {
    getTopNUsers,
    getUsers,
    getLeaves,
    deleteUser,
    getUserWithUid
}