import { Layout } from "antd";
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import logo from "../../../assets/talpods-white.svg";
import AppMenu from "./AppMenu";
import UserInfo from "./UserInfo";
const { Header, Content, Footer, Sider } = Layout;

function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          zIndex: 1,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="logo" />
        </div>
        <UserInfo />
      </Header>

      <Layout style={{ marginTop: 64 }}>
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={(value) => setCollapsed(value)}
          style={{ position: "fixed", height: "100vh", zIndex: 1 }}
        >
          <AppMenu />
        </Sider>

        <Layout
          style={{
            marginLeft: collapsed ? 80 : 200,
            transition: "margin-left 0.2s",
          }}
        >
          <Content style={{ padding: 24, margin: 20 }}>
            <Outlet />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            TalPods ©{new Date().getFullYear()} All rights reserved.
          </Footer>
        </Layout>
      </Layout>
    </Layout>
  );
}

export default DashboardLayout;
