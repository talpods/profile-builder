class Profile {
  constructor(data) {
    this.profileNumber = data.profileNumber;
    this.slug = data.slug;
    this.email = data.email;
    this.firstName = data.firstName;
    this.secondNameInitials = data.secondNameInitials;
    this.seniority = data.seniority;
    this.status = data.status;
  }
}

export default Profile;
