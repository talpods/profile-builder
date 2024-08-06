export const convertToSlug = (fullName) => {
	return fullName.toLowerCase().replace(/\s+/g, "-");
};
