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
import ManagerLogin from "./pages/ManagerLogin"
import ManagerProtectWrapper from './pages/ManagerProtectWrapper'
import StudentProtectWrapper from './pages/StudentProtectWrapper'
import StudentLogin from "./pages/StudentLogin"




function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ManagerProtectWrapper><HomePage /></ManagerProtectWrapper>} />
        <Route path="/mess-stat" element={<ManagerProtectWrapper><MessStatistics/></ManagerProtectWrapper>} />
        <Route path="/student-stat" element={<ManagerProtectWrapper><StudentMessAttendance/></ManagerProtectWrapper>} />
        <Route path="/scan" element={<ManagerProtectWrapper><Scan/></ManagerProtectWrapper>} />
        <Route path="/register" element={<ManagerProtectWrapper><Register/></ManagerProtectWrapper>} />
        <Route path="/student-public" element={<StudentProtectWrapper><StudentPublic/></StudentProtectWrapper>} />
        <Route path="/menu" element={<ManagerProtectWrapper><Menu/></ManagerProtectWrapper>} />
        <Route path="/feedback" element={<ManagerProtectWrapper><FeedbackInsights/></ManagerProtectWrapper>} />
        <Route path="/notice-board" element={<ManagerProtectWrapper><NoticeBoard/></ManagerProtectWrapper>} />
        <Route path="/manager/login" element={<ManagerLogin/>} />
        <Route path="/student/login" element={<StudentLogin/>} />
        <Route path="*" element={<h1>Not Found</h1>} />
      </Routes>
    </Router>
  )
}

export default App

