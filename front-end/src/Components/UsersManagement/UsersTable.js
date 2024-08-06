import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Modal, Spin, Table, Tooltip, message } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { DELETE_USER_API, GET_USER_API } from "../../api";
import UserForm from "./UserForm";

const UsersTable = ({ data, onRefresh, isLoading }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const [editModePass, setEditModePass] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const showModal = () => {
    setEditMode(false);
    setUserDetails(null);
    setIsModalVisible(true);
    setUserEmail("");
    setEditModePass(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleUserCreated = () => {
    setIsModalVisible(false); // Close the modal after user creation
    onRefresh(); // Trigger data refresh in UsersTable
  };

  const showEditModal = async (email) => {
    try {
      const response = await axios.get(`${GET_USER_API}/${email}`);
      const user = response.data.data;
      const initdata = {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.acl.roles,
      };
      setUserDetails(initdata);
      setEditMode(true);
      setIsModalVisible(true);
      setEditModePass(false);
    } catch (error) {
      console.error("Error fetching user data:", error);
      message.error("Error fetching user data.");
    }
  };

  const showEditModalPassChange = (email) => {
    setUserEmail(email);
    setEditModePass(true);
    setIsModalVisible(true);
    setEditMode(false);
  };

  const showDeleteConfirm = (email) => {
    Modal.confirm({
      title: "Are you sure you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk() {
        handleDelete(email);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete(DELETE_USER_API, {
        data: { email },
      });
      onRefresh(); // Refresh the table after deletion
      message.success("User deleted successfully!");
    } catch (error) {
      console.error("Error deleting user:", error);
      message.error("Error deleting user.");
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <p>{text}</p>,
    },
    {
      title: "Full Name",
      key: "name",
      render: (_, record) => <p>{`${record.firstName} ${record.lastName}`}</p>,
    },
    {
      title: "Roles",
      key: "roles",
      render: (_, record) => (
        <p>
          {Object.keys(record.roles)
            .filter((role) => record.roles[role])
            .join(", ")}
        </p>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <Tooltip title="Edit">
            <Button
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => showEditModal(record.email)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => showDeleteConfirm(record.email)}
            />
          </Tooltip>
          <Tooltip title="Change Password">
            <Button
              shape="circle"
              icon={<LockOutlined />}
              onClick={() => showEditModalPassChange(record.email)}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "16px" }}>
        <Button type="primary" onClick={showModal} icon={<PlusOutlined />}>
          Create
        </Button>
      </div>
      <Spin spinning={isLoading}>
        <Table columns={columns} dataSource={data} pagination={false} />
      </Spin>
      <Modal
        title={
          editMode ? "Edit User" : editModePass ? "Change Password" : "Add User"
        }
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <UserForm
          onUserCreated={handleUserCreated}
          userDetails={userDetails}
          isEditUser={editMode}
          isEditUserPass={editModePass}
          userEmail={userEmail}
        />
      </Modal>
    </div>
  );
};

export default UsersTable;
