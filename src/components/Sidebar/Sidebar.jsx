import React, { useState, useEffect } from 'react';
import { BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, BsListCheck, BsMenuButtonWideFill, BsFillGearFill, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import "./Sidebar.css";

function Sidebar({ openSidebarToggle, OpenSidebar }) {
  const [arrowIcon, setArrowIcon] = useState(<BsArrowLeft />);

  useEffect(() => {
    if (openSidebarToggle) {
      setArrowIcon(<BsArrowRight />);
    } else {
      setArrowIcon(<BsArrowLeft />);
    }
  }, [openSidebarToggle]);

  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive" : ""}>
      <div className='sidebar-brand'>
        <span className='icon close_icon' onClick={OpenSidebar}> {arrowIcon}</span>
      </div>

      <ul className='sidebar-list'>
        <li className='sidebar-list-item'>
          <span href="">
            <BsGrid1X2Fill className='icon' /> <span id='textAdmin'></span>
          </span>
        </li>
        <li className='sidebar-list-item'>
          <a href="/users">
            <BsPeopleFill className='icon' /> <span>USUARIOS</span>
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/artists">
            <BsFillGrid3X3GapFill className='icon' /> <span>ARTISTAS</span>
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/admin/appointments">
            <BsListCheck className='icon' /> <span>CITAS</span>
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="">
            <BsFillArchiveFill className='icon' /> <span>CURSOS</span>
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="">
            <BsMenuButtonWideFill className='icon' /> <span>MENSAJES</span>
          </a>
        </li>
        <li className='sidebar-list-item'>
          <a href="/profile">
            <BsFillGearFill className='icon' /> <span>SETTING</span>
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Sidebar;