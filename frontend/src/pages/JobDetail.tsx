import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'

function JobDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
  const [job, setJob] = useState<any>(null)
  const [alreadyApplied, setAlreadyApplied] = useState(false)
  const [similarJobs, setSimilarJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      setLoading(true)
      try {
        const jobData = await api.get(`/jobs/${id}`)
        if (jobData) {
          setJob(jobData)
          
          // Fetch similar jobs by filtering all jobs (excluding current)
          const allJobs = await api.get('/jobs')
          if (allJobs) {
            const filtered = allJobs.filter((j: any) => String(j.id) !== String(id)).slice(0, 3)
            setSimilarJobs(filtered)
          }

          if (currentUser) {
            const hasApplied = await api.get(`/applications/check?seekerId=${currentUser.id}&jobId=${id}`)
            if (hasApplied) setAlreadyApplied(true)
          }
        }
      } catch (err) {
        console.error('Failed to load job details', err)
      }
      setLoading(false)
    }
    loadData()
  }, [id])

  async function handleApply() {
    if (!currentUser) {
      navigate('/login')
      return
    }

    if (alreadyApplied) return

    try {
      await api.post('/applications', {
        user_id: currentUser.id,
        job_id: job.id,
        status: 'APPLIED'
      })
      navigate('/dashboard/seeker')
    } catch (err) {
      console.error('Failed to apply', err)
      alert('Failed to apply. You may have already applied.')
    }
  }

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center font-bold text-slate-500">Loading job details...</div>

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative pb-20">
      <Navbar />

      {/* Header Banner */}
      <div className="relative bg-slate-900 pt-32 pb-24 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-blue-600/20 mix-blend-screen filter blur-[100px] transform rotate-12"></div>
          <div className="absolute bottom-[-50%] left-[-10%] w-[50%] h-[150%] bg-indigo-600/20 mix-blend-screen filter blur-[100px] transform -rotate-12"></div>
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBoNDBWMEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0wIDQwaDQwVjBIMHoiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10 animate-fade-in-up">
          <div className="flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex gap-6 items-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl shrink-0 border border-white/20">
                <span className="text-4xl md:text-5xl font-extrabold font-heading text-blue-600 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600">
                  {job.company.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white tracking-tight mb-3">{job.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-slate-300 font-medium text-lg">
                  <span className="text-white font-bold">{job.company}</span>
                  <span className="w-1.5 h-1.5 bg-slate-600 rounded-full"></span>
                  <span className="flex items-center"><svg className="w-5 h-5 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>{job.location}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-start md:items-end w-full md:w-auto mt-4 md:mt-0">
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold px-5 py-2.5 rounded-xl text-xl md:text-2xl mb-4 backdrop-blur-sm">
                {job.salary}
              </span>
              {currentUser?.role !== 'RECRUITER' && (
                <button
                  onClick={handleApply}
                  disabled={alreadyApplied}
                  className={`w-full md:w-auto px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl flex items-center justify-center gap-2 ${
                    alreadyApplied
                      ? 'bg-emerald-500 text-white shadow-emerald-500/30 cursor-not-allowed'
                      : 'bg-white text-blue-600 hover:bg-slate-50 hover:-translate-y-1 hover:shadow-white/20'
                  }`}
                >
                  {alreadyApplied ? (
                    <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Application Submitted</>
                  ) : (
                    'Apply for this role'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20 flex flex-col lg:flex-row gap-8">

        {/* Main Content */}
        <div className="flex-1 flex flex-col gap-8 animate-fade-in-up animation-delay-2000">

          {/* Quick Stats */}
          <div className="glass bg-white/80 rounded-3xl p-8 border border-white/60 shadow-xl flex flex-wrap gap-8 justify-around items-center divide-x divide-slate-200/50">
            <div className="px-4 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Experience</p>
              <p className="text-xl font-bold text-slate-800">{job.experience}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Posted On</p>
              <p className="text-xl font-bold text-slate-800">{new Date(job.posted_date || job.postedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div className="px-4 text-center">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Job Type</p>
              <p className="text-xl font-bold text-slate-800">Full Time</p>
            </div>
          </div>

          {/* Job Description & Requirements */}
          <div className="bg-white rounded-3xl border border-slate-200/60 p-8 md:p-12 shadow-sm">
            
            <div className="mb-10">
              <h2 className="text-2xl font-extrabold font-heading text-slate-900 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-sm">📝</span>
                About the Role
              </h2>
              <p className="text-slate-600 leading-relaxed text-lg">{job.description}</p>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-extrabold font-heading text-slate-900 mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-sm">✨</span>
                Required Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-4 py-2 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-bold text-sm shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-4">What you'll need</h3>
              <ul className="space-y-3">
                {job.skills.map((skill: string) => (
                  <li key={skill} className="flex items-start">
                    <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    <span className="text-slate-600 text-lg">Strong professional experience with <strong className="text-slate-800">{skill}</strong> in production environments.</span>
                  </li>
                ))}
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-slate-600 text-lg">Excellent problem-solving skills and ability to communicate complex technical concepts.</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-6 h-6 text-emerald-500 mr-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  <span className="text-slate-600 text-lg">Experience working collaboratively in agile cross-functional teams.</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-4">Key Responsibilities</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="w-2 h-2 mt-2.5 mr-4 bg-blue-600 rounded-full shrink-0"></div>
                  <span className="text-slate-600 text-lg">Design, develop, and maintain high-performance scalable applications.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 mt-2.5 mr-4 bg-blue-600 rounded-full shrink-0"></div>
                  <span className="text-slate-600 text-lg">Collaborate tightly with product managers, designers, and other engineers.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 mt-2.5 mr-4 bg-blue-600 rounded-full shrink-0"></div>
                  <span className="text-slate-600 text-lg">Write clean, maintainable code and participate rigorously in code reviews.</span>
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 mt-2.5 mr-4 bg-blue-600 rounded-full shrink-0"></div>
                  <span className="text-slate-600 text-lg">Debug production issues across services and multiple levels of the stack.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Sidebar - Similar Jobs */}
        <div className="w-full lg:w-80 shrink-0 animate-fade-in-up animation-delay-4000">
          <div className="glass bg-white/70 rounded-3xl border border-white/60 p-6 lg:p-8 sticky top-28 shadow-xl">
            <h3 className="text-xl font-extrabold font-heading text-slate-900 mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
              Similar Roles
            </h3>
            
            {similarJobs.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No similar jobs found right now.</p>
            ) : (
              <div className="flex flex-col gap-4">
                {similarJobs.map(j => (
                  <div
                    key={j.id}
                    onClick={() => {
                      navigate(`/jobs/${j.id}`);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
                  >
                    <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors leading-tight">{j.title}</h4>
                    <p className="text-sm font-medium text-slate-500 mb-3">{j.company}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">{j.location.split(',')[0]}</span>
                      <span className="text-sm font-mono font-bold text-emerald-600">{j.salary}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => navigate('/jobs')}
              className="w-full mt-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              View All Jobs <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default JobDetail