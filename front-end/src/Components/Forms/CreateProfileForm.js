import { FileImageOutlined, FilePdfOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal, Select, Upload, message } from "antd";
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { CREATE_PROFILE_NUMBER, CREATE_SLUG, FORM_SUBMISSION } from '../../api';
import "./SimpleForm.css";

const { Option } = Select;
const { Dragger } = Upload;


const validateGitHubLink = (_, value) => {
  const gitHubLinkRegex = /^https:\/\/github\.com\/[A-Za-z0-9_.-]+$/;
  return !value || gitHubLinkRegex.test(value) ? Promise.resolve() : Promise.reject(new Error("Please enter a valid GitHub repository link"));
};

const validateLinkedInLink = (_, value) => {
  const linkedInLinkRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9_-]+\/?$/;
  return !value || linkedInLinkRegex.test(value) ? Promise.resolve() : Promise.reject(new Error("Please enter a valid LinkedIn profile link"));
};

const validateGoogleDocsLink = (_, value) => {
  const googleDocsLinkRegex = /^https:\/\/docs\.google\.com\/document\/d\/[A-Za-z0-9_-]+\/?/;
  return !value || googleDocsLinkRegex.test(value) ? Promise.resolve() : Promise.reject(new Error("Please enter a valid Google Docs link"));
};

const validateName = (_, value) => {
  const nameRegex = /^[A-Z][a-z]*([ ][A-Z][a-z]*)*$/;

  if (!value || nameRegex.test(value)) {
    return Promise.resolve();
  }

  return Promise.reject(new Error("Please enter a valid name with each word capitalized"));
};

const validateRole = (_, value) => {
  const nameRegex = /^[A-Z][a-z]*([ ][a-z]*)*$/;

  if (!value || nameRegex.test(value)) {
    return Promise.resolve();
  }

  return Promise.reject(new Error("Please enter a valid role with each word capitalized"));
};

const validateNamNumber = (_, value) => {
  const nameRegex = /^[0-9]*([ ][0-9]*)*$/;

  if (!value || nameRegex.test(value)) {
    return Promise.resolve();
  }

  return Promise.reject(new Error("Please enter a valid number"));
};

const validateStringWithoutSpaces = (_, value) => { 
  const stringRegex = /^[^\s]+$/;
   if (!value || stringRegex.test(value)) { 
    return Promise.resolve(); 
  }
    return Promise.reject(new Error("The string must not contain any spaces"));
   };

 const validateEmail = (_, value) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !value || emailRegex.test(value) 
      ? Promise.resolve() 
      : Promise.reject(new Error("Please enter a valid email address"));
};

const photoProps = {
  beforeUpload: (file) => {
    const isAllowedType = ["image/png", "image/jpeg", "image/jpg", "image/svg+xml"].includes(file.type);
    if (!isAllowedType) {
      message.error(`${file.name} is not a valid file type. Only PNG, JPEG, JPG, and SVG files are allowed.`);
    }
    return isAllowedType || Upload.LIST_IGNORE;
  },
  onChange: (info) => {
    console.log(info.fileList);
  },
};

const cvProps = {
  beforeUpload: (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    const isAllowedType = allowedTypes.includes(file.type);
    if (!isAllowedType) {
      message.error(`${file.name} is not a valid file type. Only PDF, DOC, and DOCX files are allowed.`);
    }
    return isAllowedType || Upload.LIST_IGNORE;
  },
};

