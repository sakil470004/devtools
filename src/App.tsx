import './App.css'
import { Route, Routes } from 'react-router-dom'

import HomePage from './pages/Home/Home'
import MarkdownToLinkedIn from './pages/Home/Tools/MarkdownToLinkedIn/MarkdownToLinkedIn'
import ColorPicker from './pages/Home/Tools/ColorPicker/ColorPicker'

function App() {


  return (
    <>
      <Routes>
        {/* <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        /> */}
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/home"
          element={<HomePage />}
        />
         <Route path="/color-picker" element={<ColorPicker />} />
        <Route path="/markdown-to-linkedin" element={<MarkdownToLinkedIn />} />
      </Routes>
    </>
  )
}

export default App
