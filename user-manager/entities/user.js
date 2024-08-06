class User {
    constructor(user) {
        this.email = user.email;
        this.password = user.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.roles= user.acl.roles,
        this.permissions= user.acl.resources,
        this.users = user.acl.users
    }
}

module.exports = User;