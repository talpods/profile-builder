import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import UserInfo from "../Components/Layouts/DashboardLayout/UserInfo";
import "@testing-library/jest-dom/extend-expect";

// Mock the Redux hooks
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Mock window.matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
    };
  };

describe("UserInfo", () => {
  // Mock user data
  const mockUser = {
    firstName: "John",
    lastName: "Doe",
    roles: {
      recruiter: true,
      techReviewer: false,
      buisnessReviewer: true,
    },
  };

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock useSelector to return our mock user data
    require("react-redux").useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { user: mockUser } } })
    );
  });

  test("renders user avatar with correct initials", () => {
    render(<UserInfo />);
    const avatar = screen.getByText("JD");
    expect(avatar).toBeInTheDocument();
  });

  test("renders correct role labels", () => {
    render(<UserInfo />);
    expect(screen.getByText("Recruiter")).toBeInTheDocument();
    expect(screen.getByText("Business Reviewer")).toBeInTheDocument();
    expect(screen.queryByText("Tech Reviewer")).not.toBeInTheDocument();
  });

  test("does not render role labels when user has no roles", () => {
    require("react-redux").useSelector.mockImplementation((selector) =>
      selector({ auth: { user: { user: { ...mockUser, roles: {} } } } })
    );
    render(<UserInfo />);
    expect(screen.queryByText("Recruiter")).not.toBeInTheDocument();
    expect(screen.queryByText("Tech Reviewer")).not.toBeInTheDocument();
    expect(screen.queryByText("Business Reviewer")).not.toBeInTheDocument();
  });

  test("handles missing user data gracefully", () => {
    require("react-redux").useSelector.mockImplementation((selector) =>
      selector({ auth: { user: null } })
    );
    render(<UserInfo />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(screen.queryByText("Recruiter")).not.toBeInTheDocument();
    expect(screen.queryByText("Tech Reviewer")).not.toBeInTheDocument();
    expect(screen.queryByText("Business Reviewer")).not.toBeInTheDocument();
  });
});
