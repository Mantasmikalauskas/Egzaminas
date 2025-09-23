import React from "react";
import "./Sidebar.css";

const Sidebar = ({ onFilter }) => {
  const categories = [
    "EKONOMINĖ KLASĖ",
    "VIDUTINĖ KLASĖ",
    "SUV",
    "LIMUZINAI",
    "PROGINIAI",
    "KROVININIAI",
    "PRIEKABOS",
    "KĖDUTĖS VAIKAMS",
    "NARVAI AUGINTINIAMS",
    "KITA PAPILDOMA ĮRANGA",
  ];

  return (
    <div className="sidebar">
      {categories.map((cat, index) => (
        <button
          key={index}
          className="sidebar-btn"
          onClick={() => onFilter(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
