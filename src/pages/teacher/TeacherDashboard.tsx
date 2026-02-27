import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Award, FileQuestion, Eye, Plus, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { courses, students, studentActivityData, homeworkSubmissions, viewExtensionRequests, testUnlockRequests, type ViewExtensionRequest, type TestUnlockRequest } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Courses', icon: BookOpen },
  { label: 'Students', icon: Users },
  { label: 'Grades', icon: Award },
  { label: 'Requests', icon: FileQuestion },
];

const teacherStudents = [
  { id: 's1', name: 'Ali Mohamed', avatar: 'AM', lessonsCompleted: 3, avgScore: 82, lastActive: 'Today', status: 'Active' as const },
  { id: 's2', name: 'Fatma Ibrahim', avatar: 'FI', lessonsCompleted: 4, avgScore: 88, lastActive: 'Yesterday', status: 'Active' as const },
  { id: 's4', name: 'Nour Ahmed', avatar: 'NA', lessonsCompleted: 2, avgScore: 71, lastActive: '2 days ago', status: 'Active' as const },
  { id: 's6', name: 'Khaled Omar', avatar: 'KO', lessonsCompleted: 4, avgScore: 85, lastActive: 'Today', status: 'Active' as const },
  { id: 's8', name: 'Tarek Hosny', avatar: 'TH', lessonsCompleted: 1, avgScore: 55, lastActive: '1 week ago', status: 'Inactive' as const },
  { id: 's10', name: 'Hassan Magdy', avatar: 'HM', lessonsCompleted: 2, avgScore: 68, lastActive: '3 days ago', status: 'Active' as const },
];

const gradesData = [
  { student: 'Ali Mohamed', homework: 85, entryTest: 82, reviewTest: 78, overall: 82 },
  { student: 'Fatma Ibrahim', homework: 88, entryTest: 91, reviewTest: 85, overall: 88 },
  { student: 'Nour Ahmed', homework: 70, entryTest: 65, reviewTest: 72, overall: 69 },
  { student: 'Khaled Omar', homework: 92, entryTest: 76, reviewTest: 88, overall: 85 },
  { student: 'Tarek Hosny', homework: 45, entryTest: 52, reviewTest: null as number | null, overall: 49 },
  { student: 'Hassan Magdy', homework: 72, entryTest: 68, reviewTest: 70, overall: 70 },
];

