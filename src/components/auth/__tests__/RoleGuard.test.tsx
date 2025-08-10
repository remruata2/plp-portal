/**
 * @jest-environment jsdom
 */

import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import RoleGuard from "../RoleGuard";
import { UserRole } from "@/generated/prisma";

// Mock next-auth
jest.mock("next-auth/react");
const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;

// Mock next/navigation
jest.mock("next/navigation");
const mockUseRouter = useRouter as jest.MockedFunction<typeof useRouter>;

describe("RoleGuard", () => {
  const mockRouter = {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  };

  beforeEach(() => {
    mockUseRouter.mockReturnValue(mockRouter);
    jest.clearAllMocks();
  });

  it("renders children when user has required role", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Test User",
          email: "test@example.com",
          role: UserRole.facility,
        },
      },
      status: "authenticated",
      update: jest.fn(),
    });

    render(
      <RoleGuard requiredRole={UserRole.facility}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("renders children when admin accesses facility-only content", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: UserRole.admin,
        },
      },
      status: "authenticated",
      update: jest.fn(),
    });

    render(
      <RoleGuard requiredRole={UserRole.facility}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("redirects when user has insufficient role", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Facility User",
          email: "facility@example.com",
          role: UserRole.facility, // Lower role
        },
      },
      status: "authenticated",
      update: jest.fn(),
    });

    render(
      <RoleGuard requiredRole={UserRole.admin}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(mockRouter.push).toHaveBeenCalledWith("/unauthorized");
  });

  it("shows error when user is not authenticated", () => {
    mockUseSession.mockReturnValue({
      data: null,
      status: "unauthenticated",
      update: jest.fn(),
    });

    render(
      <RoleGuard requiredRole={UserRole.facility}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(mockRouter.push).toHaveBeenCalledWith("/unauthorized");
  });

  it("shows error when user role is missing", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "User Without Role",
          email: "user@example.com",
          // Missing role
        },
      },
      status: "authenticated",
      update: jest.fn(),
    });

    render(
      <RoleGuard requiredRole={UserRole.facility}>
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(mockRouter.push).toHaveBeenCalledWith("/unauthorized");
  });

  it("renders custom unauthorized content when provided", () => {
    mockUseSession.mockReturnValue({
      data: {
        user: {
          id: "1",
          name: "Facility User",
          email: "facility@example.com",
          role: UserRole.facility, // Lower role
        },
      },
      status: "authenticated",
      update: jest.fn(),
    });

    render(
      <RoleGuard
        requiredRole={UserRole.admin}
        unauthorizedContent={<div>Custom Unauthorized Message</div>}
      >
        <div>Protected Content</div>
      </RoleGuard>
    );

    expect(screen.getByText("Custom Unauthorized Message")).toBeInTheDocument();
    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});
