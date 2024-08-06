// src/hooks/useProfileState.ts
import { Form } from "antd";
import { useState } from "react";

const useProfileState = () => {
	const [form] = Form.useForm();
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [originalFirstName, setOriginalFirstName] = useState("");
	const [originalLastName, setOriginalLastName] = useState("");
	const [originalSlug, setOriginalSlug] = useState("");
	const [formValues, setFormValues] = useState({});
	const [userSlug, setUserSlug] = useState("");
	const [isLoading, setIsloading] = useState(false);
	const [photoUpdated, setPhotoUpdated] = useState(false);
	const [cvUpdated, setCvUpdated] = useState(false);
	const [linkedInPageUpdated, setLinkedInPageUpdated] = useState(false);
	const [coverLetterUpdated, setCoverLetterUpdated] = useState(false);
	const [photoName, setPhotoName] = useState({
		name: "file",
		multiple: false,
		fileList: [],
	});
	const [cvProps, setCvProps] = useState({
		name: "file",
		multiple: false,
		fileList: [],
	});
	const [linkedInPageProps, setLinkedInPageProps] = useState({
		name: "file",
		multiple: false,
		fileList: [],
	});
	const [coverLetterProps, setCoverLetterProps] = useState({
		name: "file",
		multiple: false,
		fileList: [],
	});

	return {
		form,
		firstName,
		lastName,
		originalFirstName,
		originalLastName,
		originalSlug,
		formValues,
		userSlug,
		isLoading,
		photoUpdated,
		cvUpdated,
		linkedInPageUpdated,
		coverLetterUpdated,
		cvProps,
		photoName,
		linkedInPageProps,
		coverLetterProps,
		setFirstName,
		setLastName,
		setOriginalFirstName,
		setOriginalLastName,
		setOriginalSlug,
		setFormValues,
		setUserSlug,
		setIsloading,
		setPhotoUpdated,
		setCvUpdated,
		setLinkedInPageUpdated,
		setCoverLetterUpdated,
		setPhotoName,
		setCvProps,
		setLinkedInPageProps,
		setCoverLetterProps,
	};
};

export default useProfileState;
