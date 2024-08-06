import { ConfigProvider } from "antd";
function AntThemeProvider({ children }) {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ff5f00",
            colorInfo: "#08266b",
            colorLink: "#6633ff",
            bodyBg: "#F1F3FB",
            headerBg: "#051541",
            footerBg: "#051541",
            borderRadius: 6,
            colorBgLayout: "#F1F3FB",
          },
        }}
      >
        {children}
      </ConfigProvider>
    </>
  );
}

export default AntThemeProvider;
