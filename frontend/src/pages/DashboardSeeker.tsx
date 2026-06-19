import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'

function DashboardSeeker() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  const [applications, setApplications] = useState<any[]>([])

  useEffect(() => {
    if (!currentUser) {
      navigate('/login')
      return
    }
    
    async function fetchApps() {
      try {
        const data = await api.get(`/applications/seeker/${currentUser.id}`)
        if (data) setApplications(data)
      } catch (err) {
        console.error('Failed to fetch applications', err)
      }
    }
    fetchApps()
  }, [])

  const statusCount = (status: string) =>
    applications.filter(a => a.status === status).length

  function badgeStyle(status: string) {
    const map: Record<string, string> = {
      APPLIED: 'bg-blue-100/80 text-blue-700 border-blue-200',
      SHORTLISTED: 'bg-amber-100/80 text-amber-700 border-amber-200',
      REJECTED: 'bg-red-100/80 text-red-700 border-red-200',
      SELECTED: 'bg-emerald-100/80 text-emerald-700 border-emerald-200',
    }
    return map[status] || map['APPLIED']
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative overflow-hidden pb-20">
      <Navbar />

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
        <div className="absolute top-[40%] right-[10%] w-[25%] h-[25%] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 relative z-10 animate-fade-in-up">
        
        {/* Header Section */}
        <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-900 tracking-tight">Candidate Dashboard</h1>
            <p className="text-slate-500 font-medium mt-2">Manage your job applications and profile.</p>
          </div>
          <button
            onClick={() => navigate('/jobs')}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            Explore More Jobs
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Profile & Stats) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            
            {/* Profile Card */}
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-8 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center shadow-inner mb-4 relative group-hover:scale-105 transition-transform">
                  <span className="text-4xl font-extrabold font-heading text-blue-600 bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600">
                    {currentUser?.name?.charAt(0)}
                  </span>
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-2 border-white rounded-full"></div>
                </div>
                <h2 className="text-2xl font-bold font-heading text-slate-900">{currentUser?.name}</h2>
                <p className="text-slate-500 font-medium mb-4">{currentUser?.email}</p>
                <span className="px-4 py-1.5 bg-slate-900 text-white rounded-full text-xs font-bold tracking-wider uppercase shadow-md">
                  Job Seeker
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Total Applied', value: applications.length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
                { label: 'Shortlisted', value: statusCount('SHORTLISTED'), color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
                { label: 'Selected', value: statusCount('SELECTED'), color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { label: 'Rejected', value: statusCount('REJECTED'), color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
              ].map(stat => (
                <div key={stat.label} className={`rounded-3xl border p-6 text-center shadow-sm transition-transform hover:-translate-y-1 ${stat.bg} ${stat.border}`}>
                  <p className={`text-4xl font-extrabold font-heading mb-1 ${stat.color}`}>{stat.value}</p>
                  <p className={`text-xs font-bold uppercase tracking-wider ${stat.color} opacity-80`}>{stat.label}</p>
                </div>
              ))}
            </div>

          </div>

          {/* Right Column (Applications Table) */}
          <div className="lg:col-span-2">
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-2 md:p-8 shadow-xl h-full flex flex-col">
              <div className="p-4 md:p-0 mb-6 flex items-center gap-3">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
                <h3 className="text-2xl font-bold font-heading text-slate-900">Application History</h3>
              </div>

              {applications.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <span className="text-4xl">📋</span>
                  </div>
                  <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">No applications yet</h3>
                  <p className="text-slate-500 font-medium mb-6">You haven't applied to any jobs. Start exploring!</p>
                  <button
                    onClick={() => navigate('/jobs')}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 font-bold text-sm shadow-md transition-colors"
                  >
                    Browse Jobs
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto pb-4">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60">Role / Company</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60">Date Applied</th>
                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applications.map(app => {
                        const job = app.job
                        return (
                          <tr key={app.id} className="hover:bg-white/50 transition-colors group cursor-pointer" onClick={() => navigate(`/jobs/${app.job_id || app.jobId}`)}>
                            <td className="px-6 py-5">
                              <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{job?.title || 'Unknown Role'}</p>
                              <p className="text-sm font-medium text-slate-500">{job?.company || '-'}</p>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-medium text-slate-600">
                                {new Date(app.applied_date || app.appliedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </p>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold border shadow-sm ${badgeStyle(app.status)}`}>
                                {app.status === 'APPLIED' && <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                {app.status === 'SHORTLISTED' && <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>}
                                {app.status === 'SELECTED' && <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                {app.status === 'REJECTED' && <svg className="w-3 h-3 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}

export default DashboardSeeker