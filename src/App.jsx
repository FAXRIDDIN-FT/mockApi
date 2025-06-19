import { Link, Route, Routes } from "react-router-dom";

import Users from "./pages/Users";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/blog" element={<Users/>} />
      </Routes>
    </div>
  );
};

export default App;
