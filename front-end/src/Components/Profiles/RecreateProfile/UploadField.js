import { FileImageOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Col, Form, Row, Upload } from "antd";
import React from "react";

const { Dragger } = Upload;

const UploadFields = ({
	photoProps,
	photoName,
	cvUploadProps,
	cvProps,
	linkedInUploadProps,
	linkedInPageProps,
	coverLetterUploadProps,
	coverLetterProps,
}) => {
	return (
		<Row gutter={[16, 16]} className="equal-height-row">
			<Col xs={24} sm={12} lg={6}>
				<Form.Item
					label="Upload image"
					name="photo"
					rules={[
						{
							required: true,
							message: "Please upload talent profile image!",
						},
					]}
					style={{ minHeight: "300px" }}
				>
					<Dragger
						{...photoProps}
						style={{ minHeight: "300px" }}
						fileList={photoName.fileList}
					>
						<p className="ant-upload-drag-icon">
							<FileImageOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag image to this area to upload talent profile image
						</p>
						<p className="ant-upload-hint">
							Only PNG, JPEG, JPG, and SVG files are allowed.
						</p>
					</Dragger>
				</Form.Item>
			</Col>
			<Col xs={24} sm={12} lg={6}>
				<Form.Item
					label="Upload CV"
					name="cv"
					rules={[{ required: true, message: "Please upload talent CV file!" }]}
					style={{ minHeight: "300px" }}
				>
					<Dragger
						{...cvUploadProps}
						style={{ minHeight: "300px" }}
						fileList={cvProps.fileList}
					>
						<p className="ant-upload-drag-icon">
							<FilePdfOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag file to this area to upload talent CV file
						</p>
						<p className="ant-upload-hint">
							Only PDF, TXT, DOC, and DOCX files are allowed.
						</p>
					</Dragger>
				</Form.Item>
			</Col>
			<Col xs={24} sm={12} lg={6} style={{ height: "100%" }}>
				<Form.Item label="Upload LinkedIn file" name="linkedInPage">
					<Dragger
						{...linkedInUploadProps}
						style={{ minHeight: "300px" }}
						fileList={linkedInPageProps.fileList}
					>
						<p className="ant-upload-drag-icon">
							<FilePdfOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag file to this area to upload talent LinkedIn file
						</p>
						<p className="ant-upload-hint">
							Only PDF, TXT, DOC, and DOCX files are allowed.
						</p>
					</Dragger>
				</Form.Item>
			</Col>
			<Col xs={24} sm={12} lg={6} style={{ height: "100%" }}>
				<Form.Item label="Upload cover letter" name="coverLetter">
					<Dragger
						{...coverLetterUploadProps}
						style={{ minHeight: "300px" }}
						fileList={coverLetterProps.fileList}
					>
						<p className="ant-upload-drag-icon">
							<FilePdfOutlined />
						</p>
						<p className="ant-upload-text">
							Click or drag file to this area to upload talent cover letter
						</p>
						<p className="ant-upload-hint">
							Only PDF, TXT, DOC, and DOCX files are allowed.
						</p>
					</Dragger>
				</Form.Item>
			</Col>
		</Row>
	);
};

export default UploadFields;
