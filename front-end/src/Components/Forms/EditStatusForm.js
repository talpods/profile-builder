import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Button, message, Select } from "antd";
import axios from "axios";
import { UPDATE_PROFILE_DATA_API } from "../../api";
import { fetchProfile } from "../../State/profile/profileSlice";
import "./Forms.css";

const { Option } = Select;
const EditApiCall = async (slug, newData) => {
  const result = await axios.put(`${UPDATE_PROFILE_DATA_API}${slug}`, newData);
  return result;
};
export const EditStatusForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { slug } = data;
    console.log(values.status);
    const statusData = {
      path: "status",
      updatedData: values.status,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, statusData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response?.data?.error || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Update Status</h2>
      <Form
        name="status_form"
        onFinish={onFinish}
        initialValues={{
          status: data.status,
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="status"
          label="Profile Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status" allowClear>
            <Option value="draft">Draft</Option>
            <Option value="completed">Completed</Option>
            <Option value="in-tech-review">In tech review</Option>
            <Option value="in-business-review">Inusiness Review</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
