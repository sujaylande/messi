import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
import MessStatistics from "./components/MessStatistics "
import StudentMessAttendance from "./components/StudentMessAttendance "
import Scan from "./components/Scan"
import Register from "./components/Register"
import StudentPublic from "./pages/StudentPublic"
import Menu from "./pages/Menu"
import FeedbackInsights from "./pages/Feedback"
import NoticeBoard from "./components/NoticeBoard"


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mess-stat" element={<MessStatistics/>} />
        <Route path="/student-stat" element={<StudentMessAttendance/>} />
        <Route path="/scan" element={<Scan/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/student-public" element={<StudentPublic/>} />
        <Route path="/menu" element={<Menu/>} />
        <Route path="/feedback" element={<FeedbackInsights/>} />
        <Route path="/notice-board" element={<NoticeBoard/>} />

        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  )
}

export default App

