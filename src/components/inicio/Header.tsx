import React, { useState } from "react";
import "./header.css";
import type { User } from '../../types/user'; 

interface HeaderProps {
  user: User;
  onLogout: () => void;
  // onSelectFeature eliminado ❌
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  const [openProfile, setOpenProfile] = useState(false);

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

      {/* Puedes mostrar información adicional del rol aquí si quieres */}
      <div className="user-info">
        <span className="user-role-badge">
          {user.role === 'admin' ? '🔐 Administrador' : '👤 Vendedor'}
        </span>
      </div>
    </header>
  );
};

export default Header;