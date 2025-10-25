import React, { useState } from "react";
import "./header.css";
import type { User } from '../../types/user'; 

interface HeaderProps {
  user: User;
  onSelectFeature: (feature: string) => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSelectFeature, onLogout }) => {

  const [openProfile, setOpenProfile] = useState(false);
  

  // Definimos funcionalidades por rol
  const roleFeatures: Record<string, string[]> = {
    admin: ["Reportes", "Admin"],
    vendedor: ["Vendedor"],
  };

  return (
    <header className="header">
      <div className="user-menu">
        <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
        <span onClick={() => setOpenProfile(!openProfile)}>{user.name} ▾</span>

        {openProfile && (
          <div className="dropdown">
            <button onClick={onLogout}>Cerrar sesión</button>
          </div>
        )}
      </div>

      <nav className="nav-links">
        {roleFeatures[user.role].map((feature) => (
          <button key={feature} onClick={() => onSelectFeature(feature)}>
            {feature}
          </button>
        ))}
      </nav>
    </header>
  );
};

export default Header;
