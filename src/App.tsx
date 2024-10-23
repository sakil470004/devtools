import { Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/Home/Home";
import ColorPicker from "./pages/Home/Tools/ColorPicker/ColorPicker";
import JSONFormatter from "./pages/Home/Tools/JsonFormatter/JsonFormatter";
import MarkdownToLinkedIn from "./pages/Home/Tools/MarkdownToLinkedIn/MarkdownToLinkedIn";
import FontPicker from "./pages/Home/Tools/FontPicker/FontPicker";
import ImageToBase64 from "./pages/Home/Tools/ImageToBase64/ImageToBase64";
import URLEncoder from "./pages/Home/Tools/URLEncoder/URLEncoder";
import StringConverters from "./pages/Home/Tools/StringConverters/StringConverters";
const fonts = [
  'Arial, sans-serif',
  'Verdana, Geneva, sans-serif',
  'Tahoma, Geneva, sans-serif',
  'Trebuchet MS, Helvetica, sans-serif',
  'Times New Roman, Times, serif',
  'Georgia, serif',
  'Garamond, serif',
  'Courier New, Courier, monospace',
  'Brush Script MT, cursive',
  'Impact, Charcoal, sans-serif',
  'Comic Sans MS, cursive, sans-serif',
  'Lucida Console, Monaco, monospace',
  'Arial Black, Gadget, sans-serif',
  'Lucida Sans Unicode, Lucida Grande, sans-serif',
  'Palatino Linotype, Book Antiqua, Palatino, serif',
  'Helvetica, Arial, sans-serif',
  'Gill Sans, Geneva, sans-serif',
  'Century Gothic, sans-serif',
  'Copperplate, Papyrus, fantasy',
  'Papyrus, fantasy',
  'Bookman, serif',
  'Candara, sans-serif',
  'Franklin Gothic Medium, Arial Narrow, Arial, sans-serif',
  'Consolas, monaco, monospace',
  'Baskerville, serif',
  'Futura, sans-serif',
  'Geneva, Tahoma, Verdana, sans-serif',
  'Hoefler Text, serif',
  'Optima, sans-serif',
  'SignPainter, cursive',
  'Andale Mono, monospace',
  'Charter, serif',
  'Big Caslon, serif',
  'Calibri, sans-serif',
  'Cambria, serif',
  'Didot, serif',
  'Lucida Bright, Georgia, serif',
  'Goudy Old Style, serif',
  'Rockwell, serif'
];

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
        <Route path="/font-picker" element={<FontPicker fonts={fonts} />} />
        <Route path="/image-to-base64" element={<ImageToBase64 />} />
        <Route path="/json-formatter" element={<JSONFormatter />} />
        <Route path="/url-encoder" element={<URLEncoder />} />
        <Route path="/string-converters" element={<StringConverters />} />
      </Routes>
    </>
  );
}

export default App;
