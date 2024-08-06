import { Button, Col, Form, Input, Row, Select, Space } from "antd";
import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";
import UploadForm from "./UploadField";
import {
	validateEmail,
	validateGitHubLink,
	validateGoogleDocsLink,
	validateLinkedInLink,
	validateName,
	validateRole,
	validateStringWithoutSpaces,
} from "./Validation";

const { Option } = Select;

const RecreateProfileForm = ({
	onFinish,
	form,
	handleBlur,
	isLoading,
	photoProps,
	photoName,
	cvUploadProps,
	cvProps,
	linkedInUploadProps,
	linkedInPageProps,
	coverLetterUploadProps,
	coverLetterProps,
	handleRecreateProfile,
	handleUpdateProfile,
	setFirstName,
	setLastName,
}) => {
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const handleCancel = () => {
		setIsConfirmOpen(false);
	};
	const handleConfirm = (values) => {
		setIsConfirmOpen(false);
		handleRecreateProfile(values);
	};
	const handleOpenModal = (values) => {
		setIsConfirmOpen(true);
	};
	return (
		<div className="form">
			<Form
				form={form}
				size="large"
				layout="vertical"
				onFinish={onFinish}
				onFinishFailed={(errorInfo) => {
					console.log("Failed:", errorInfo);
				}}
			>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="First name"
								name="firstName"
								rules={[
									{ validator: validateName },
									{ required: true, message: "Please input first name!" },
								]}
							>
								<Input
									placeholder="First name"
									onBlur={handleBlur}
									onChange={(e) => setFirstName(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Col>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="Last name"
								name="lastName"
								rules={[
									{ validator: validateName },
									{ required: true, message: "Please input last name!" },
								]}
							>
								<Input
									placeholder="Last name"
									onBlur={handleBlur}
									onChange={(e) => setLastName(e.target.value)}
								/>
							</Form.Item>
						</div>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								name="levelOfExperience"
								label="Level of experience"
								rules={[
									{
										required: true,
										message: "Please select level of experience",
									},
								]}
							>
								<Select placeholder="Select a level of experience" allowClear>
									<Option value="Software engineer entry level">
										Software engineer entry level
									</Option>
									<Option value="Software engineer level 1">
										Software engineer level 1
									</Option>
									<Option value="Software engineer level 2">
										Software engineer level 2
									</Option>
									<Option value="Software engineer level 3">
										Software engineer level 3
									</Option>
									<Option value="Staff engineer level 1">
										Staff engineer level 1
									</Option>
									<Option value="Staff engineer level 2">
										Staff engineer level 2
									</Option>
									<Option value="Principle engineer level 1">
										Principle engineer level 1
									</Option>
									<Option value="Principle engineer level 2">
										Principle engineer level 2
									</Option>
								</Select>
							</Form.Item>
						</div>
					</Col>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="Target role"
								name="targetRole"
								rules={[
									{ validator: validateRole },
									{ required: true, message: "Please input target role!" },
								]}
							>
								<Input placeholder="Frontend developer" />
							</Form.Item>
						</div>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="LinkedIn URL"
								name="linkedInLink"
								rules={[
									{ validator: validateLinkedInLink },
									{ message: "Please input LinkedIn URL!" },
								]}
							>
								<Input placeholder="https://www.linkedin.com/" type="url" />
							</Form.Item>
						</div>
					</Col>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="GitHub URL"
								name="githubLink"
								rules={[
									{ validator: validateGitHubLink },
									{ message: "Please input GitHub URL!" },
								]}
							>
								<Input placeholder="https://github.com/" type="url" />
							</Form.Item>
						</div>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="Score sheet URL"
								name="scoreSheetLink"
								rules={[
									{ validator: validateGoogleDocsLink },
									{ message: "Please input score sheet URL!" },
								]}
							>
								<Input placeholder="https://docs.google.com" type="url" />
							</Form.Item>
						</div>
					</Col>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="Email"
								name="email"
								rules={[
									{ validator: validateEmail },
									{ required: true, message: "Please input a valid email!" },
								]}
							>
								<Input placeholder="example@gmail.com" type="email" />
							</Form.Item>
						</div>
					</Col>
				</Row>
				<Row gutter={[16, 16]}>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="Slug"
								name="slug"
								rules={[
									{ validator: validateStringWithoutSpaces },
									{ required: true, message: "Please input a valid slug!" },
								]}
							>
								<Input placeholder="Slug" disabled />
							</Form.Item>
						</div>
					</Col>
					<Col xs={24} lg={12}>
						<div className="w-100">
							<Form.Item
								label="Profile number"
								name="profileNumber"
								rules={[
									{
										required: true,
										message: "Please input a valid profile number!",
									},
								]}
							>
								<Input placeholder="Profile number" disabled />
							</Form.Item>
						</div>
					</Col>
				</Row>
				<UploadForm
					photoProps={photoProps}
					photoName={photoName}
					cvUploadProps={cvUploadProps}
					cvProps={cvProps}
					linkedInUploadProps={linkedInUploadProps}
					linkedInPageProps={linkedInPageProps}
					coverLetterUploadProps={coverLetterUploadProps}
					coverLetterProps={coverLetterProps}
				/>
				<Row justify="end">
					<Form.Item>
						<Space style={{ width: "100%" }} size={20}>
							<Button
								type="primary"
								htmlType="submit"
								disabled={isLoading}
								style={{ flex: 1 }}
								onClick={() => {
									form
										.validateFields()
										.then((values) => {
											handleOpenModal(values);
										})
										.catch((info) => {
											console.log("Validate Failed:", info);
										});
								}}
							>
								{isLoading ? "Recreating..." : "Recreate"}
							</Button>
							<Button
								type="primary"
								htmlType="submit"
								disabled={isLoading}
								style={{ flex: 1 }}
								onClick={() => {
									form
										.validateFields()
										.then((values) => {
											handleUpdateProfile(values);
										})
										.catch((info) => {
											console.log("Validate Failed:", info);
										});
								}}
							>
								{isLoading ? "Saving..." : "Save"}
							</Button>
						</Space>
					</Form.Item>
				</Row>
			</Form>
			<ConfirmModal
				isConfirmOpen={isConfirmOpen}
				handleConfirm={handleConfirm}
				handleCancel={handleCancel}
			/>
		</div>
	);
};

export default RecreateProfileForm;
