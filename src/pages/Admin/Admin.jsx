import React from 'react';
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HeaderSidebar from '../../components/HeaderSidebar/HeaderSidebar';
import Sidebar from '../../components/Sidebar/Sidebar';
import HomeSidebar from '../../components/HomeSidebar/HomeSidebar';
import AdminAppointments from '../../components/AdminAppointments/AdminAppointments';
import Users from '../../components/Users/Users';
import "./Admin.css";

const Admin = () => {
  // Obtener la información del usuario desde el estado de Redux
  const userData = useSelector(state => state.user);

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className='admin'>
      <div className='grid-container'>
        <div>
          <HeaderSidebar OpenSidebar={OpenSidebar} />
          <Sidebar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
          <HomeSidebar />
        </div>
        <Routes>
        <Route path="/users" element={<Users />} />
          <Route path="/appointments" element={<AdminAppointments />} />
         
        </Routes>
      </div>
    </div>
  );
};

export default Admin;

