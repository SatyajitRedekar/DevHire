import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import Navbar from '../components/Navbar'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleLogin() {
    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    try {
      const data = await api.post('/auth/login', { email, password })

      if (!data || !data.user) {
        setError('Invalid email or password')
        return
      }

      localStorage.setItem('currentUser', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)

      if (data.user.role === 'RECRUITER') {
        navigate('/dashboard/recruiter')
      } else {
        navigate('/dashboard/seeker')
      }
    } catch (err: any) {
      console.error(err)
      setError('Invalid email or password')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans relative flex flex-col">
      <Navbar />

      {/* Animated Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-10 left-1/2 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="flex-1 flex justify-center items-center p-6 relative z-10 pt-24">
        
        <div className="w-full max-w-md">
          {/* Glassmorphism Card */}
          <div className="glass p-10 md:p-12 rounded-[2rem] shadow-2xl border border-white/50 backdrop-blur-xl animate-fade-in-up">
            
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30 mx-auto mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                <span className="text-white text-3xl leading-none">D</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">Welcome back</h2>
              <p className="text-slate-500 mt-2 font-medium">Log in to your DevHire account</p>
            </div>

            {error && (
              <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center animate-fade-in-up">
                <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                {error}
              </div>
            )}

            <div className="flex flex-col gap-5">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-1.5 ml-1 transition-colors group-focus-within:text-blue-600">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-slate-200/60 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex justify-between items-center mb-1.5 ml-1">
                  <label className="block text-sm font-bold text-slate-700 transition-colors group-focus-within:text-blue-600">Password</label>
                  <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-white/70 border border-slate-200/60 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleLogin}
                className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300"
              >
                Sign In to DevHire
              </button>
            </div>

            <p className="text-center text-slate-500 mt-8 font-medium">
              New to DevHire?{' '}
              <Link to="/register" className="text-blue-600 font-bold hover:underline">
                Create a free account
              </Link>
            </p>
          </div>

          {/* Test Credentials Footer Tooltip */}
          <div className="mt-8 mx-auto w-max px-6 py-4 glass bg-white/40 rounded-2xl border border-white/40 animate-fade-in-up animation-delay-2000 text-center shadow-lg">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2 opacity-70">Demo Credentials</p>
            <div className="flex gap-4 text-sm font-mono text-slate-600">
              <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <span className="font-semibold text-blue-600">Seeker:</span> satyajit@gmail.com / 1234
              </div>
              <div className="bg-white/60 px-3 py-1.5 rounded-lg border border-slate-200/50 shadow-sm">
                <span className="font-semibold text-indigo-600">Recruiter:</span> hr@techcorp.com / 1234
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default Login