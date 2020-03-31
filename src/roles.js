module.exports = {
    'emp' : {
        previlage : 3,
        Edit : false,
        View : true,
        UIOptions : [
            'profile',
            'leavesregister',
            'tasks'
        ]
    },
    'hr' : {
        previlage : 2,
        Edit : true,
        View : true,
        UIOptions : [
            'profile',
            'manageUsers',
            'manageLeaves',
            'leavesRegister',
            'tasks'
        ]
    },
    'adm' : {
        previlage : 1,
        Edit : true,
        View : true,
        UIOptions : [
            'profile',
            'manageUsers',
            'manageLeaves',
            'leavesRegister',
            'tasks'
        ]
    },
    'root' : {
        previlage : 0,
        Edit : true,
        View : true,
    }
}