export default function TeacherDashboard() {
  const [tab, setTab] = useState('Overview');
  const { user, center } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [yearTab, setYearTab] = useState(1);
  const [requestTab, setRequestTab] = useState<'view' | 'test'>('view');
  const [viewRequests, setViewRequests] = useState<ViewExtensionRequest[]>(viewExtensionRequests);
  const [testRequests, setTestRequests] = useState<TestUnlockRequest[]>(testUnlockRequests);
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [entryTestEnabled, setEntryTestEnabled] = useState(false);

  const teacherCourses = courses.filter(c => c.teacherId === user?.id || c.teacherId === 'u6');
  const yearCourses = teacherCourses.filter(c => c.year === yearTab);

  const handleApproveView = (id: string) => {
    setViewRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r));
    toast({ title: 'Approved!', description: 'View extension granted. +3 views added.' });
  };
  const handleDenyView = (id: string) => {
    setViewRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Denied' as const } : r));
    toast({ title: 'Denied', description: 'View extension request denied.' });
  };
  const handleApproveTest = (id: string) => {
    setTestRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Approved' as const } : r));
    toast({ title: 'Approved!', description: 'Test unlock granted.' });
  };
  const handleDenyTest = (id: string) => {
    setTestRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'Denied' as const } : r));
    toast({ title: 'Denied', description: 'Test unlock request denied.' });
  };

  const scoreColor = (s: number | null) => {
    if (s === null) return 'text-muted-foreground';
    if (s >= 80) return 'text-status-active';
    if (s >= 60) return 'text-status-pending';
    return 'text-status-failed';
  };

  return (
    <DashboardLayout navItems={navItems} activeTab={tab} onTabChange={setTab} pageTitle={tab}>
      {tab === 'Overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="My Students" value={34} icon={Users} color="navy" />
            <StatCard title="Total Lessons" value={28} icon={BookOpen} color="blue" />
            <StatCard title="Pending Requests" value={viewRequests.filter(r => r.status === 'Pending').length + testRequests.filter(r => r.status === 'Pending').length} icon={FileQuestion} color="orange" />
            <StatCard title="Avg. Test Score" value="74%" icon={Award} color="green" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Student Activity — Past 30 Days</h3>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={studentActivityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="lessons" stroke="hsl(217,91%,53%)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Homework Submissions</h3>
              <div className="space-y-3">
                {homeworkSubmissions.map((h, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-foreground">{h.studentName}</p>
                      <p className="text-xs text-muted-foreground">{h.lesson} · {h.time}</p>
                    </div>
                    <StatusBadge status={h.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'My Courses' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              {[1, 2, 3].map(y => (
                <button key={y} onClick={() => setYearTab(y)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${yearTab === y ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  Year {y}
                </button>
              ))}
            </div>
            <button onClick={() => setAddLessonOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Add Lesson
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {yearCourses.map(c => (
              <div key={c.id} className="bg-card rounded-lg p-5 shadow-card border border-border hover:shadow-elevated transition cursor-pointer" onClick={() => navigate(`/teacher/courses/${c.id}`)}>
                <h4 className="font-semibold text-foreground mb-2">{c.title}</h4>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{c.lessonCount} lessons</span>
                  <span>{c.studentCount} students</span>
                </div>
                <button className="mt-3 text-sm text-secondary font-medium hover:underline">View →</button>
              </div>
            ))}
            {yearCourses.length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p>No courses for Year {yearTab}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'Students' && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-foreground mb-4">My Students</h2>
          <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lessons Completed</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Avg Score</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Last Active</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
              </tr></thead>
              <tbody>
                {teacherStudents.map(s => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition cursor-pointer" onClick={() => navigate(`/teacher/students/${s.id}`)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.avatar}</div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{s.lessonsCompleted}/4</td>
                    <td className="px-4 py-3"><span className={`font-semibold ${scoreColor(s.avgScore)}`}>{s.avgScore}%</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{s.lastActive}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Grades' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Grades</h2>
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition">Export</button>
          </div>
          <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Homework</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Entry Test</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Review Test</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Overall</th>
              </tr></thead>
              <tbody>
                {gradesData.map(g => (
                  <tr key={g.student} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{g.student}</td>
                    <td className="px-4 py-3"><span className={`font-semibold ${scoreColor(g.homework)}`}>{g.homework}%</span></td>
                    <td className="px-4 py-3"><span className={`font-semibold ${scoreColor(g.entryTest)}`}>{g.entryTest}%</span></td>
                    <td className="px-4 py-3"><span className={`font-semibold ${scoreColor(g.reviewTest)}`}>{g.reviewTest !== null ? `${g.reviewTest}%` : '—'}</span></td>
                    <td className="px-4 py-3"><span className={`font-bold ${scoreColor(g.overall)}`}>{g.overall}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Requests' && (
        <div className="animate-fade-in">
          <div className="flex gap-1 bg-muted rounded-lg p-1 mb-4 w-fit">
            <button onClick={() => setRequestTab('view')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${requestTab === 'view' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'}`}>
              View Extension ({viewRequests.filter(r => r.status === 'Pending').length})
            </button>
            <button onClick={() => setRequestTab('test')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${requestTab === 'test' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground'}`}>
              Test Unlock ({testRequests.filter(r => r.status === 'Pending').length})
            </button>
          </div>

          {requestTab === 'view' && (
            <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lesson</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Views</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Action</th>
                </tr></thead>
                <tbody>
                  {viewRequests.map(r => (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{r.studentName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.lesson}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.viewsUsed}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{r.reason}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                      <td className="px-4 py-3">
                        {r.status === 'Pending' ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleApproveView(r.id)} className="px-2.5 py-1 bg-status-active/10 text-status-active rounded text-xs font-medium hover:bg-status-active/20 transition">Approve</button>
                            <button onClick={() => handleDenyView(r.id)} className="px-2.5 py-1 bg-status-failed/10 text-status-failed rounded text-xs font-medium hover:bg-status-failed/20 transition">Deny</button>
                          </div>
                        ) : (
                          <StatusBadge status={r.status} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {requestTab === 'test' && (
            <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lesson</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Attempts</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Reason</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Action</th>
                </tr></thead>
                <tbody>
                  {testRequests.map(r => (
                    <tr key={r.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                      <td className="px-4 py-3 font-medium text-foreground">{r.studentName}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.lesson}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.attempts}</td>
                      <td className="px-4 py-3 text-muted-foreground text-xs max-w-[200px] truncate">{r.reason}</td>
                      <td className="px-4 py-3 text-muted-foreground">{r.date}</td>
                      <td className="px-4 py-3">
                        {r.status === 'Pending' ? (
                          <div className="flex gap-1">
                            <button onClick={() => handleApproveTest(r.id)} className="px-2.5 py-1 bg-status-active/10 text-status-active rounded text-xs font-medium hover:bg-status-active/20 transition">Approve</button>
                            <button onClick={() => handleDenyTest(r.id)} className="px-2.5 py-1 bg-status-failed/10 text-status-failed rounded text-xs font-medium hover:bg-status-failed/20 transition">Deny</button>
                          </div>
                        ) : (
                          <StatusBadge status={r.status} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Lesson Drawer */}
      {addLessonOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setAddLessonOpen(false)} />
          <div className="relative w-full max-w-md bg-card shadow-elevated animate-slide-in-right border-l border-border overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Add Lesson</h3>
              <button onClick={() => setAddLessonOpen(false)} className="p-1 rounded hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={e => { e.preventDefault(); toast({ title: 'Lesson Saved!', description: 'New lesson has been created.' }); setAddLessonOpen(false); }} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Lesson Title *</label>
                <input required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Academic Year</label>
                <select className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none">
                  <option>Year 1</option><option>Year 2</option><option>Year 3</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Video Upload</label>
                <input type="file" accept="video/*" className="text-sm text-muted-foreground" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Availability (days)</label>
                  <input type="number" defaultValue={14} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Max Views</label>
                  <input type="number" defaultValue={5} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={entryTestEnabled} onChange={e => setEntryTestEnabled(e.target.checked)} className="rounded" />
                  <span className="text-sm font-medium text-foreground">Enable Entry Test</span>
                </label>
              </div>
              {entryTestEnabled && (
                <div className="bg-muted rounded-lg p-4 space-y-3">
                  <p className="text-xs font-semibold text-foreground">Test Configuration</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Passing Score %</label>
                      <input type="number" defaultValue={60} className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Retake Interval (hrs)</label>
                      <input type="number" defaultValue={24} className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm" />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">Add up to 5 multiple-choice questions in the course editor.</p>
                </div>
              )}
              <button type="submit" className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">Save Lesson</button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
