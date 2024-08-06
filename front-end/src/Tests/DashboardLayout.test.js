import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import DashboardLayout from "../Components/Layouts/DashboardLayout/DashboardLayout";

// Mock the child components
jest.mock("../Components/Layouts/DashboardLayout/AppMenu", () => () => (
  <div data-testid="app-menu">App Menu</div>
));
jest.mock("../Components/Layouts/DashboardLayout/UserInfo", () => () => (
  <div data-testid="user-info">User Info</div>
));

// Mock the Outlet component from react-router-dom
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>,
}));

// Create a mock store
const mockStore = configureStore([]);
const store = mockStore({});

describe("DashboardLayout", () => {
  const renderComponent = () =>
    render(
      <Provider store={store}>
        <BrowserRouter>
          <DashboardLayout />
        </BrowserRouter>
      </Provider>
    );

  test("renders without crashing", () => {
    renderComponent();
    expect(screen.getByTestId("app-menu")).toBeInTheDocument();
    expect(screen.getByTestId("user-info")).toBeInTheDocument();
    expect(screen.getByTestId("outlet")).toBeInTheDocument();
  });

  test("renders logo", () => {
    renderComponent();
    const logo = screen.getByAltText("logo");
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute(
      "src",
      "https://talpods.io/img/talpods-white.svg"
    );
  });

  test("renders footer with correct year", () => {
    renderComponent();
    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`Talpods ©${currentYear} Created DevCrew`)
    ).toBeInTheDocument();
  });

  test("sider collapses and expands", () => {
    renderComponent();
    const siderTrigger = screen
      .getByRole("img", { name: /left/i })
      // eslint-disable-next-line testing-library/no-node-access
      .closest("div");

    // Initial state (not collapsed)
    expect(siderTrigger).toHaveStyle("width: 200px");

    // Collapse the sider
    fireEvent.click(siderTrigger);
    expect(siderTrigger).toHaveStyle("width: 80px");

    // Expand the sider
    fireEvent.click(siderTrigger);
    expect(siderTrigger).toHaveStyle("width: 200px");
  });
});
