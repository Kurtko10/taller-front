
import { Navigate, Route, Routes } from "react-router-dom";
import "./Body.css";
import 'bootstrap/dist/css/bootstrap.min.css';

export const Body = () => {
  return (
    <>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        
      </Routes>
    </>
  );
};