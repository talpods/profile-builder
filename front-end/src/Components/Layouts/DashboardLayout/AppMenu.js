import {
  DesktopOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../../State/auth/authSlice";

function AppMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isLoading, user } = useSelector((state) => state.auth);

  async function handleLogout() {
    try {
      dispatch(logout());

      navigate("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  }
  //Check for the permission to view the dashboard
  const canViewDashboard =
    user?.user.permissions?.profiles?.recruiter.includes("read") ||
    user?.user.permissions?.profiles?.admin.includes("read");
  const canViewProfiles =
    user?.user.permissions?.profiles?.recruiter.includes("read") ||
    user?.user.permissions?.profiles?.admin.includes("read");
  const canViewUsers =
    user?.user.permissions?.users?.recruiter.includes("read") ||
    user?.user.permissions?.users?.admin.includes("read");

  const menuListItems = [
    {
      key: "1",
      icon: <DesktopOutlined />,
      label: (
        <NavLink to="/" activeClassName="active-link">
          Dashboard
        </NavLink>
      ),
      show: canViewDashboard,
    },
    {
      key: "2",
      icon: <TeamOutlined />,
      label: (
        <NavLink to="/profiles" activeClassName="active-link">
          Profiles
        </NavLink>
      ),
      show: canViewProfiles,
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: (
        <NavLink to="/users" activeClassName="active-link">
          Users
        </NavLink>
      ),
      show: canViewUsers,
    },
    {
      key: "4",
      icon: <LogoutOutlined />,
      label: (
        <NavLink onClick={handleLogout} activeClassName="active-link">
          {isLoading ? "Logging out..." : "Logout"}
        </NavLink>
      ),
      show: true,
    },
  ];

  const selectedKey = menuListItems.find(
    (item) => item.label.props.to === location.pathname
  )?.key;

  return (
    <Menu
      theme="dark"
      defaultSelectedKeys={["1"]}
      selectedKeys={[selectedKey]}
      mode="inline"
    >
      {menuListItems
        .filter((item) => item.show)
        .map((item) => (
          <Menu.Item key={item.key} icon={item.icon}>
            {item.to ? (
              <NavLink to={item.to} activeClassName="active-link">
                {item.label}
              </NavLink>
            ) : (
              <span onClick={item.onClick}>{item.label}</span>
            )}
          </Menu.Item>
        ))}
    </Menu>
  );
}

export default AppMenu;
