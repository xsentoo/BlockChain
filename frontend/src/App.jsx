import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import BlockchainExplorer from "./pages/BlockchainExplorer";
import WalletPage from "./pages/WalletPage";

const App = () => {
  return (
    <Router>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          background: "var(--bg-primary)",
        }}
      >
        {/* Sidebar Navigation */}
        <Navbar />

        {/* Main Content */}
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Routes>
            <Route path="/" element={<BlockchainExplorer />} />
            <Route path="/wallet" element={<WalletPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;