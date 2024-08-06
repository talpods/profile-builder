import { Alert, Button, Flex, Form, Input } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../../State/auth/authSlice";
import "./LoginForm.css";

function LoginForm() {
  const { isLoading, accessToken } = useSelector((state) => state.auth);
  const [loginError, setLoginError] = useState(null);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (accessToken) {
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [accessToken, navigate, location]);

  const validateEmail = (_, value) => {
    if (!value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error("Please enter a valid email address"));
  };

  const onSubmitHandler = async (values) => {
    const loginReq = {
      email: values.email,
      password: values.password,
    };
    try {
      await dispatch(login(loginReq)).unwrap();
      setLoginError(null);
    } catch (err) {
      setLoginError(err.error || "An error occurred during login");
    }
  };

  return (
    <div>
      <h1>Welcome back!</h1>
      <p>Please login to continue</p>
      <div className="login-form">
        <Form
          size="large"
          layout="vertical"
          form={form}
          onFinish={(values) => onSubmitHandler(values)}
        >
          <Flex vertical>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { validator: validateEmail },
                { required: true, message: "Please enter your email" },
              ]}
            >
              <Input placeholder="example@mail.com" type="text" />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: "Please enter your password" },
              ]}
            >
              <Input placeholder="Enter your password" type="password" />
            </Form.Item>
          </Flex>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Form.Item>
          {loginError && <Alert message={loginError} type="error" />}
        </Form>
      </div>
    </div>
  );
}

export default LoginForm;
