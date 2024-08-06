import { Form } from "antd";
import React, { useEffect } from "react";
import RecreateProfileForm from "../../../Pages/RecreateProfile/RecreateProfileForm";
import { useFetchProfile } from "./useFetchProfile";
import { useFormHandlers } from "./useFormHandlers";

const RecreateProfile = ({
	photoProps,
	photoFileList,
	cvUploadProps,
	cvFileList,
	linkedInUploadProps,
	linkedInFileList,
	coverLetterUploadProps,
	coverLetterFileList,
}) => {
	const [form] = Form.useForm();
	const { fetchProfileData } = useFetchProfile(form);
	const { handleBlur, handleUpdateProfile, handleRecreateProfile, isLoading } =
		useFormHandlers(form);

	useEffect(() => {
		fetchProfileData();
	}, [fetchProfileData]);

	return (
		<div className="form">
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
				photoFileList={photoFileList}
				cvUploadProps={cvUploadProps}
				cvFileList={cvFileList}
				linkedInUploadProps={linkedInUploadProps}
				linkedInFileList={linkedInFileList}
				coverLetterUploadProps={coverLetterUploadProps}
				coverLetterFileList={coverLetterFileList}
			/>
		</div>
	);
};

export default RecreateProfile;
