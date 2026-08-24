import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout"
import { BooksProvider } from "./context/BooksContext";

import Dashboard from "./pages/Dashboard/Dashboard";
import Books from "./pages/Books/Books";
import AddNewBook from "./pages/Books/AddNewBook";
import AddNewFolder from "./pages/Books/AddNewFolder";
import Earnings from "./pages/Earnings/Earnings";
import Login from "./pages/Login/Login";
import SecurityControl  from "./pages/SecurityControl/SecurityControl"
function RequireAuth() {
  return localStorage.getItem("mamta-authenticated") === "true"
    ? <Layout />
    : <Navigate to="/login" replace />;
}

function App() {
  return (
    <BooksProvider>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>

          {/* Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Category */}
          <Route path="/category" element={<Books />} />
          <Route path="/category/addnewbook" element={<AddNewBook />} />
          <Route path="/category/folders/new" element={<AddNewFolder />} />

          {/* Earnings */}
          <Route path="/earnings" element={<Earnings />} />

          <Route path="/securitycontrol" element={<SecurityControl />} />

        </Route>

        {/* Unknown route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BooksProvider>
  );
}

export default App;