const SimpleForm = () => {
  const [form] = Form.useForm();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [formValues, setFormValues] = useState({});
  const navigate = useNavigate();

  const [slug, setSlug] = useState('');
  const [isLoading, setIsloading] = useState(false);

  const handleBlur = async () => {
    const firstNameValue = firstName;
    const lastNameValue = lastName;
    
    if (firstNameValue && lastNameValue) {
      try {
        const profilesResponse = await axios.get(`${CREATE_SLUG}${firstNameValue}/${lastNameValue}`);
        const profileNbResponse = await axios.get(`${CREATE_PROFILE_NUMBER}`);
        console.log('Profiles Response:', profilesResponse.data);
        console.log('Profile Number Response:', profileNbResponse.data);
        setSlug(profilesResponse.data);
        form.setFieldsValue({
          slug: profilesResponse.data,
          profileNumber: profileNbResponse.data,
        });
      } catch (error) {
        console.error('API Error:', error);
      }
    }
  };

  const onFinish = async (values) => {
    setIsloading(true);
    await handleBlur();
    setFormValues(values);
    setIsloading(false);
    setModalVisible(true);
  };

  const handleOk = () => {
    setIsloading(true);
    const values = formValues;
    const formData = new FormData();
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('levelOfExperience', values.levelOfExperience);
    formData.append('targetRole', values.targetRole);
    formData.append('linkedInLink', values.linkedInLink ? values.linkedInLink : null);
    formData.append('githubLink', values.githubLink ? values.githubLink : null);
    formData.append('email', values.email);
    formData.append('scoreSheetLink', values.scoreSheetLink ? values.scoreSheetLink : null);
    formData.append('slug', slug);
    formData.append('profileNumber', values.profileNumber);

    if (values.photo && values.photo.file) {
      formData.append('photo', values.photo.file.originFileObj);
    }
    if (values.cv && values.cv.file) {
      formData.append('cv', values.cv.file.originFileObj);
    }
    if (values.linkedInPage && values.linkedInPage.file) {
      formData.append('linkedInPage', values.linkedInPage.file.originFileObj);
    }
    if (values.coverLetter && values.coverLetter.file) {
      formData.append('coverLetter', values.coverLetter.file.originFileObj);
    }

    axios.post(`${FORM_SUBMISSION}`, formData)
      .then(response => {
        message.success('Form submitted successfully');
        console.log('Response:', response.data);
        setModalVisible(false);
        form.resetFields();
        navigate('/profiles');
        setIsloading(false);
      })
      .catch(error => {
        message.error('Failed to submit form');
        console.error('Error:', error);
        console.log('Error Response Data:', error.response.data);
        setIsloading(false);
      });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  return (
  <div className="form">
    <Form form={form} size="large" layout="vertical" onFinish={onFinish}>
      <Flex>
        <div className="w-50">
          <Form.Item
            label="First name"
            name="firstName"
            rules={[{validator:validateName},{ required: true, message: "Please input first name!" }]}
          >
            <Input placeholder="First name"
             onBlur={handleBlur}
             onChange={(e) => setFirstName(e.target.value)} />
          </Form.Item>
        </div>
        <div className="w-50">
          <Form.Item
            label="Last name"
            name="lastName"
            rules={[{validator:validateName},{ required: true, message: "Please input last name!" }]}
          >
            <Input placeholder="Last name"
             onBlur={handleBlur}
             onChange={(e) => setLastName(e.target.value)} />
          </Form.Item>
        </div>
      </Flex>
      <Flex>
        <div className="w-50">
          <Form.Item
            name="levelOfExperience"
            label="Level of experience"
            rules={[{ required: true, message: "Please select level of experience" }]}
          >
            <Select placeholder="Select a level of experience" allowClear>
              <Option value="Software engineer entry level">Software engineer entry level</Option>
              <Option value="Software engineer level 1">Software engineer level 1</Option>
              <Option value="Software engineer level 2">Software engineer level 2</Option>
              <Option value="Software engineer level 3">Software engineer level 3</Option>
              <Option value="Staff engineer level 1">Staff engineer level 1</Option>
              <Option value="Staff engineer level 2">Staff engineer level 2</Option>
              <Option value="Principle engineer level 1">Principle engineer level 1</Option>
              <Option value="Principle engineer level 2">Principle engineer level 2</Option>
            </Select>
          </Form.Item>
        </div>
        <div className="w-50">
          <Form.Item
            label="Target role"
            name="targetRole"
            rules={[{validator:validateRole},{ required: true, message: "Please input target role!" }]}
          >
            <Input placeholder="Frontend developer" />
          </Form.Item>
        </div>
      </Flex>
      <Flex>
        <div className="w-50">
          <Form.Item
            label="LinkedIn URL"
            name="linkedInLink"
            rules={[{ validator: validateLinkedInLink }, { message: "Please input LinkedIn URL!" }]}
          >
            <Input placeholder="https://www.linkedin.com/" type="url" />
          </Form.Item>
        </div>
        <div className="w-50">
          <Form.Item
            label="GitHub URL"
            name="githubLink"
            rules={[{ validator: validateGitHubLink }, { message: "Please input GitHub URL!" }]}
          >
            <Input placeholder="https://github.com/" type="url" />
          </Form.Item>
        </div>
      </Flex>
      <Flex>
        <div className="w-50">
          <Form.Item
            label="Slug"
            name="slug"
            rules={[{validator:validateStringWithoutSpaces},{ required: true, message: "Please input a valid slug!" }]}
          >
            <Input placeholder="Slug" disabled />
          </Form.Item>
        </div>
        <div className="w-50">
          <Form.Item
            label="Profile number"
            name="profileNumber"
            rules={[{validator:validateNamNumber},{ required: true, message: "Please input a valid profile number!" }]}
          >
            <Input placeholder="Profile number" disabled />
          </Form.Item>
        </div>
      </Flex>
      <Flex>
        <div className="w-50">
          <Form.Item
            label="Score sheet URL"
            name="scoreSheetLink"
            rules={[{ validator: validateGoogleDocsLink }, { message: "Please input score sheet URL!" }]}
          >
            <Input placeholder="https://docs.google.com" type="url" />
          </Form.Item>
        </div>
        <div className="w-50">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ validator: validateEmail }, { required: true, message: "Please input a valid email!" }]}
          >
            <Input placeholder="example@gmail.com" type="email" />
          </Form.Item>
        </div>
      </Flex>
      <Flex>
        <div className="w-50">
          <Form.Item
            label="Upload image"
            name="photo"
            rules={[{ required: true, message: "Please upload talent profile image!" }]}
          >
            <Dragger {...photoProps}>
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
        </div>
        <div className="w-50">
          <Form.Item
            label="Upload CV"
            name="cv"
            rules={[{ required: true, message: "Please upload talent CV file!" }]}
          >
            <Dragger {...cvProps}>
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
        </div>
        <div className="w-50">
          <Form.Item
            label="Upload LinkedIn file"
            name="linkedInPage"
          >
            <Dragger {...cvProps}>
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
        </div>
        <div className="w-50">
          <Form.Item
            label="Upload cover letter"
            name="coverLetter"
          >
            <Dragger {...cvProps}>
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
        </div>
      </Flex>

      <Form.Item>
      <Button type="primary" htmlType="submit" disabled={isLoading}>
        {isLoading ? 'Validating' : 'Submit'}
      </Button>
      </Form.Item>
    </Form>

    <Modal
      title="Confirm your details"
      visible={modalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      okButtonProps={{ disabled: isLoading }}
      okText={isLoading ? "Submitting..." : "OK"}
    >
      <p><strong>First name:</strong> {firstName}</p>
      <p><strong>Last name:</strong> {lastName}</p>
      <p><strong>Experience level:</strong> {formValues.levelOfExperience}</p>
      <p><strong>Target role:</strong> {formValues.targetRole}</p>
      <p><strong>LinkedIn URL:</strong> {formValues.linkedInLink}</p>
      <p><strong>GitHub URL:</strong> {formValues.githubLink}</p>
      <p><strong>Score sheet URL:</strong> {formValues.scoreSheetLink}</p>
      <p><strong>Email:</strong> {formValues.email}</p>
      <p><strong>Slug:</strong> {slug}</p>
      <p><strong>Profile number:</strong> {formValues.profileNumber}</p>
      <p><strong>Profile image:</strong> {formValues.photo?.file?.name}</p>
      <p><strong>CV file:</strong> {formValues.cv?.file?.name}</p>
      <p><strong>LinkedIn file:</strong> {formValues.linkedInPage?.file?.name}</p>
      <p><strong>Cover letter:</strong> {formValues.coverLetter?.file?.name}</p>
    </Modal>
  </div>
);
}

export default SimpleForm;
