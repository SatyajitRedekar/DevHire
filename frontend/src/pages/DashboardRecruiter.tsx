import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'

function DashboardRecruiter() {
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')

  const [myJobs, setMyJobs] = useState<any[]>([])
  const [receivedApps, setReceivedApps] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>({
    totalJobs: 0,
    totalApplicants: 0,
    statusBreakdown: { APPLIED: 0, SHORTLISTED: 0, SELECTED: 0, REJECTED: 0 },
    topJobs: []
  })

  // State for expanded cover note
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({})

  // Recruiter Profile state
  const [profile, setProfile] = useState<any>({ companyName: '', companyWebsite: '', industry: '' })
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [formCompany, setFormCompany] = useState('')
  const [formWebsite, setFormWebsite] = useState('')
  const [formIndustry, setFormIndustry] = useState('')

  useEffect(() => {
    if (!currentUser || currentUser.role !== 'RECRUITER') {
      navigate('/login')
      return
    }

    fetchRecruiterData()
  }, [])

  async function fetchRecruiterData() {
    try {
      // 1. Fetch recruiter jobs
      const jobsData = await api.get(`/jobs/recruiter/${currentUser.id}`)
      if (jobsData) setMyJobs(jobsData)

      // 2. Fetch applications (detailed)
      const appsData = await api.get(`/applications/recruiter/${currentUser.id}`)
      if (appsData) setReceivedApps(appsData)

      // 3. Fetch recruiter analytics
      const analyticsData = await api.get(`/applications/recruiter/${currentUser.id}/analytics`)
      if (analyticsData) setAnalytics(analyticsData)

      // 4. Fetch recruiter profile
      try {
        const profData = await api.get(`/profiles/recruiter/${currentUser.id}`)
        if (profData) {
          setProfile(profData)
          setFormCompany(profData.companyName || '')
          setFormWebsite(profData.companyWebsite || '')
          setFormIndustry(profData.industry || '')
        }
      } catch (profileErr) {
        console.error('Failed to fetch recruiter profile', profileErr)
      }
    } catch (err) {
      console.error('Failed to fetch recruiter dashboard data', err)
    }
  }

  async function handleUpdateStatus(appId: number, status: string) {
    try {
      const response = await api.put(`/applications/${appId}/status`, { status })
      if (response) {
        // Refresh local lists and analytics
        fetchRecruiterData()
      }
    } catch (err) {
      console.error('Failed to update status', err)
      alert('Failed to update application status')
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    try {
      const updated = await api.put(`/profiles/recruiter/${currentUser.id}`, {
        company_name: formCompany,
        company_website: formWebsite,
        industry: formIndustry
      })
      if (updated) {
        setProfile(updated)
        setIsEditingProfile(false)
        fetchRecruiterData()
      }
    } catch (err) {
      console.error('Failed to save profile', err)
      alert('Failed to save profile details')
    }
  }

  const toggleNote = (id: number) => {
    setExpandedNotes(prev => ({ ...prev, [id]: !prev[id] }))
  }

  function badgeStyle(status: string) {
    const map: Record<string, string> = {
      APPLIED: 'bg-blue-100 text-blue-700 border-blue-200',
      SHORTLISTED: 'bg-amber-100 text-amber-700 border-amber-200',
      REJECTED: 'bg-red-100 text-red-700 border-red-200',
      SELECTED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    }
    return map[status] || map['APPLIED']
  }

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
            <p className="text-slate-500 font-medium mt-2">Manage your job postings, review analytics, and evaluate candidates.</p>
          </div>
          <button
            onClick={() => navigate('/post-job')}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Post New Job
          </button>
        </div>

        {/* Analytics Hub */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Active Jobs', value: analytics.totalJobs, color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100' },
            { label: 'Received Apps', value: analytics.totalApplicants, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
            { label: 'Shortlisted', value: analytics.statusBreakdown.SHORTLISTED || 0, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
            { label: 'Hired/Selected', value: analytics.statusBreakdown.HIRED || 0, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Rejected', value: analytics.statusBreakdown.REJECTED || 0, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
          ].map(stat => (
            <div key={stat.label} className={`rounded-2xl border p-5 text-center shadow-sm transition-transform hover:-translate-y-0.5 bg-white border-slate-100`}>
              <p className={`text-3xl font-extrabold font-heading mb-0.5 ${stat.color}`}>{stat.value}</p>
              <p className="text-xxs font-bold uppercase tracking-wider text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Profile & Top Jobs Analytics) */}
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

            {/* Company Profile Card */}
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-8 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold font-heading text-slate-900">Company Profile</h3>
                {!isEditingProfile && (
                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="text-indigo-600 font-bold hover:text-indigo-700 text-sm transition-colors"
                  >
                    Edit
                  </button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={formCompany}
                      onChange={e => setFormCompany(e.target.value)}
                      placeholder="e.g. TechCorp"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Website URL</label>
                    <input
                      type="text"
                      value={formWebsite}
                      onChange={e => setFormWebsite(e.target.value)}
                      placeholder="e.g. https://techcorp.com"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Industry</label>
                    <input
                      type="text"
                      value={formIndustry}
                      onChange={e => setFormIndustry(e.target.value)}
                      placeholder="e.g. Software, E-Commerce"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      type="submit"
                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm transition-colors"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditingProfile(false)
                        setFormCompany(profile.companyName || '')
                        setFormWebsite(profile.companyWebsite || '')
                        setFormIndustry(profile.industry || '')
                      }}
                      className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Company Name</p>
                    <p className="text-slate-800 font-semibold text-sm">{profile.companyName || 'Not Set'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Website</p>
                    {profile.companyWebsite ? (
                      <a href={profile.companyWebsite} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-semibold text-sm hover:underline">
                        {profile.companyWebsite}
                      </a>
                    ) : (
                      <p className="text-slate-800 font-semibold text-sm">Not Set</p>
                    )}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Industry</p>
                    <p className="text-slate-800 font-semibold text-sm">{profile.industry || 'Not Set'}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Top Applied Jobs Analytics */}
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-8 shadow-xl">
              <h3 className="text-xl font-bold font-heading text-slate-900 mb-4 flex items-center gap-2">
                <span>📈</span> Top Applied Jobs
              </h3>
              {analytics.topJobs?.length === 0 ? (
                <p className="text-slate-400 text-xs italic py-4 text-center">No active postings yet.</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {analytics.topJobs.map((j: any) => (
                    <div key={j.id} className="p-3 bg-white rounded-xl border border-slate-100 flex justify-between items-center shadow-sm">
                      <div className="max-w-[70%]">
                        <p className="font-bold text-slate-800 text-xs truncate">{j.title}</p>
                        <p className="text-slate-400 font-medium text-xxs truncate">{j.location}</p>
                      </div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-xxs font-extrabold">
                        {j.applicants_count} Apps
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Column (Applicants & Jobs) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            
            {/* Detailed Applicant Evaluation Workspace */}
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-6 md:p-8 shadow-xl flex-1">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zzm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                  <h3 className="text-2xl font-bold font-heading text-slate-900">Applicant Workspace</h3>
                </div>
              </div>

              {receivedApps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <span className="text-4xl mb-4">👥</span>
                  <p className="text-slate-500 font-medium">No candidate applications received yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {receivedApps.map(app => {
                    const skillsList = app.skills
                      ? app.skills.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0)
                      : []
                    const isExpanded = !!expandedNotes[app.id]

                    return (
                      <div key={app.id} className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-4">
                        {/* Upper Section */}
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{app.seeker_name}</h4>
                            <p className="text-xs font-semibold text-indigo-600 mt-0.5">{app.job_title}</p>
                            <p className="text-xxs font-medium text-slate-400">{app.seeker_email}</p>
                            {app.headline && (
                              <p className="text-xxs font-bold text-slate-500 mt-2 italic bg-slate-50 px-2 py-0.5 rounded border border-slate-100 inline-block">
                                "{app.headline}"
                              </p>
                            )}
                          </div>
                          
                          <div className="flex flex-col items-end gap-2">
                            <span className={`px-2.5 py-1 text-xxs font-mono font-bold rounded-lg border ${
                              app.match_score >= 80 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                                : app.match_score >= 50 
                                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                                  : 'bg-rose-50 text-rose-700 border-rose-200'
                            }`}>
                              Score: {app.match_score}%
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xxs font-bold uppercase border ${badgeStyle(app.status)}`}>
                              {app.status}
                            </span>
                          </div>
                        </div>

                        {/* Experience & Skills */}
                        <div className="flex flex-col gap-2">
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xxs font-bold text-slate-400 uppercase">
                            <span>Experience: <span className="text-slate-700 lowercase">{app.experience_years ? `${app.experience_years} year(s)` : '0 years'}</span></span>
                            {app.matched_skills && (
                              <span>Matched: <span className="text-emerald-600 font-semibold normal-case">{app.matched_skills}</span></span>
                            )}
                            {app.missing_skills && (
                              <span>Missing: <span className="text-rose-500 font-semibold normal-case">{app.missing_skills}</span></span>
                            )}
                          </div>
                          {skillsList.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {skillsList.map((skill: string) => (
                                <span key={skill} className="px-2 py-0.5 bg-slate-50 border border-slate-100 text-slate-600 rounded font-medium text-xxs">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Cover Note Section */}
                        {app.cover_note && (
                          <div className="border-t border-slate-100 pt-3">
                            <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleNote(app.id)}>
                              <p className="text-xxs font-bold text-slate-400 uppercase">Cover Note</p>
                              <span className="text-indigo-600 text-xxs font-bold hover:underline">
                                {isExpanded ? 'Hide' : 'Show'}
                              </span>
                            </div>
                            {isExpanded && (
                              <p className="text-slate-600 text-xs mt-2 bg-slate-50 p-3 rounded-lg border border-slate-100/60 leading-relaxed font-medium">
                                {app.cover_note}
                              </p>
                            )}
                          </div>
                        )}

                        {/* Actions Toggle */}
                        {app.status === 'APPLIED' && (
                          <div className="flex gap-2 border-t border-slate-100 pt-3">
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'SHORTLISTED')}
                              className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xxs font-bold transition-colors shadow-sm"
                            >
                              Shortlist
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'HIRED')}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xxs font-bold transition-colors shadow-sm"
                            >
                              Select / Hire
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                              className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xxs font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                        
                        {app.status === 'SHORTLISTED' && (
                          <div className="flex gap-2 border-t border-slate-100 pt-3">
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'HIRED')}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xxs font-bold transition-colors shadow-sm"
                            >
                              Select / Hire
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                              className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-lg text-xxs font-bold transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* My Active Jobs Table */}
            <div className="glass bg-white/70 rounded-[2rem] border border-white/60 p-6 md:p-8 shadow-xl">
              <div className="mb-6 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <h3 className="text-2xl font-bold font-heading text-slate-900">My Posted Jobs</h3>
                </div>
              </div>

              {myJobs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <h3 className="text-sm font-bold text-slate-900 mb-1">No jobs posted yet</h3>
                  <button
                    onClick={() => navigate('/post-job')}
                    className="mt-2 px-4 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 font-bold text-xs shadow-sm transition-colors"
                  >
                    Post a Job
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-xxs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60">Job Details</th>
                        <th className="px-4 py-3 text-xxs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 text-center">Applicants</th>
                        <th className="px-4 py-3 text-xxs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myJobs.map(job => {
                        const jobApps = receivedApps.filter(a => a.job_id === job.id).length
                        return (
                          <tr key={job.id} className="hover:bg-white/50 transition-colors group">
                            <td className="px-4 py-4">
                              <p className="font-bold text-slate-900 text-xs truncate max-w-[150px]">{job.title}</p>
                              <p className="text-xxs font-medium text-slate-500 truncate max-w-[150px]">{job.location}</p>
                            </td>
                            <td className="px-4 py-4 text-center">
                              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                                {jobApps}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-right">
                              <button 
                                onClick={() => navigate(`/jobs/${job.id}`)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xxs transition-colors"
                              >
                                View
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

          </div>
          
        </div>
      </div>
    </div>
  )
}

export default DashboardRecruiter