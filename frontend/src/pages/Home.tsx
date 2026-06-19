import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

function Home() {
  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden font-sans">
      <Navbar />

      {/* Hero Section with animated blobs */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 flex flex-col items-center justify-center min-h-[90vh]">
        {/* Animated Background Elements */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-20 right-1/4 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center animate-fade-in-up">
          <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-semibold text-sm tracking-wide shadow-sm">
            🚀 The #1 Job Platform for Developers
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-heading text-slate-900 mb-8 leading-tight tracking-tight">
            Find Your Dream <br className="hidden md:block" />
            <span className="text-gradient">Developer Job</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
            Connect with top tech companies. Built by developers, for developers. Skip the noise and find a role you love.
          </p>

          {/* Search Bar - Glassmorphism */}
          <div className="glass p-2 rounded-2xl max-w-3xl mx-auto flex flex-col md:flex-row items-center gap-2 transform hover:scale-[1.01] transition-transform duration-300">
            <div className="flex-1 w-full flex items-center px-4 py-3 bg-white/50 rounded-xl">
              <svg className="w-6 h-6 text-slate-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input
                type="text"
                placeholder="Search by job title, skill, or company..."
                className="w-full bg-transparent outline-none text-slate-800 placeholder-slate-400 text-lg font-medium"
              />
            </div>
            <Link
              to="/jobs"
              className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300 flex items-center justify-center whitespace-nowrap"
            >
              Search Jobs
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-20 -mt-16 px-6">
        <div className="max-w-5xl mx-auto glass rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row justify-around items-center gap-8 divide-y md:divide-y-0 md:divide-x divide-slate-200/50">
          <div className="text-center w-full">
            <p className="text-5xl font-extrabold text-blue-600 font-heading mb-2">1,000+</p>
            <p className="text-slate-500 font-medium text-lg">Active Jobs</p>
          </div>
          <div className="text-center w-full pt-8 md:pt-0">
            <p className="text-5xl font-extrabold text-indigo-600 font-heading mb-2">500+</p>
            <p className="text-slate-500 font-medium text-lg">Companies Hiring</p>
          </div>
          <div className="text-center w-full pt-8 md:pt-0">
            <p className="text-5xl font-extrabold text-purple-600 font-heading mb-2">10k+</p>
            <p className="text-slate-500 font-medium text-lg">Developers Placed</p>
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 mb-6 tracking-tight">
              Why Choose DevHire?
            </h2>
            <p className="text-xl text-slate-500 max-w-2xl mx-auto">
              Everything you need to accelerate your tech career or find your next 10x engineer.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-blue-100 transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🎯</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mb-4">For Job Seekers</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Browse curated developer jobs, apply with one click, and track your application status in real-time. No more ghosting.</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🏢</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mb-4">For Recruiters</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Post jobs, manage applicants seamlessly, and find the right developer talent fast with smart filtering tools.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-purple-100 transform hover:-translate-y-2 transition-all duration-300 group">
              <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-300">
                <span className="text-3xl">🚀</span>
              </div>
              <h3 className="text-2xl font-bold font-heading text-slate-900 mb-4">For Companies</h3>
              <p className="text-slate-600 leading-relaxed text-lg">Build your elite tech team with verified developers. Scale your hiring process effortlessly with DevHire.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Skills */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 mb-10">Trending Skills</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {['React', 'Java', 'Spring Boot', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'GraphQL', 'PostgreSQL', 'Next.js', 'Go'].map(skill => (
              <span
                key={skill}
                className="px-6 py-3 bg-slate-50 text-slate-700 border border-slate-200 rounded-full font-semibold font-mono text-sm hover:bg-blue-600 hover:text-white hover:border-blue-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/20 cursor-pointer transition-all duration-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] opacity-50"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto text-center glass-dark p-12 md:p-20 rounded-[3rem]">
          <h2 className="text-4xl md:text-5xl font-extrabold font-heading text-white mb-6">Ready to accelerate your career?</h2>
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">Join thousands of developers and companies already building the future with DevHire.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <Link
              to="/register"
              className="px-8 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg hover:bg-slate-50 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Create Free Account
            </Link>
            <Link
              to="/jobs"
              className="px-8 py-4 bg-transparent border-2 border-white/20 text-white rounded-xl font-bold text-lg hover:bg-white/10 hover:border-white/40 transition-all duration-300"
            >
              Browse Jobs Now
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-400 py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="text-2xl font-bold font-heading text-white mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-blue-600 to-indigo-600 rounded flex items-center justify-center text-xs font-sans">D</span>
              Dev<span className="text-blue-500">Hire</span>
            </p>
            <p className="text-sm">Built for developers, by developers.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">GitHub</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-slate-800 text-sm text-center md:text-left flex flex-col md:flex-row justify-between">
          <p>© 2025 DevHire. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0 justify-center">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home