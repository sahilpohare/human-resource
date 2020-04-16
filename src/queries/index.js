const userparams = 'uid, username, email, firstname, lastname, role, leavestaken';
const leavesparams = ['leaveid','uid','from_to','approved','leave_type'].map(val=>'leaves.'+val).join(', '); 
const getTopNUsers = (n) => `SELECT ${userparams} FROM users LIMIT ${n} ORDERBY uid ASC`;
const getUsers = () => `SELECT ${userparams} FROM users ORDER BY uid DESC`;
const getUserWithUid = (uid) => `SELECT ${userparams} FROM users WHERE uid = CAST(${uid} AS BIGINT)`;
const getLeaves = () => `SELECT users.username, ${leavesparams} FROM leaves INNER JOIN users ON users.uid = leaves.uid`;
const getLeavesWithUid = (uid) => `SELECT * FROM leaves WHERE leaves.uid = CAST(${uid} AS BIGINT)`;
const approveLeave = (leaveId) => `UPDATE leaves SET approved = true WHERE leaveid = $1`
const addLeave = (dateRange) => `INSERT INTO leaves (uid,from_to,leave_type) VALUES ($1,$2,$3)`;
const deleteUser = (uid) => `DELETE FROM users WHERE uid = CAST(${uid} AS BIGINT)`;
const deleteLeave = (leaveid) => `DELETE FROM leaves WHERE leaveid = CAST($1 AS BIGINT)`;
module.exports = {
    getTopNUsers,
    getUsers,
    getLeaves,
    addLeave,
    deleteUser,
    deleteLeave,
    getUserWithUid,
    getLeavesWithUid,
    approveLeave
}