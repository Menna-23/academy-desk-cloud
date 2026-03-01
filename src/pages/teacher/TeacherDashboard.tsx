import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, BookOpen, Users, Award, FileQuestion, Eye, Plus, X, Upload } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { subjects as allSubjects, students, studentActivityData, homeworkSubmissions, viewExtensionRequests, testUnlockRequests, type ViewExtensionRequest, type TestUnlockRequest } from '@/data/mockData';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Courses', icon: BookOpen },
  { label: 'Students', icon: Users },
  { label: 'Grades', icon: Award },
  { label: 'Requests', icon: FileQuestion },
];

const teacherStudents = [
  { id: 's1', name: 'Ali Mohamed', avatar: 'AM', lessonsCompleted: 3, avgScore: 82, lastActive: 'Today' },
  { id: 's2', name: 'Fatma Ibrahim', avatar: 'FI', lessonsCompleted: 4, avgScore: 88, lastActive: 'Yesterday' },
  { id: 's4', name: 'Nour Ahmed', avatar: 'NA', lessonsCompleted: 2, avgScore: 71, lastActive: '2 days ago' },
  { id: 's6', name: 'Khaled Omar', avatar: 'KO', lessonsCompleted: 4, avgScore: 85, lastActive: 'Today' },
  { id: 's8', name: 'Tarek Hosny', avatar: 'TH', lessonsCompleted: 1, avgScore: 55, lastActive: '1 week ago' },
  { id: 's10', name: 'Hassan Magdy', avatar: 'HM', lessonsCompleted: 2, avgScore: 68, lastActive: '3 days ago' },
];

const gradesData = [
  { student: 'Ali Mohamed', homework: 85, entryTest: 82, overall: 84 },
  { student: 'Fatma Ibrahim', homework: 88, entryTest: 91, overall: 90 },
  { student: 'Nour Ahmed', homework: 70, entryTest: 65, overall: 68 },
  { student: 'Khaled Omar', homework: 92, entryTest: 76, overall: 84 },
  { student: 'Tarek Hosny', homework: 45, entryTest: 52, overall: 49 },
  { student: 'Hassan Magdy', homework: 72, entryTest: 68, overall: 70 },
];

const ACADEMIC_LEVELS = ['Primary', 'Preparatory', 'Secondary'] as const;
const YEAR_OPTIONS: Record<string, string[]> = {
  'Primary': ['1', '2', '3', '4', '5', '6'],
  'Preparatory': ['1st', '2nd', '3rd'],
  'Secondary': ['1st', '2nd', '3rd'],
};

