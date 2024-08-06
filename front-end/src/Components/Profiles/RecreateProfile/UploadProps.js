import { Upload, message } from "antd";
import { deleteFile } from "../api/profileApi";

export const getPhotoProps = (setPhotoName, form, setPhotoUpdated) => {
	return {
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
};

export const getCvUploadProps = (setCvProps, form, setCvUpdated) => {
	return {
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
};

export const getLinkedInUploadProps = (
	setLinkedInPageProps,
	form,
	setLinkedInPageUpdated
) => {
	return {
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
			deleteFile("linkedInProfile", file.name);
		},
	};
};

export const getCoverLetterUploadProps = (
	setCoverLetterProps,
	form,
	setCoverLetterUpdated
) => {
	return {
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
};
