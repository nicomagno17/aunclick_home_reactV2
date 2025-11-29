"use client";

import { useEffect, useState } from "react";

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
}

const defaultLinks: SkipLink[] = [
  { href: "#main-content", label: "Ir al contenido principal" },
  { href: "#login-form", label: "Ir al formulario de inicio de sesión" },
  { href: "#footer", label: "Ir al pie de página" },
];

export function SkipLinks({ links = defaultLinks }: SkipLinksProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Show skip links when Tab is pressed from the beginning
      if (event.key === "Tab" && !event.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleFocusOut = () => {
      // Hide skip links when focus moves away
      setTimeout(() => setIsVisible(false), 100);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("focusout", handleFocusOut);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  return (
    <nav
      aria-label="Enlaces de navegación rápida"
      className={`fixed top-0 left-0 z-50 transition-transform duration-200 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <ul className="flex flex-col space-y-1 p-2 bg-blue-600 text-white shadow-lg rounded-br-lg">
        {links.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="block px-4 py-2 text-sm font-medium rounded hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-200"
              onFocus={() => setIsVisible(true)}
              onBlur={() => setIsVisible(false)}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default SkipLinks;