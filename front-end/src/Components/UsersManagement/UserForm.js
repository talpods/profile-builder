import { Button, Form, Input, Select, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  CHANGE_PASSWORD_API,
  CREATE_USER_API,
  UPDATE_USER_API,
} from "../../api";
import "../Forms/SimpleForm.css";

const { Option } = Select;

const UserForm = ({
  onUserCreated,
  userDetails,
  isEditUser,
  isEditUserPass,
  userEmail,
}) => {
  const [form] = Form.useForm();
  const [changePasswordForm] = Form.useForm();
  const [roles, setRoles] = useState({
    admin: false,
    buisnessReviewer: false,
    recruiter: false,
    techReviewer: false,
  });

  useEffect(() => {
    if (userDetails && isEditUser) {
      form.setFieldsValue(userDetails);
      form.setFields([
        {
          name: "roles",
          value: getTrueRoles(userDetails.roles),
        },
      ]);
      handleRoleChange(
        Object.keys(userDetails.roles).filter((role) => userDetails.roles[role])
      );
    } else if (isEditUserPass) {
      changePasswordForm.setFields([
        {
          name: "email",
          value: userEmail,
        },
      ]);
    } else {
      form.resetFields();
    }
  }, [userDetails, form, changePasswordForm, userEmail, isEditUserPass]);

  function getTrueRoles(rolesObject) {
    const trueRoles = [];

    for (const role in rolesObject) {
      if (rolesObject[role]) {
        trueRoles.push(role);
      }
    }

    return trueRoles;
  }

  const handleRoleChange = (values) => {
    const updatedRoles = {
      admin: false,
      buisnessReviewer: false,
      recruiter: false,
      techReviewer: false,
    };
    values.forEach((role) => {
      updatedRoles[role] = true;
    });

    setRoles(updatedRoles);
  };

  const validatePassword = (_, value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.-])[A-Za-z\d@$!%*?&.-]{8,}$/;
    return !value || passwordRegex.test(value)
      ? Promise.resolve()
      : Promise.reject(new Error("Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character (e.g., @, $, !, %, *, ?, &, ., -)."));
  };
  
  const handleSubmit = async (values) => {
    const userData = {
      PK: "users",
      SK: `users#${values.email}`,
      acl: {
        resources: {
          profiles: {
            admin: ["read", "write", "delete"],
            buisnessReviewer: ["read", "write"],
            recruiter: ["read", "write"],
            techReviewer: ["read", "write"],
          },
          users: {
            admin: ["read", "write", "delete"],
            buisnessReviewer: [],
            recruiter: [],
            techReviewer: [],
          },
        },
        roles: roles,
      },
      email: values.email,
      firstName: values.firstName,
      lastName: values.lastName,
      password: values.password,
      createdAt: new Date().toISOString(),
    };
    const apiUrl = isEditUser ? UPDATE_USER_API : CREATE_USER_API;

    try {
      const response = isEditUser
        ? await axios.put(apiUrl, userData)
        : await axios.post(apiUrl, userData);
      message.success(
        `User ${isEditUser ? "updated" : "created"} successfully!`
      );
      form.resetFields();
      onUserCreated(); // Trigger the callback to refresh the table
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handlePasswordChange = async (values) => {
    try {
      const response = await axios.post(CHANGE_PASSWORD_API, values);

      message.success(`User's password changed successfully!`);
      changePasswordForm.resetFields();
      onUserCreated();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  return (
    <div className="form">
      {!isEditUserPass && (
        <Form
          form={form}
          size="large"
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please input your first name!" },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please input your last name!" },
            ]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: "email", message: "The input is not valid E-mail!" },
              { required: true, message: "Please input your E-mail!" },
            ]}
          >
            <Input placeholder="example@mail.com" disabled={isEditUser} />
          </Form.Item>
          {!isEditUser && (
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  validator: validatePassword,
                  required: !isEditUser,
                },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
          )}
          <Form.Item
            label="Roles"
            name="roles"
            rules={[
              { required: true, message: "Please select at least one role!" },
            ]}
          >
            <Select
              mode="multiple"
              placeholder="Select roles"
              onChange={handleRoleChange}
            >
              <Option value="admin">Admin</Option>
              <Option value="buisnessReviewer">Business Reviewer</Option>
              <Option value="recruiter">Recruiter</Option>
              <Option value="techReviewer">Tech Reviewer</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEditUser ? "Update" : "Submit"}
            </Button>
          </Form.Item>
        </Form>
      )}

      {isEditUserPass && (
        <Form
          form={changePasswordForm}
          size="large"
          layout="vertical"
          onFinish={handlePasswordChange}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { type: "email", message: "The input is not valid E-mail!" },
              { required: true, message: "Please input your E-mail!" },
            ]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            label="Password"
            name="newPassword"
            rules={[{validator: validatePassword , required: true}]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Change Password
            </Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
};

export default UserForm;
