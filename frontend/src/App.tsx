import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Jobs from './pages/Jobs'
import JobDetail from './pages/JobDetail'
import DashboardSeeker from './pages/DashboardSeeker'
import DashboardRecruiter from './pages/DashboardRecruiter'
import PostJob from './pages/PostJob'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/dashboard/seeker" element={<DashboardSeeker />} />
        <Route path="/dashboard/recruiter" element={<DashboardRecruiter />} />
        <Route path="/post-job" element={<PostJob />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App