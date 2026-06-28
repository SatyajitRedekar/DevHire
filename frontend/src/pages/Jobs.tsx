import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { api } from '../lib/api'

function Jobs() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const jobsPerPage = 4

  const [jobs, setJobs] = useState<any[]>([])

  useEffect(() => {
    async function fetchJobs() {
      try {
        const data = await api.get('/jobs')
        if (data) setJobs(data)
      } catch (err) {
        console.error('Failed to fetch jobs', err)
      }
    }
    fetchJobs()
  }, [])

  const locations = [...new Set(jobs.map(j => {
    if (!j.location) return ''
    return j.location
      .trim()
      .split(',')
      .map((segment: string) => 
        segment
          .trim()
          .split(/\s+/)
          .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ')
      )
      .join(', ')
  }))].filter(Boolean)
  const skills = [...new Set(jobs.flatMap(j => j.skills))]

  const filtered = jobs.filter(job => {
    const matchSearch =
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
    const matchLocation = selectedLocation ? job.location === selectedLocation : true
    const matchSkill = selectedSkill ? job.skills.includes(selectedSkill) : true
    return matchSearch && matchLocation && matchSkill
  })

  const totalPages = Math.ceil(filtered.length / jobsPerPage)
  const paginated = filtered.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage)

  function handleApply(jobId: number) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null')
    if (!currentUser) {
      navigate('/login')
      return
    }
    navigate(`/jobs/${jobId}`)
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans relative">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30"></div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Search */}
          <div className="mb-10 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fade-in-up">
            <div>
              <h1 className="text-4xl md:text-5xl font-extrabold font-heading text-slate-900 tracking-tight mb-3">Explore Opportunities</h1>
              <p className="text-lg text-slate-500 font-medium">Find your next role at top tech companies.</p>
            </div>
            
            <div className="w-full md:w-[400px]">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <input
                  type="text"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value)
                    setCurrentPage(1)
                  }}
                  placeholder="Search titles or companies..."
                  className="w-full pl-12 pr-4 py-3.5 glass bg-white/60 border border-slate-200/60 rounded-2xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium text-slate-800 placeholder-slate-400 shadow-sm"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Filter Sidebar */}
            <div className="w-full lg:w-72 shrink-0 animate-fade-in-up animation-delay-2000">
              <div className="glass bg-white/60 rounded-3xl border border-white/60 p-6 sticky top-28 shadow-xl">
                <div className="flex items-center gap-2 mb-6">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                  <h3 className="font-extrabold font-heading text-lg text-slate-900 tracking-tight">Filters</h3>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Location</label>
                  <div className="relative">
                    <select
                      value={selectedLocation}
                      onChange={e => {
                        setSelectedLocation(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none font-medium text-slate-700 cursor-pointer shadow-sm transition-all"
                    >
                      <option value="">Any Location</option>
                      {locations.map(loc => (
                        <option key={loc} value={loc}>{loc}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Skills Filter */}
                <div className="mb-8">
                  <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Skill Requirement</label>
                  <div className="relative">
                    <select
                      value={selectedSkill}
                      onChange={e => {
                        setSelectedSkill(e.target.value)
                        setCurrentPage(1)
                      }}
                      className="w-full px-4 py-3 bg-white/80 border border-slate-200/60 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 appearance-none font-medium text-slate-700 cursor-pointer shadow-sm transition-all"
                    >
                      <option value="">Any Skill</option>
                      {skills.map(skill => (
                        <option key={skill} value={skill}>{skill}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => {
                    setSearch('')
                    setSelectedLocation('')
                    setSelectedSkill('')
                    setCurrentPage(1)
                  }}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold text-sm transition-colors shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            </div>

            {/* Job Cards */}
            <div className="flex-1 animate-fade-in-up animation-delay-4000">
              <div className="flex justify-between items-center mb-6">
                <p className="text-slate-500 font-medium bg-white/50 px-4 py-1.5 rounded-full inline-block backdrop-blur-sm border border-slate-200/50 shadow-sm text-sm">
                  Showing <span className="font-bold text-slate-800">{filtered.length}</span> open roles
                </p>
              </div>

              {paginated.length === 0 ? (
                <div className="glass bg-white/50 rounded-3xl p-16 text-center border border-white/60">
                  <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <span className="text-4xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 mb-2">No matches found</h3>
                  <p className="text-slate-500 font-medium">Try adjusting your filters or search terms.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {paginated.map((job) => (
                    <div
                      key={job.id}
                      className="group bg-white/80 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-6 md:p-8 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-5">
                        <div className="flex items-start gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-xl font-bold font-heading text-slate-500 shadow-inner shrink-0">
                            {job.company.charAt(0)}
                          </div>
                          <div>
                            <h2 className="text-xl md:text-2xl font-bold font-heading text-slate-900 group-hover:text-blue-600 transition-colors tracking-tight">{job.title}</h2>
                            <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                              <span className="text-slate-700 font-semibold">{job.company}</span>
                              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                              <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>{job.location}</span>
                            </p>
                          </div>
                        </div>
                        <div className="bg-green-50 text-green-700 border border-green-200/60 px-4 py-2 rounded-xl font-bold font-mono text-sm self-start md:self-auto shadow-sm whitespace-nowrap">
                          {job.salary}
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row md:items-end justify-between mt-6 gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill: string) => (
                              <span
                                key={skill}
                                className="px-3 py-1.5 bg-slate-100 text-slate-600 border border-slate-200 rounded-lg text-xs font-bold tracking-wide"
                              >
                                {skill}
                              </span>
                            ))}
                            <span className="px-3 py-1.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-xs font-bold tracking-wide flex items-center">
                              <svg className="w-3.5 h-3.5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                              {job.experience}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between md:justify-end gap-6 w-full md:w-auto">
                          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{new Date(job.posted_date || job.postedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                          <button
                            onClick={() => handleApply(job.id)}
                            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-blue-600 font-bold text-sm shadow-md transition-colors"
                          >
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-10">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => {
                        setCurrentPage(page);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={`w-10 h-10 rounded-xl font-bold text-sm transition-all duration-300 shadow-sm ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-blue-500/30'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}

export default Jobs