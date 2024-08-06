class SingleProfile {
	constructor(data) {
		this.profileNumber = data.profileNumber;
		this.slug = data.slug;
		this.email = data.email;
		this.firstName = data.firstName;
		this.lastName = data.secondNameInitials;
		this.targetRole = data.seniority;
		this.linkedInPage = data.linkedInProfile;
		this.githubLink = data.githubLink;
		this.scoreSheetLink = data.scoreSheetLink;
		this.photo = data.photo;
		this.cv = data.cvUrl;
		this.coverLetter = data.coverLetterUrl;
		this.linkedInLink = data.linkedInPageUrl;
		this.levelOfExperience = data.level;
	}
}

export default SingleProfile;
