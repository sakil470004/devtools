import { Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/Home/Home";
import ColorPicker from "./pages/Home/Tools/ColorPicker/ColorPicker";
import JSONFormatter from "./pages/Home/Tools/JsonFormatter/JsonFormatter";
import MarkdownToLinkedIn from "./pages/Home/Tools/MarkdownToLinkedIn/MarkdownToLinkedIn";


function App() {
  return (
    <>
      <Routes>

        {/* <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        /> */}
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/color-picker" element={<ColorPicker />} />
        <Route path="/markdown-to-linkedin" element={<MarkdownToLinkedIn />} />
        <Route path="/json-formatter" element={<JSONFormatter />} />
      </Routes>
    </>
  );
}

export default App;