export default function TeacherDashboard() {
  const [tab, setTab] = useState('Overview');
  const { user, center } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [requestTab, setRequestTab] = useState<'view' | 'test'>('view');
  const [viewRequests, setViewRequests] = useState<ViewExtensionRequest[]>(viewExtensionRequests);
  const [testRequests, setTestRequests] = useState<TestUnlockRequest[]>(testUnlockRequests);
  const [addSubjectOpen, setAddSubjectOpen] = useState(false);
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [entryTestEnabled, setEntryTestEnabled] = useState(false);
  const [subjectForm, setSubjectForm] = useState({ title: '', academicLevel: 'Primary' as string, academicYear: '1' });
  const [activeLevel, setActiveLevel] = useState<string>('all');

  const teacherSubjects = allSubjects.filter(s => s.teacherId === user?.id || s.teacherId === 'u6');

  const levels = ['Primary', 'Preparatory', 'Secondary'];
  const filteredSubjects = activeLevel === 'all' ? teacherSubjects : teacherSubjects.filter(s => s.academicLevel === activeLevel);
  const groupedSubjects = levels.reduce((acc, level) => {
    const subs = filteredSubjects.filter(s => s.academicLevel === level);
    if (subs.length > 0) acc[level] = subs;
    return acc;
  }, {} as Record<string, typeof teacherSubjects>);

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

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Subject Added!', description: `${subjectForm.title} has been created.` });
    setAddSubjectOpen(false);
    setSubjectForm({ title: '', academicLevel: 'Primary', academicYear: '1' });
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
                    <span className="text-xs font-medium text-secondary">{h.status}</span>
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
              <button onClick={() => setActiveLevel('all')} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeLevel === 'all' ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                All
              </button>
              {levels.map(l => (
                <button key={l} onClick={() => setActiveLevel(l)} className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${activeLevel === l ? 'bg-secondary text-secondary-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
                  {l}
                </button>
              ))}
            </div>
            <button onClick={() => setAddSubjectOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Add Subject
            </button>
          </div>

          {Object.keys(groupedSubjects).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p>No subjects found</p>
            </div>
          ) : (
            Object.entries(groupedSubjects).map(([level, subs]) => (
              <div key={level} className="mb-6">
                <h3 className="text-md font-semibold text-foreground mb-3">{level}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subs.map(s => (
                    <div key={s.id} className="bg-card rounded-lg p-5 shadow-card border border-border hover:shadow-elevated transition cursor-pointer" onClick={() => navigate(`/teacher/courses/c1`)}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-secondary/10 text-secondary">{s.academicLevel} — Year {s.academicYear}</span>
                      </div>
                      <h4 className="font-semibold text-foreground mb-2">{s.title}</h4>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{s.lessonCount} lessons</span>
                        <span>{s.studentCount} students</span>
                      </div>
                      <button className="mt-3 text-sm text-secondary font-medium hover:underline">View →</button>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
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
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Overall</th>
              </tr></thead>
              <tbody>
                {gradesData.map(g => (
                  <tr key={g.student} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{g.student}</td>
                    <td className="px-4 py-3"><span className={`font-semibold ${scoreColor(g.homework)}`}>{g.homework}%</span></td>
                    <td className="px-4 py-3"><span className={`font-semibold ${scoreColor(g.entryTest)}`}>{g.entryTest}%</span></td>
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

      {/* Add Subject Drawer */}
      {addSubjectOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setAddSubjectOpen(false)} />
          <div className="relative w-full max-w-md bg-card shadow-elevated animate-slide-in-right border-l border-border overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Add Subject</h3>
              <button onClick={() => setAddSubjectOpen(false)} className="p-1 rounded hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleAddSubject} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Subject Title *</label>
                <input value={subjectForm.title} onChange={e => setSubjectForm(f => ({ ...f, title: e.target.value }))} required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Academic Level *</label>
                <select value={subjectForm.academicLevel} onChange={e => { setSubjectForm(f => ({ ...f, academicLevel: e.target.value, academicYear: YEAR_OPTIONS[e.target.value][0] })); }} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none">
                  {ACADEMIC_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Academic Year *</label>
                <select value={subjectForm.academicYear} onChange={e => setSubjectForm(f => ({ ...f, academicYear: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none">
                  {YEAR_OPTIONS[subjectForm.academicLevel]?.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">Create Subject</button>
            </form>
          </div>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1">Attachment Upload</label>
                <div className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg bg-muted/30">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <input type="file" className="text-sm text-muted-foreground flex-1" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Upload any file (PDF, video, doc, etc.)</p>
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
                <label className="block text-sm font-medium text-muted-foreground mb-1">Homework Attachment</label>
                <div className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg bg-muted/30">
                  <Upload className="w-4 h-4 text-muted-foreground" />
                  <input type="file" className="text-sm text-muted-foreground flex-1" />
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
                  <div>
                    <label className="block text-xs text-muted-foreground mb-1">Upload Test Form</label>
                    <div className="flex items-center gap-2 p-2 border border-dashed border-border rounded-lg bg-background">
                      <Upload className="w-3.5 h-3.5 text-muted-foreground" />
                      <input type="file" className="text-xs text-muted-foreground flex-1" />
                    </div>
                  </div>
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
