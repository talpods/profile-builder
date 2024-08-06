class User {
	constructor(data) {
		this.email = data.email;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
		this.roles = data.roles;
	}

	isRecruiter() {
		return this.roles.recruiter;
	}

	isTechReviewer() {
		return this.roles.techReviewer;
	}

	isBuisnessReviewer() {
		return this.roles.buisnessReviewer;
	}
}

export default User;
