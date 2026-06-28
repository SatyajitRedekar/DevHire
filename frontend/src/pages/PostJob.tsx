import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'

function PostJob() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  const [formData, setFormData] = useState({
    title: '',
    company: '', // Start empty
    location: '',
    salary: '',
    experience: '',
    skills: '',
    description: ''
  })

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'RECRUITER') {
      navigate('/login')
      return
    }

    async function loadCompanyProfile() {
      try {
        const profData = await api.get(`/profiles/recruiter/${currentUser.id}`)
        if (profData && profData.companyName) {
          setFormData(prev => ({ ...prev, company: profData.companyName }))
        }
      } catch (err) {
        console.error('Failed to load company profile for job post', err)
      }
    }
    
    loadCompanyProfile()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    try {
      const formattedLocation = formData.location
        .trim()
        .split(',')
        .map(segment => 
          segment
            .trim()
            .split(/\s+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
        )
        .join(', ')

      const newJob = {
        title: formData.title,
        company: formData.company,
        location: formattedLocation,
        salary: formData.salary,
        experience: formData.experience,
        skills: formData.skills.split(',').map(s => s.trim()),
        description: formData.description,
        recruiter_id: currentUser.id
      }
      
      await api.post('/jobs', newJob)
      navigate('/dashboard/recruiter')
    } catch (err: any) {
      console.error(err)
      alert('Failed to post job')
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden pb-20">
      <Navbar />

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pt-24 relative z-10 animate-fade-in-up">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-4">Post a New Job</h1>
          <p className="text-lg text-slate-500 font-medium">Find the perfect candidate for your open role.</p>
        </div>

        <div className="glass bg-white/70 rounded-[2.5rem] border border-white/60 p-8 md:p-12 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Job Title */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Job Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full px-5 py-3.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Company */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Company Name</label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={e => setFormData({...formData, company: e.target.value})}
                  placeholder="e.g. TechCorp"
                  className="w-full px-5 py-3.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Location */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  placeholder="e.g. Pune, Remote"
                  className="w-full px-5 py-3.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Salary */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Salary Package</label>
                <input
                  type="text"
                  required
                  value={formData.salary}
                  onChange={e => setFormData({...formData, salary: e.target.value})}
                  placeholder="e.g. 10-15 LPA"
                  className="w-full px-5 py-3.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Experience */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Required Experience</label>
                <input
                  type="text"
                  required
                  value={formData.experience}
                  onChange={e => setFormData({...formData, experience: e.target.value})}
                  placeholder="e.g. 2-4 years"
                  className="w-full px-5 py-3.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>

              {/* Skills */}
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Key Skills (comma separated)</label>
                <input
                  type="text"
                  required
                  value={formData.skills}
                  onChange={e => setFormData({...formData, skills: e.target.value})}
                  placeholder="e.g. React, Node.js, TypeScript"
                  className="w-full px-5 py-3.5 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-sm font-bold text-slate-700 mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Job Description</label>
              <textarea
                required
                rows={5}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Describe the responsibilities, requirements, and benefits..."
                className="w-full px-5 py-4 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm resize-y"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4 mt-4 pt-6 border-t border-slate-200/50">
              <button
                type="button"
                onClick={() => navigate('/dashboard/recruiter')}
                className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                Publish Job Post
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  )
}

export default PostJob