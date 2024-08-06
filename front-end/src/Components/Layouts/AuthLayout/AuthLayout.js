import { Flex } from "antd";
import { Outlet } from "react-router-dom";
import logo from "../../../assets/talpods.svg";
import "./authLayout.css";
function AuthLayout() {
  return (
    <Flex justify="">
      <div className="w-50 h-100 left">
        <Flex justify="center" vertical gap={3}>
          <img src={logo} alt="logo" />

          <h1>We’re unlocking tomorrow’s tech leaders today.</h1>
        </Flex>
      </div>
      <Flex align="center" justify="center" className="w-50  right">
        <Outlet />
      </Flex>
    </Flex>
  );
}

export default AuthLayout;
