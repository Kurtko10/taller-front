import React from "react";
import { SocialIcon } from "react-social-icons";
import "./SocialIcons.css";
import useScrollOpacity from "../../utils/ScrollOpacityComponent"; 

const SocialIcons = ({ urls }) => {
  const isScrolling = useScrollOpacity(); 

  return (
    <div className={`social-icons ${isScrolling ? "scrolled" : ""}`}>
      {urls.map((url, index) => (
        <SocialIcon key={index} url={url} className="social-icon" target="_blank" />
      ))}
    </div>
  );
};

export default SocialIcons;