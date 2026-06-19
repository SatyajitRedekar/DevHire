import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  function handleLogout() {
    localStorage.removeItem('currentUser')
    navigate('/')
  }

  return (
    <nav className="fixed top-0 w-full z-50 glass border-b border-white/40 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold font-heading flex items-center gap-1 group">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-blue-500/30 transition-all duration-300 transform group-hover:-translate-y-0.5">
            <span className="text-white text-lg leading-none mt-0.5">D</span>
          </div>
          <span className="text-slate-900 tracking-tight">Dev<span className="text-blue-600">Hire</span></span>
        </Link>

        {/* Center Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-slate-600 hover:text-blue-600 font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
            Home
          </Link>
          <Link to="/jobs" className="text-slate-600 hover:text-blue-600 font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
            Jobs
          </Link>
          {currentUser?.role === 'RECRUITER' && (
            <Link to="/post-job" className="text-slate-600 hover:text-blue-600 font-medium transition-colors relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-0.5 after:bg-blue-600 after:transition-all hover:after:w-full">
              Post Job
            </Link>
          )}
        </div>

        {/* Right Buttons */}
        <div className="flex items-center gap-4">
          {currentUser ? (
            <>
              <Link
                to={currentUser.role === 'RECRUITER' ? '/dashboard/recruiter' : '/dashboard/seeker'}
                className="text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-5 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl font-medium transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 text-slate-600 hover:text-blue-600 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar