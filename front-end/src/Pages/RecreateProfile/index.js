import { message, Upload } from "antd";
import axios from "axios";
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	CREATE_SLUG,
	DELETE_FILE,
	GET_PROFILE,
	RECREATE_PROFILES,
	UPDATE_PROFILES,
} from "../../api";
import RecreateProfileForm from "../../Components/Profiles/RecreateProfile/RecreateProfileForm";
import "../../Components/UI/SimpleForm.css";
import useProfileState from "../../Hooks/useProfileState";

const RecreateProfile = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const slug = queryParams.get("slug");
	const navigate = useNavigate();
	const {
		form,
		firstName,
		setFirstName,
		lastName,
		setLastName,
		originalFirstName,
		setOriginalFirstName,
		originalLastName,
		setOriginalLastName,
		originalSlug,
		setOriginalSlug,
		setFormValues,
		setUserSlug,
		isLoading,
		setIsloading,
		photoUpdated,
		setPhotoUpdated,
		cvUpdated,
		setCvUpdated,
		linkedInPageUpdated,
		setLinkedInPageUpdated,
		coverLetterUpdated,
		setCoverLetterUpdated,
		photoName,
		setPhotoName,
		cvProps,
		setCvProps,
		linkedInPageProps,
		setLinkedInPageProps,
		coverLetterProps,
		setCoverLetterProps,
	} = useProfileState();

	const photoProps = {
		beforeUpload: (file) => {
			const isAllowedType = [
				"image/png",
				"image/jpeg",
				"image/jpg",
				"image/svg+xml",
			].includes(file.type);
			if (!isAllowedType) {
				message.error(
					`${file.name} is not a valid file type. Only PNG, JPEG, JPG, and SVG files are allowed.`
				);
			}
			return isAllowedType || Upload.LIST_IGNORE;
		},
		onChange: (info) => {
			const { fileList } = info;
			const newFileList = fileList.slice(-1);
			setPhotoName((prevProps) => ({
				...prevProps,
				fileList: newFileList,
			}));
			form.setFieldsValue({
				photo: newFileList.length ? newFileList[0].originFileObj : null,
			});
			setPhotoUpdated(true);
		},
		onRemove: () => {
			setPhotoName((prevProps) => ({
				...prevProps,
				fileList: [],
			}));
			form.setFieldsValue({ photo: null });
			setPhotoUpdated(true);
		},
	};

	const cvUploadProps = {
		beforeUpload: (file) => {
			const isAllowedType = [
				"application/pdf",
				"text/plain",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			].includes(file.type);
			if (!isAllowedType) {
				message.error(
					`${file.name} is not a valid file type. Only PDF, TXT, DOC, and DOCX files are allowed.`
				);
			}
			return isAllowedType || Upload.LIST_IGNORE;
		},
		onChange: (info) => {
			const { fileList } = info;
			const newFileList = fileList.slice(-1);
			setCvProps((prevProps) => ({
				...prevProps,
				fileList: newFileList,
			}));
			form.setFieldsValue({
				cv: newFileList.length ? newFileList[0].originFileObj : null,
			});
			setCvUpdated(true);
		},
		onRemove: () => {
			setCvProps((prevProps) => ({
				...prevProps,
				fileList: [],
			}));
			form.setFieldsValue({ cv: null });
			setCvUpdated(true);
		},
	};

	const linkedInUploadProps = {
		beforeUpload: (file) => {
			const isAllowedType = [
				"application/pdf",
				"text/plain",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			].includes(file.type);
			if (!isAllowedType) {
				message.error(
					`${file.name} is not a valid file type. Only PDF, TXT, DOC, and DOCX files are allowed.`
				);
			}
			return isAllowedType || Upload.LIST_IGNORE;
		},
		onChange: (info) => {
			const { fileList } = info;
			const newFileList = fileList.slice(-1);
			setLinkedInPageProps((prevProps) => ({
				...prevProps,
				fileList: newFileList,
			}));
			form.setFieldsValue({
				linkedInPage: newFileList.length ? newFileList[0].originFileObj : null,
			});
			setLinkedInPageUpdated(true);
		},
		onRemove: (file) => {
			setLinkedInPageProps((prevProps) => ({
				...prevProps,
				fileList: [],
			}));
			form.setFieldsValue({ linkedInPage: null });
			setLinkedInPageUpdated(true);
			deleteFile("linkedInProfile".file.name);
		},
	};

	const coverLetterUploadProps = {
		beforeUpload: (file) => {
			const isAllowedType = [
				"application/pdf",
				"text/plain",
				"application/msword",
				"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			].includes(file.type);
			if (!isAllowedType) {
				message.error(
					`${file.name} is not a valid file type. Only PDF, TXT, DOC, and DOCX files are allowed.`
				);
			}
			return isAllowedType || Upload.LIST_IGNORE;
		},
		onChange: (info) => {
			const { fileList } = info;
			const newFileList = fileList.slice(-1);
			setCoverLetterProps((prevProps) => ({
				...prevProps,
				fileList: newFileList,
			}));
			form.setFieldsValue({
				coverLetter: newFileList.length ? newFileList[0].originFileObj : null,
			});
			setCoverLetterUpdated(true);
		},
		onRemove: (file) => {
			setCoverLetterProps((prevProps) => ({
				...prevProps,
				fileList: [],
			}));
			form.setFieldsValue({ coverLetter: null });
			setCoverLetterUpdated(true);
			deleteFile("coverLetterUrl", file.name);
		},
	};

	const deleteFile = (fileType, fileName) => {
		axios
			.delete(DELETE_FILE, {
				params: {
					slug,
					fileType,
					fileName,
				},
			})
			.then(() => {})
			.catch((error) => {
				console.error("Error deleting file:", error);
			});
	};
	
	const handleBlur = async () => {
		const firstNameValue = firstName;
		const lastNameValue = lastName;
		if (
			firstNameValue &&
			lastNameValue &&
			(originalFirstName !== firstNameValue ||
				originalLastName?.charAt(0) !== lastNameValue?.charAt(0))
		) {
			try {
				const profilesResponse = await axios.get(
					`${CREATE_SLUG}${firstNameValue}/${lastNameValue}`
				);
				setUserSlug(profilesResponse.data);
				form.setFieldsValue({
					slug: profilesResponse.data,
				});
			} catch (error) {
				console.error("API Error:", error);
			}
		} else {
			setUserSlug(originalSlug);
			form.setFieldsValue({
				slug: originalSlug,
			});
		}
	};

	const onFinish = async (values) => {
		setIsloading(true);
		await handleBlur();
		setFormValues(values);
		setIsloading(false);
	};

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				const response = await axios({
					method: "GET",
					url: GET_PROFILE,
					params: { slug: slug },
				});
				const profileData = response.data;
				const initialFileList = profileData.photo
					? [
							{
								uid: "-1",
								name: profileData.photo,
								status: "done",
								url: profileData.photo,
							},
					  ]
					: [];
				setPhotoName((prevProps) => ({
					...prevProps,
					fileList: initialFileList,
				}));
				form.setFieldsValue({
					photo: initialFileList.length ? initialFileList[0] : null,
				});

				const initialCvList = profileData.cv
					? [
							{
								uid: "-2",
								name: profileData.cv,
								status: "done",
								url: profileData.cv,
							},
					  ]
					: [];
				setCvProps((prevProps) => ({
					...prevProps,
					fileList: initialCvList,
				}));
				form.setFieldsValue({
					cv: initialCvList.length ? initialCvList[0] : null,
				});

				const initialLinkedInList = profileData.linkedInPage
					? [
							{
								uid: "-3",
								name: profileData.linkedInPage,
								status: "done",
								url: profileData.linkedInPage,
							},
					  ]
					: [];
				setLinkedInPageProps((prevProps) => ({
					...prevProps,
					fileList: initialLinkedInList,
				}));
				form.setFieldsValue({
					linkedInPage: initialLinkedInList.length
						? initialLinkedInList[0]
						: null,
				});

				const initialCoverLetterList = profileData.coverLetter
					? [
							{
								uid: "-4",
								name: profileData.coverLetter,
								status: "done",
								url: profileData.coverLetter,
							},
					  ]
					: [];
				setCoverLetterProps((prevProps) => ({
					...prevProps,
					fileList: initialCoverLetterList,
				}));
				form.setFieldsValue({
					coverLetter: initialCoverLetterList.length
						? initialCoverLetterList[0]
						: null,
				});
				setFirstName(profileData.firstName);
				setLastName(profileData.lastName);
				setOriginalFirstName(profileData.firstName);
				setOriginalLastName(profileData.lastName);
				setOriginalSlug(profileData.slug);
				form.setFieldsValue({
					firstName: profileData.firstName,
					lastName: profileData.lastName,
					levelOfExperience: profileData.levelOfExperience,
					targetRole: profileData.targetRole,
					linkedInLink: profileData.linkedInLink,
					githubLink: profileData.githubLink,
					profileNumber: profileData.profileNumber,
					scoreSheetLink: profileData.scoreSheetLink,
					email: profileData.email,
					slug: profileData.slug,
				});
			} catch (error) {
				console.error("Error fetching profile:", error);
			}
		};

		fetchProfile();
	}, []);

	const handleUpdateProfile = async (values) => {
		const formData = new FormData();

		formData.append("oldSlug", originalSlug);

		Object.keys(values).forEach((key) => {
			if (
				key !== "photo" &&
				key !== "cv" &&
				key !== "linkedInPage" &&
				key !== "coverLetter"
			) {
				if (
					(key === "githubLink" ||
						key === "linkedInLink" ||
						key === "scoreSheetLink") &&
					values[key] === ""
				) {
					formData.append(key, null);
				} else {
					formData.append(key, values[key]);
				}
			}
		});

		if (photoUpdated && values.photo) {
			formData.append("photo", values.photo);
		}

		if (cvUpdated && values.cv) {
			formData.append("cv", values.cv);
		}

		if (linkedInPageUpdated && values.linkedInPage) {
			formData.append("linkedInPage", values.linkedInPage);
		}

		if (coverLetterUpdated && values.coverLetter) {
			formData.append("coverLetter", values.coverLetter);
		}

		axios
			.put(`${UPDATE_PROFILES}`, formData)
			.then(() => {
				message.success("Form updated successfully");
				if (cvUpdated || linkedInPageUpdated || coverLetterUpdated) {
					message.success(
						"Please click the 'Recreate' button to apply the changes"
					);
				}
				setIsloading(false);
			})
			.catch((error) => {
				message.error("Failed to update form");
				console.error("Error:", error);
				setIsloading(false);
			});
	};
	const handleRecreateProfile = async (values) => {
		axios
			.put(`${RECREATE_PROFILES}${slug}`)
			.then(() => {
				message.success("Form recreated successfully");
				navigate("/profiles");
				setIsloading(false);
			})
			.catch((error) => {
				message.error("Failed to recreate form");
				console.error("Error:", error);
				setIsloading(false);
			});
	};
	return (
		<>
			<h1
				style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}
			>
				Recreate profile
			</h1>
			<RecreateProfileForm
				form={form}
				handleBlur={handleBlur}
				handleUpdateProfile={handleUpdateProfile}
				handleRecreateProfile={handleRecreateProfile}
				isLoading={isLoading}
				photoProps={photoProps}
				photoName={photoName}
				cvUploadProps={cvUploadProps}
				cvProps={cvProps}
				linkedInUploadProps={linkedInUploadProps}
				linkedInPageProps={linkedInPageProps}
				coverLetterUploadProps={coverLetterUploadProps}
				coverLetterProps={coverLetterProps}
				onFinish={onFinish}
				setFirstName={setFirstName}
				setLastName={setLastName}
			/>
		</>
	);
};

export default RecreateProfile;
