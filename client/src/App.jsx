// import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import HomePage from "./pages/HomePage"
// import MessStatistics from "./components/MessStatistics "
// import StudentMessAttendance from "./components/StudentMessAttendance "
// import Scan from "./components/Scan"
// import Register from "./components/Register"
import StudentPublic from "./pages/StudentPublic"
// import Menu from "./pages/Menu"
// import FeedbackInsights from "./pages/Feedback"
// import NoticeBoard from "./components/NoticeBoard"
import ManagerLogin from "./pages/ManagerLogin"
import ManagerProtectWrapper from './pages/ManagerProtectWrapper'
import StudentProtectWrapper from './pages/StudentProtectWrapper'
import StudentLogin from "./pages/StudentLogin"

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/homepage" element={<ManagerProtectWrapper><HomePage /></ManagerProtectWrapper>} />
//         <Route path="/mess-stat" element={<ManagerProtectWrapper><MessStatistics/></ManagerProtectWrapper>} />
//         <Route path="/student-stat" element={<ManagerProtectWrapper><StudentMessAttendance/></ManagerProtectWrapper>} />
//         <Route path="/scan" element={<ManagerProtectWrapper><Scan/></ManagerProtectWrapper>} />
//         <Route path="/register" element={<ManagerProtectWrapper><Register/></ManagerProtectWrapper>} />
//         <Route path="/student-public" element={<StudentProtectWrapper><StudentPublic/></StudentProtectWrapper>} />
//         <Route path="/menu" element={<ManagerProtectWrapper><Menu/></ManagerProtectWrapper>} />
//         <Route path="/feedback" element={<ManagerProtectWrapper><FeedbackInsights/></ManagerProtectWrapper>} />
//         <Route path="/notice-board" element={<ManagerProtectWrapper><NoticeBoard/></ManagerProtectWrapper>} />
//         <Route path="/manager/login" element={<ManagerLogin/>} />
//         <Route path="/" element={<StudentLogin/>} />
//         <Route path="*" element={<h1>Not Found</h1>} />
//       </Routes>
//     </Router>
//   )
// }

// export default App

import React, { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import "./index.css"


const LoadingFallback = () => (
  <div className="min-h-screen bg-gray-50 p-4">
    <div className="max-w-7xl mx-auto">
      {/* Header shimmer */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
        <div className="h-4 w-64 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Content shimmer */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-12 bg-gray-200 animate-pulse"></div>
        <div className="p-4 space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-8 bg-gray-200 rounded animate-pulse"></div>
            ))}
        </div>
      </div>
    </div>
  </div>
)

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
})

// const HomePage = lazy(() => import("./pages/HomePage.jsx"));
const MessStatistics = lazy(() => import("./components/MessStatistics.jsx"));
const StudentMessAttendance = lazy(() => import("./components/StudentMessAttendance.jsx"));
const Scan = lazy(() => import("./components/Scan.jsx"));
const Register = lazy(() => import("./components/Register.jsx"));
// const StudentPublic = lazy(() => import("./pages/StudentPublic.jsx"));
const Menu = lazy(() => import("./pages/Menu.jsx"));
const FeedbackInsights = lazy(() => import("./pages/Feedback.jsx"));
const NoticeBoard = lazy(() => import("./components/NoticeBoard.jsx"));
// const ManagerLogin = lazy(() => import("./pages/ManagerLogin.jsx"));
// const StudentLogin = lazy(() => import("./pages/StudentLogin.jsx"));
// const ManagerProtectWrapper = lazy(() => import("./pages/ManagerProtectWrapper.jsx"));
// const StudentProtectWrapper = lazy(() => import("./pages/StudentProtectWrapper.jsx"));


function App() {
  return (
    <QueryClientProvider client={queryClient}>

    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/homepage" element={<ManagerProtectWrapper><HomePage /></ManagerProtectWrapper>} />
          <Route path="/mess-stat" element={<ManagerProtectWrapper><MessStatistics/></ManagerProtectWrapper>} />
          <Route path="/student-stat" element={<ManagerProtectWrapper><StudentMessAttendance/></ManagerProtectWrapper>} />
          <Route path="/scan" element={<ManagerProtectWrapper><Scan/></ManagerProtectWrapper>} />
          <Route path="/register" element={<ManagerProtectWrapper><Register/></ManagerProtectWrapper>} />
          <Route path="/student-public" element={<StudentProtectWrapper><StudentPublic/></StudentProtectWrapper>} />
          <Route path="/menu" element={<ManagerProtectWrapper><Menu/></ManagerProtectWrapper>} />
          <Route path="/feedback" element={<ManagerProtectWrapper><FeedbackInsights/></ManagerProtectWrapper>} />
          <Route path="/notice-board" element={<ManagerProtectWrapper><NoticeBoard/></ManagerProtectWrapper>} />
          <Route path="/manager/login" element={<ManagerLogin />} />
          <Route path="/" element={<StudentLogin />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Routes>
      </Suspense>
    </Router>
    {process.env.NODE_ENV === "development" && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}


export default App
