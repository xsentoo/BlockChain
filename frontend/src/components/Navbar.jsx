import React from "react";
import { NavLink } from "react-router-dom";
import { Database, Wallet, Activity } from "lucide-react";

const navItems = [
  { to: "/", icon: Database, label: "Explorer", end: true },
  { to: "/wallet", icon: Wallet, label: "Wallets" },
];

const Navbar = () => {
  return (
    <nav
      style={{
        width: "80px",
        minHeight: "100vh",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--glass-border)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "1.5rem",
        gap: "0.5rem",
        position: "relative",
        zIndex: 50,
      }}
    >
      {/* Logo */}
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "var(--radius-md)",
          background: "var(--gradient-primary)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "2rem",
          boxShadow: "0 4px 20px rgba(99, 102, 241, 0.35)",
        }}
      >
        <Activity size={24} color="white" />
      </div>

      {/* Nav Links */}
      {navItems.map(({ to, icon: Icon, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          style={({ isActive }) => ({
            width: "56px",
            height: "56px",
            borderRadius: "var(--radius-md)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.25rem",
            textDecoration: "none",
            transition: "all 0.3s ease",
            background: isActive
              ? "rgba(99, 102, 241, 0.15)"
              : "transparent",
            border: isActive
              ? "1px solid rgba(99, 102, 241, 0.3)"
              : "1px solid transparent",
            color: isActive
              ? "var(--accent-blue-light)"
              : "var(--text-muted)",
          })}
        >
          <Icon size={20} />
          <span
            style={{
              fontSize: "0.55rem",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default Navbar;
