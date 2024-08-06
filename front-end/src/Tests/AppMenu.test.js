import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import AppMenu from "../Components/Layouts/DashboardLayout/AppMenu";
import authReducer, { logout } from "../State/auth/authSlice";

// Mock the entire react-router-dom module
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
  useLocation: () => ({ pathname: "/" }),
}));

// Mock the useDispatch hook
jest.mock("react-redux", () => ({
  ...jest.requireActual("react-redux"),
  useDispatch: () => jest.fn(),
}));

describe("AppMenu", () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          isLoading: false,
          user: {
            user: {
              permissions: {
                profiles: {
                  recruiter: ["read"],
                  admin: ["read"],
                },
                users: {
                  recruiter: ["read"],
                  admin: ["read"],
                },
              },
            },
          },
        },
      },
    });
  });

  const renderComponent = (storeOverride = store) =>
    render(
      <Provider store={storeOverride}>
        <MemoryRouter>
          <AppMenu />
        </MemoryRouter>
      </Provider>
    );

  test("renders all menu items when user has all permissions", () => {
    renderComponent();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Profiles")).toBeInTheDocument();
    expect(screen.getByText("Users")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  test("does not render menu items when user lacks permissions", () => {
    const storeWithoutPermissions = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          isLoading: false,
          user: {
            user: {
              permissions: {
                profiles: {
                  recruiter: [],
                  admin: [],
                },
                users: {
                  recruiter: [],
                  admin: [],
                },
              },
            },
          },
        },
      },
    });
    renderComponent(storeWithoutPermissions);
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Profiles")).not.toBeInTheDocument();
    expect(screen.queryByText("Users")).not.toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument(); // Logout should always be visible
  });

  test("calls logout action on logout click", () => {
    renderComponent();
    const logoutButton = screen.getByText("Logout");
    fireEvent.click(logoutButton);
    // Add assertions here to check if logout action was dispatched
  });

  test("displays loading state when logging out", () => {
    const loadingStore = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: {
        auth: {
          isLoading: true,
          user: null,
        },
      },
    });
    renderComponent(loadingStore);
    expect(screen.getByText("Logging out...")).toBeInTheDocument();
  });
});
