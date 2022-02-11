import Navbar from "./components/Navbar/Navbar";
import Run from "./views/Run/Run";
import Account from "./views/Account/Account";
import Configs from "./views/Configs/Configs";

import { HashRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="d-flex">
        <Navbar />
        <div className="container-fluid vh-100 overflow-auto pt-5 px-5">
          <Routes>
            <Route path="/" element={<Run />} />
            <Route path="/account" element={<Account />} />
            <Route path="/configs" element={<Configs />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
