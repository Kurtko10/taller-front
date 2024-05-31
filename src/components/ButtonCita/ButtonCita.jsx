import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from 'react-redux';
import "./ButtonCita.css";
import useScrollOpacity from "../../utils/ScrollOpacityComponent";

const ButtonCita = ({ text, onClick, className, showModal = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector(state => state.user.token !== "");

  const handleClick = () => {
    if (location.pathname === "/appointments") {
      onClick();
    } else {
      if (isLoggedIn) {
        navigate("/appointments", { state: { showModal: true } });
      } else {
        navigate("/login");
      }
    }
  };

  const isScrolling = useScrollOpacity();

  return (
    <ul>
      <li onClick={handleClick} className={`${className} ${isScrolling ? "scrolled" : ""}`}>
        <span>{text}</span>
      </li>
    </ul>
  );
};

export default ButtonCita;
