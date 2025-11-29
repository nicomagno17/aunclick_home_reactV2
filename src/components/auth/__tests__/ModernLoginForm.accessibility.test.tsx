import { render, screen } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import ModernLoginForm from "../ModernLoginForm";

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

describe("ModernLoginForm Accessibility", () => {
  it("should have no accessibility violations", async () => {
    const { container } = render(<ModernLoginForm />);

    // Run axe-core accessibility tests
    const results = await axe(container, {
      rules: {
        // WCAG 2.1 AA specific rules
        "color-contrast": { enabled: true },
        "keyboard-navigation": { enabled: true },
        "focus-visible": { enabled: true },
        "aria-required-attr": { enabled: true },
        "aria-required-children": { enabled: true },
        "aria-required-parent": { enabled: true },
        "aria-roles": { enabled: true },
        "aria-valid-attr": { enabled: true },
        "aria-valid-attr-value": { enabled: true },
        "button-name": { enabled: true },
        "form-field-multiple-labels": { enabled: false }, // Allow multiple labels for better UX
        "label": { enabled: true },
        "link-name": { enabled: true },
        "select-name": { enabled: true },
        "autocomplete-valid": { enabled: true },
        "accesskeys": { enabled: true },
        "focus-order-semantics": { enabled: true },
        "frame-title": { enabled: true },
        "heading-order": { enabled: true },
        "hidden-content": { enabled: false }, // Allow hidden content for skip links
        "image-alt": { enabled: true },
        "input-image-alt": { enabled: true },
        "landmark-banner-is-top-level": { enabled: true },
        "landmark-complementary-is-top-level": { enabled: true },
        "landmark-contentinfo-is-top-level": { enabled: true },
        "landmark-main-is-top-level": { enabled: true },
        "landmark-no-duplicate-banner": { enabled: true },
        "landmark-no-duplicate-contentinfo": { enabled: true },
        "landmark-one-main": { enabled: true },
        "landmark-unique": { enabled: true },
        "meta-viewport": { enabled: true },
        "object-alt": { enabled: true },
        "tabindex": { enabled: true },
        "table-duplicate-name": { enabled: true },
        "table-fake-caption": { enabled: true },
        "td-has-header": { enabled: true },
        "td-headers-attr": { enabled: true },
        "th-has-data-cells": { enabled: true },
        "valid-lang": { enabled: true },
        "video-caption": { enabled: true },
        "video-description": { enabled: true },
      },
    });

    expect(results).toHaveNoViolations();
  });

  it("should have proper ARIA labels and roles", () => {
    render(<ModernLoginForm />);

    // Check for main landmarks
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();

    // Check for form and its fields
    const form = screen.getByRole("form", { name: /formulario de inicio de sesión moderno/i });
    expect(form).toBeInTheDocument();

    // Check for required form fields
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toBeRequired();
    expect(emailInput).toHaveAttribute("aria-required", "true");

    const passwordInput = screen.getByLabelText(/contraseña/i);
    expect(passwordInput).toBeRequired();
    expect(passwordInput).toHaveAttribute("aria-required", "true");

    // Check for submit button
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("aria-describedby", "submit-description");
  });

  it("should have skip links for navigation", () => {
    render(<ModernLoginForm />);

    // Check for skip links (they should be present but may be visually hidden)
    const skipLinks = screen.getAllByRole("link");
    const mainContentLink = skipLinks.find(link =>
      link.textContent?.includes("contenido principal")
    );
    expect(mainContentLink).toBeInTheDocument();
  });

  it("should support keyboard navigation", () => {
    render(<ModernLoginForm />);

    // Check that all interactive elements are keyboard accessible
    const focusableElements = screen.getAllByRole("button");
    const inputs = screen.getAllByRole("textbox");

    // Ensure we have focusable elements
    expect(focusableElements.length).toBeGreaterThan(0);
    expect(inputs.length).toBeGreaterThan(0);

    // Check that inputs have proper autocomplete attributes
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    expect(emailInput).toHaveAttribute("autocomplete", "email");

    const passwordInput = screen.getByLabelText(/contraseña/i);
    expect(passwordInput).toHaveAttribute("autocomplete", "current-password");
  });

  it("should have proper heading structure", () => {
    render(<ModernLoginForm />);

    // Check for main heading
    const mainHeading = screen.getByRole("heading", { level: 1 });
    expect(mainHeading).toHaveTextContent(/bienvenido de vuelta/i);
  });

  it("should have descriptive link text", () => {
    render(<ModernLoginForm />);

    // Check for descriptive link text
    const forgotPasswordLink = screen.getByRole("link", { name: /olvidaste tu contraseña/i });
    expect(forgotPasswordLink).toBeInTheDocument();

    const registerLink = screen.getByRole("button", { name: /ir a la página de registro/i });
    expect(registerLink).toBeInTheDocument();
  });

  it("should have proper error handling for screen readers", () => {
    render(<ModernLoginForm />);

    // Check for error message containers (they exist but may be empty)
    const emailError = document.getElementById("email-error");
    expect(emailError).toBeInTheDocument();
    expect(emailError).toHaveAttribute("role", "alert");
    expect(emailError).toHaveAttribute("aria-live", "polite");

    const passwordError = document.getElementById("password-error");
    expect(passwordError).toBeInTheDocument();
    expect(passwordError).toHaveAttribute("role", "alert");
    expect(passwordError).toHaveAttribute("aria-live", "polite");
  });

  it("should have proper color contrast and focus indicators", () => {
    render(<ModernLoginForm />);

    // This would be tested by axe-core, but we can check for focus styles
    const submitButton = screen.getByRole("button", { name: /iniciar sesión/i });

    // Check that buttons have focus ring styles (this is a basic check)
    expect(submitButton).toHaveClass("focus:outline-none", "focus:ring-4", "focus:ring-blue-300");
  });
});