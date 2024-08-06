export const validateName = (_, value) => {
	if (!value || /^[A-Za-z]+$/.test(value)) {
		return Promise.resolve();
	}
	return Promise.reject(new Error("Name must be alphabetic"));
};

export const validateRole = (_, value) => {
	if (!value || /^[A-Za-z\s]+$/.test(value)) {
		return Promise.resolve();
	}
	return Promise.reject(new Error("Role must be alphabetic"));
};

export const validateLinkedInLink = (_, value) => {
	const pattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/.*$/i;
	if (!value || pattern.test(value)) {
		return Promise.resolve();
	}
	return Promise.reject(new Error("Invalid LinkedIn URL"));
};

export const validateGitHubLink = (_, value) => {
	const pattern = /^(https?:\/\/)?(www\.)?github\.com\/.*$/i;
	if (!value || pattern.test(value)) {
		return Promise.resolve();
	}
	return Promise.reject(new Error("Invalid GitHub URL"));
};

export const validateGoogleDocsLink = (_, value) => {
	const pattern = /^(https?:\/\/)?(docs\.)?google\.com\/.*$/i;
	if (!value || pattern.test(value)) {
		return Promise.resolve();
	}
	return Promise.reject(new Error("Invalid Google Docs URL"));
};

export const validateEmail = (_, value) => {
	const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!value || pattern.test(value)) {
		return Promise.resolve();
	}
	return Promise.reject(new Error("Invalid email address"));
};

export const validateStringWithoutSpaces = (_, value) => {
	if (!value || /^\S+$/.test(value)) {
		return Promise.resolve();
	}
	return Promise.reject(new Error("Slug must not contain spaces"));
};
