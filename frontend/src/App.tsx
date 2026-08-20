import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout"

import Dashboard from "./pages/Dashboard/Dashboard";
import Books from "./pages/Books/Books";
import AddNewBook from "./pages/Books/AddNewBook";
import AddNewFolder from "./pages/Books/AddNewFolder";
import Earnings from "./pages/Earnings/Earnings";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Books */}
        <Route path="/books" element={<Books />} />
        <Route path="/books/addnewbook" element={<AddNewBook />} />
        <Route path="/books/folders/new" element={<AddNewFolder />} />

        {/* Earnings */}
        <Route path="/earnings" element={<Earnings />} />

      </Route>

      {/* Unknown route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;