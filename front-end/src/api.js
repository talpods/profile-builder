const USER_MANAGEMENT = process.env.REACT_APP_USER_MANAGEMENT;
const AUTH_URL = process.env.REACT_APP_AUTH_URL;
const PROFILE_MANAGEMENT = process.env.REACT_APP_PROFILES_URL;
const SLUG_URL = process.env.REACT_APP_SLUG_URL;
const PROFILE_NB_URL = process.env.REACT_APP_PROFILE_NB_URL;
const VIEW_PROFILE_URL = process.env.REACT_APP_VIEW_PROFILE_URL;

export const GET_PROFILES = `${PROFILE_MANAGEMENT}profiles`;
export const DELETE_PROFILE = `${PROFILE_MANAGEMENT}profiles/`;
export const VIEW_PROFILE = `${VIEW_PROFILE_URL}/`;
export const GET_PROFILE = `${PROFILE_MANAGEMENT}profile`;
export const UPDATE_PROFILES = `${PROFILE_MANAGEMENT}profiles/updatedProfile`;
export const RECREATE_PROFILES = `${PROFILE_MANAGEMENT}profile/`;
export const DELETE_FILE = `${PROFILE_MANAGEMENT}files/file`;
export const GET_PROFILE_DATA = `${PROFILE_MANAGEMENT}profiles/`;

// API Endpoints for user management
export const GET_USERS_API = `${USER_MANAGEMENT}`;
export const CREATE_USER_API = `${USER_MANAGEMENT}`;
export const DELETE_USER_API = `${USER_MANAGEMENT}`;
export const UPDATE_USER_API = `${USER_MANAGEMENT}`;
export const GET_USER_API = `${USER_MANAGEMENT}`;
export const CHANGE_PASSWORD_API = `${USER_MANAGEMENT}/update-password`;

// API Endpoints for Authentication
export const LOGIN_API = `${AUTH_URL}login`;
export const LOGOUT_API = `${AUTH_URL}logout`;
export const REFRESH_TOKEN_API = `${AUTH_URL}refresh-token`;
export const USER_INFO_API = `${AUTH_URL}me`;

// API Endpoints for Profile Management
export const GET_PRFOLES_API = `${PROFILE_MANAGEMENT}/`;
export const DELETE_PROFILE_API = `${PROFILE_MANAGEMENT}/`;
export const REGENERATE_PROFILE_API = `${PROFILE_MANAGEMENT}profiles/regenerateAndUpdateProfile/`;
export const UPDATE_PROFILE_DATA_API = `${PROFILE_MANAGEMENT}profiles/updateData/`;
// API Endpoints for Submission
export const FORM_SUBMISSION = `${PROFILE_MANAGEMENT}profiles/newProfile`;

// API Endpoints for Slug and profile number
export const CREATE_SLUG = `${SLUG_URL}`;
export const CREATE_PROFILE_NUMBER = `${PROFILE_NB_URL}`;
