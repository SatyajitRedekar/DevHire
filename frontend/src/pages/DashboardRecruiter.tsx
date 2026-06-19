import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'

function DashboardRecruiter() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  const [myJobs, setMyJobs] = useState<any[]>([])
  const [receivedApps, setReceivedApps] = useState<any[]>([])

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'RECRUITER') {
      navigate('/login')
      return
    }

    async function fetchData() {
      try {
        const jobsData = await api.get(`/jobs/recruiter/${currentUser.id}`)
        if (jobsData) {
          setMyJobs(jobsData)
        }

        const appsData = await api.get(`/applications/recruiter/${currentUser.id}`)
        if (appsData) {
          setReceivedApps(appsData)
        }
      } catch (err) {
        console.error('Failed to fetch recruiter dashboard data', err)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden pb-20">
      <Navbar />

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
        <div className="absolute top-[40%] left-[10%] w-[25%] h-[25%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 relative z-10 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">Recruiter Dashboard</h1>
            <p className="text-slate-500 font-medium mt-2">Manage your job postings and review candidates.</p>
          </div>
          <button
            onClick={() => navigate('/post-job')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Post New Job
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Profile & Stats) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Profile Card */}
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-inner mb-4 relative group-hover:scale-105 transition-transform">
                  <span className="text-4xl font-extrabold font-heading text-indigo-600 bg-clip-text text-transparent bg-gradient-to-br from-indigo-600 to-purple-600">
                    {currentUser?.name?.charAt(0)}
                  </span>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900">{currentUser?.name}</h2>
                <p className="text-slate-500 font-medium mb-4">{currentUser?.email}</p>
                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                  Recruiter
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl border p-6 text-center shadow-sm transition-transform hover:-translate-y-1 bg-indigo-50 border-indigo-100">
                <p className="text-4xl font-extrabold font-heading mb-1 text-indigo-600">{myJobs.length}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 opacity-80">Jobs Posted</p>
              </div>
              <div className="rounded-3xl border p-6 text-center shadow-sm transition-transform hover:-translate-y-1 bg-purple-50 border-purple-100">
                <p className="text-4xl font-extrabold font-heading mb-1 text-purple-600">{receivedApps.length}</p>
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600 opacity-80">Applications</p>
              </div>
            </div>

          </div>

          {/* Right Column (My Jobs Table) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-2 md:p-8 shadow-xl flex-1 flex flex-col">
              <div className="p-4 md:p-0 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <h3 className="text-2xl font-bold font-heading text-slate-900">My Active Jobs</h3>
                </div>
              </div>

              {myJobs.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <span className="text-4xl">🏢</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">No jobs posted yet</h3>
                  <p className="text-slate-500 font-medium mb-6">Create your first job listing to start receiving applications.</p>
                  <button
                    onClick={() => navigate('/post-job')}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 font-bold text-sm shadow-md transition-colors"
                  >
                    Post a Job
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60">Job Title / Location</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 text-center">Applicants</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myJobs.map(job => {
                        const jobApps = receivedApps.filter(a => (a.job_id || a.jobId) === job.id).length
                        return (
                          <tr key={job.id} className="hover:bg-white/50 transition-colors group">
                            <td className="px-6 py-5">
                              <p className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{job.title}</p>
                              <p className="text-sm font-medium text-slate-500 flex items-center mt-1">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                {job.location}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-center">
                              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm">
                                {jobApps}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button 
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors shadow-sm"
                              >
                                View Job
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Recent Applications Preview */}
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-2 md:p-8 shadow-xl flex-1 flex flex-col">
              <div className="p-4 md:p-0 mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <h3 className="text-2xl font-bold font-heading text-slate-900">Recent Applications</h3>
                </div>
              </div>

              {receivedApps.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                  <p className="text-slate-500 font-medium">No applications received yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {receivedApps.slice(0, 3).map(app => {
                    const applicant = app.user || { name: 'Applicant' }
                    const job = app.job
                    return (
                      <div key={app.id} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
                        <div>
                          <p className="font-bold text-slate-900">{applicant.name}</p>
                          <p className="text-sm font-medium text-slate-500">Applied for: <span className="text-indigo-600">{job?.title}</span></p>
                        </div>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                          {app.status}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

          </div>
          
        </div>
      </div>
    </div>
  )
}

export default DashboardRecruiter