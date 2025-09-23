import React from "react";
import { Link } from "react-router-dom";
import "./Header.css";

const Header = ({ user, onLogout }) => {
  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">AUTOMOBILIŲ NUOMA</Link>
        <Link to="/apie" className="company">UAB AUTNUOMA</Link>
      </div>
      <nav className="header-right">
        {!user ? (
          <>
            <Link to="/login" className="btn">PRISIJUNGTI</Link>
            <Link to="/register" className="btn">REGISTRUOTIS</Link>
          </>
        ) : (
          <button className="btn logout" onClick={onLogout}>ATSIJUNGTI</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
