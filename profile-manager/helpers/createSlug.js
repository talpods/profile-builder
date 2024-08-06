function createSlug(firstName, lastName) {
    const first = firstName.toLowerCase();
    const lastInitial = lastName.charAt(0).toLowerCase();
    return `${first}-${lastInitial}`;
}

export default createSlug