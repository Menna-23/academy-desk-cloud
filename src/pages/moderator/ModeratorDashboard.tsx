import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, Link2, Activity, Plus, Eye, UserPlus, X, Copy, ArrowRight, ArrowLeft, Check, Search } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getStudentsForCenter, getTeachersForCenter, students as allStudents, studentsPerTeacher, moderatorActivities, users } from '@/data/mockData';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const CHART_COLORS = ['hsl(217,91%,53%)', 'hsl(216,57%,25%)', 'hsl(199,89%,48%)', 'hsl(142,71%,45%)', 'hsl(38,92%,50%)'];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Students', icon: Users },
  { label: 'Enrollments', icon: Link2 },
  { label: 'Activity', icon: Activity },
];

const EDUCATION_LEVELS = ['Primary', 'Preparatory', 'Secondary'];

export default function ModeratorDashboard() {
  const [tab, setTab] = useState('Overview');
  const { center, user: currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [teacherFilter, setTeacherFilter] = useState('all');
  const [addStudentOpen, setAddStudentOpen] = useState(false);
  const [addStudentStep, setAddStudentStep] = useState(1);
  const [studentForm, setStudentForm] = useState({ name: '', email: '', phone: '', educationLevel: 'Secondary', parentPhone: '' });
  const [selectedTeachers, setSelectedTeachers] = useState<string[]>([]);
  const [addTeacherModal, setAddTeacherModal] = useState<string | null>(null); // student id

  const studentList = getStudentsForCenter(center?.id || '');
  const allTeachers = getTeachersForCenter(center?.id || '');

  // Get teachers assigned to this moderator
  const moderatorUser = currentUser ? users.find(u => u.id === currentUser.id) : null;
  const assignedTeacherIds = moderatorUser?.assignedTeachers || [];
  const assignedTeachers = allTeachers.filter(t => assignedTeacherIds.includes(t.id));
  const displayTeachers = assignedTeachers.length > 0 ? assignedTeachers : allTeachers;

  const filtered = studentList.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchTeacher = teacherFilter === 'all' || s.enrolledTeachers.includes(teacherFilter);
    return matchSearch && matchTeacher;
  });

  const generatedUsername = studentForm.name ? studentForm.name.toLowerCase().replace(/\s+/g, '.') + '.2026' : '';
  const generatedPassword = `Edu#${Math.floor(1000 + Math.random() * 9000)}`;

  const handleCreateStudent = () => {
    toast({ title: 'Student Created!', description: 'Student account created. Share credentials with the student.' });
    setAddStudentOpen(false);
    setAddStudentStep(1);
    setStudentForm({ name: '', email: '', phone: '', educationLevel: 'Secondary', parentPhone: '' });
    setSelectedTeachers([]);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'Copied to clipboard.' });
  };

  const handleAddTeacherToStudent = (studentId: string, teacherId: string) => {
    toast({ title: 'Teacher Assigned!', description: `Teacher assigned to student successfully.` });
    setAddTeacherModal(null);
  };

  const scoreColor = (s: number) => {
    if (s >= 80) return 'text-status-active';
    if (s >= 60) return 'text-status-pending';
    return 'text-status-failed';
  };

  return (
    <DashboardLayout navItems={navItems} activeTab={tab} onTabChange={setTab} pageTitle={tab}>
      {tab === 'Overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="My Students" value={87} icon={Users} color="navy" />
            <StatCard title="Active Enrollments" value={124} icon={Link2} color="blue" />
            <StatCard title="Pending Requests" value={3} icon={Activity} color="orange" />
            <StatCard title="New This Month" value={11} icon={UserPlus} color="green" />
          </div>

          {/* Assigned Teachers */}
          {assignedTeachers.length > 0 && (
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-3">My Assigned Teachers</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {assignedTeachers.map(t => (
                  <div key={t.id} className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.subject}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Students per Teacher</h3>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={studentsPerTeacher} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {studentsPerTeacher.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Recently Added Students</h3>
              <table className="w-full text-sm">
                <tbody>
                  {studentList.slice(0, 5).map(s => (
                    <tr key={s.id} className="border-b border-border last:border-0">
                      <td className="py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">{s.avatar}</div>
                          <span className="font-medium text-foreground">{s.name}</span>
                        </div>
                      </td>
                      <td className="py-2 text-muted-foreground text-xs">{s.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'Students' && (
        <div className="animate-fade-in">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search students..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
                />
              </div>
              <select
                value={teacherFilter}
                onChange={e => setTeacherFilter(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
              >
                <option value="all">All Teachers</option>
                {displayTeachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <button onClick={() => { setAddStudentOpen(true); setAddStudentStep(1); }} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Add Student
            </button>
          </div>
          <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Education Level</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Teachers</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Subjects</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">AVG. Score</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Missing Days</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Joined</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{s.avatar}</div>
                        <span className="font-medium text-foreground">{s.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{s.educationLevel}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {s.enrolledTeachers.map(tid => displayTeachers.find(t => t.id === tid)?.name || allTeachers.find(t => t.id === tid)?.name || tid).join(', ')}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{s.subjects.join(', ')}</td>
                    <td className="px-4 py-3"><span className={`font-semibold ${scoreColor(s.avgScore)}`}>{s.avgScore}%</span></td>
                    <td className="px-4 py-3 text-muted-foreground">{s.missingDays}</td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{s.joinedDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => navigate(`/moderator/students/${s.id}`)} className="p-1.5 rounded hover:bg-muted transition" title="View"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => setAddTeacherModal(s.id)} className="p-1.5 rounded hover:bg-muted transition" title="Add Teacher"><UserPlus className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Enrollments' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Enrollment Records</h2>
            <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition">Export CSV</button>
          </div>
          <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Student</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Teacher</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date Enrolled</th>
              </tr></thead>
              <tbody>
                {studentList.flatMap(s => s.enrolledTeachers.map((tid, i) => {
                  const teacher = allTeachers.find(t => t.id === tid);
                  return (
                    <tr key={`${s.id}-${tid}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                      <td className="px-4 py-3 font-medium text-foreground">{s.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{teacher?.name || 'Unknown'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.subjects[i] || teacher?.subject || ''}</td>
                      <td className="px-4 py-3 text-muted-foreground">{s.joinedDate}</td>
                    </tr>
                  );
                }))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Activity' && (
        <div className="animate-fade-in">
          <h2 className="text-lg font-semibold text-foreground mb-4">Activity Timeline</h2>
          <div className="bg-card rounded-lg p-5 shadow-card border border-border">
            <div className="space-y-4">
              {moderatorActivities.map(a => (
                <div key={a.id} className="flex items-start gap-4 relative">
                  <div className="w-3 h-3 rounded-full bg-secondary mt-1 flex-shrink-0 ring-4 ring-card" />
                  <div>
                    <p className="text-sm text-foreground">{a.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Teacher to Student Modal */}
      {addTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setAddTeacherModal(null)} />
          <div className="relative w-full max-w-sm bg-card rounded-xl shadow-elevated border border-border animate-fade-in">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Assign Teacher</h3>
              <button onClick={() => setAddTeacherModal(null)} className="p-1 rounded hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-4 space-y-2">
              <p className="text-xs text-muted-foreground mb-3">Select a teacher to assign to this student.</p>
              {displayTeachers.map(t => {
                const student = studentList.find(s => s.id === addTeacherModal);
                const alreadyAssigned = student?.enrolledTeachers.includes(t.id);
                return (
                  <button
                    key={t.id}
                    disabled={alreadyAssigned}
                    onClick={() => handleAddTeacherToStudent(addTeacherModal, t.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition flex items-center gap-3 ${alreadyAssigned ? 'border-border bg-muted/50 opacity-50 cursor-not-allowed' : 'border-border hover:bg-muted/50 cursor-pointer'}`}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.subject}</p>
                    </div>
                    {alreadyAssigned && <span className="ml-auto text-xs text-muted-foreground">Already assigned</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Add Student Multi-Step Drawer */}
      {addStudentOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setAddStudentOpen(false)} />
          <div className="relative w-full max-w-md bg-card shadow-elevated animate-slide-in-right border-l border-border flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Add Student — Step {addStudentStep} of 3</h3>
              <button onClick={() => setAddStudentOpen(false)} className="p-1 rounded hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            {/* Progress */}
            <div className="flex gap-1 px-5 pt-4">
              {[1, 2, 3].map(s => (
                <div key={s} className={`h-1 flex-1 rounded-full ${s <= addStudentStep ? 'bg-secondary' : 'bg-muted'}`} />
              ))}
            </div>

            <div className="p-5 flex-1 overflow-auto">
              {addStudentStep === 1 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Personal Information</h4>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name *</label>
                    <input value={studentForm.name} onChange={e => setStudentForm(f => ({ ...f, name: e.target.value }))} required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email *</label>
                    <input type="email" value={studentForm.email} onChange={e => setStudentForm(f => ({ ...f, email: e.target.value }))} required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Phone Number</label>
                    <input value={studentForm.phone} onChange={e => setStudentForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Education Level *</label>
                    <select value={studentForm.educationLevel} onChange={e => setStudentForm(f => ({ ...f, educationLevel: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none">
                      {EDUCATION_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Parent Phone Number</label>
                    <input value={studentForm.parentPhone} onChange={e => setStudentForm(f => ({ ...f, parentPhone: e.target.value }))} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" placeholder="+20 ..." />
                  </div>
                </div>
              )}
              {addStudentStep === 2 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Assign Teachers</h4>
                  <p className="text-xs text-muted-foreground">Select at least one teacher.</p>
                  <div className="space-y-2">
                    {displayTeachers.map(t => (
                      <label key={t.id} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${selectedTeachers.includes(t.id) ? 'border-secondary bg-accent' : 'border-border hover:bg-muted/50'}`}>
                        <input
                          type="checkbox"
                          checked={selectedTeachers.includes(t.id)}
                          onChange={() => setSelectedTeachers(prev => prev.includes(t.id) ? prev.filter(x => x !== t.id) : [...prev, t.id])}
                          className="rounded border-border"
                        />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.subject}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}
              {addStudentStep === 3 && (
                <div className="space-y-4">
                  <h4 className="font-medium text-foreground">Confirm & Generate Credentials</h4>
                  <div className="bg-muted rounded-lg p-4 space-y-2 text-sm">
                    <p><span className="text-muted-foreground">Name:</span> <span className="font-medium text-foreground">{studentForm.name}</span></p>
                    <p><span className="text-muted-foreground">Email:</span> <span className="font-medium text-foreground">{studentForm.email}</span></p>
                    <p><span className="text-muted-foreground">Phone:</span> <span className="font-medium text-foreground">{studentForm.phone || 'N/A'}</span></p>
                    <p><span className="text-muted-foreground">Education Level:</span> <span className="font-medium text-foreground">{studentForm.educationLevel}</span></p>
                    <p><span className="text-muted-foreground">Parent Phone:</span> <span className="font-medium text-foreground">{studentForm.parentPhone || 'N/A'}</span></p>
                    <p><span className="text-muted-foreground">Teachers:</span> <span className="font-medium text-foreground">{selectedTeachers.map(id => displayTeachers.find(t => t.id === id)?.name || allTeachers.find(t => t.id === id)?.name).join(', ')}</span></p>
                  </div>
                  <div className="bg-accent rounded-lg p-4 space-y-3">
                    <p className="text-xs font-semibold text-accent-foreground">Generated Credentials</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Username</p>
                        <p className="font-mono text-sm text-foreground">{generatedUsername}</p>
                      </div>
                      <button onClick={() => copyToClipboard(generatedUsername)} className="p-1.5 rounded hover:bg-muted transition"><Copy className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Password</p>
                        <p className="font-mono text-sm text-foreground">{generatedPassword}</p>
                      </div>
                      <button onClick={() => copyToClipboard(generatedPassword)} className="p-1.5 rounded hover:bg-muted transition"><Copy className="w-3.5 h-3.5 text-muted-foreground" /></button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-5 border-t border-border flex gap-3">
              {addStudentStep > 1 && (
                <button onClick={() => setAddStudentStep(s => s - 1)} className="flex-1 py-2.5 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition flex items-center justify-center gap-1">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              {addStudentStep < 3 ? (
                <button
                  onClick={() => setAddStudentStep(s => s + 1)}
                  disabled={addStudentStep === 1 ? !studentForm.name || !studentForm.email : selectedTeachers.length === 0}
                  className="flex-1 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center gap-1"
                >
                  Next <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleCreateStudent} className="flex-1 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center justify-center gap-1">
                  <Check className="w-4 h-4" /> Create Account
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
