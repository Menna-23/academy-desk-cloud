import { useState } from 'react';
import { LayoutDashboard, Users, Shield, BarChart3, Settings, Plus, Pencil, Eye, ToggleLeft, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatCard from '@/components/StatCard';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { getUsersForCenter, adminActivities, enrollmentBySubject, monthlyEnrollments, studentsPerTeacher, subjectPassRates } from '@/data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend } from 'recharts';

const CHART_COLORS = ['hsl(217,91%,53%)', 'hsl(216,57%,25%)', 'hsl(199,89%,48%)', 'hsl(142,71%,45%)', 'hsl(38,92%,50%)'];

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Teachers', icon: Users },
  { label: 'Moderators', icon: Shield },
  { label: 'Reports', icon: BarChart3 },
  { label: 'Settings', icon: Settings },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview');
  const { center } = useAuth();
  const { toast } = useToast();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'teacher' | 'moderator'>('teacher');
  const [editingUser, setEditingUser] = useState<any>(null);

  const teachers = getUsersForCenter(center?.id || '', 'teacher');
  const moderators = getUsersForCenter(center?.id || '', 'moderator');
  const [teacherList, setTeacherList] = useState(teachers);
  const [modList, setModList] = useState(moderators);

  const openDrawer = (type: 'teacher' | 'moderator', user?: any) => {
    setDrawerType(type);
    setEditingUser(user || null);
    setDrawerOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: editingUser ? 'Updated!' : 'Created!', description: `${drawerType === 'teacher' ? 'Teacher' : 'Moderator'} account ${editingUser ? 'updated' : 'created'} successfully.` });
    setDrawerOpen(false);
  };

  const toggleStatus = (id: string, list: 'teacher' | 'moderator') => {
    if (list === 'teacher') {
      setTeacherList(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'Active' ? 'Inactive' as const : 'Active' as const } : t));
    } else {
      setModList(prev => prev.map(m => m.id === id ? { ...m, status: m.status === 'Active' ? 'Inactive' as const : 'Active' as const } : m));
    }
    toast({ title: 'Status Updated', description: 'User status has been changed.' });
  };

  return (
    <DashboardLayout navItems={navItems} activeTab={tab} onTabChange={setTab} pageTitle={tab}>
      {tab === 'Overview' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard title="Total Teachers" value={teacherList.length} icon={Users} color="navy" />
            <StatCard title="Total Moderators" value={modList.length} icon={Shield} color="blue" />
            <StatCard title="Total Students" value={center?.totalStudents || 0} icon={Users} color="green" />
            <StatCard title="Active Courses" value={18} icon={BarChart3} color="orange" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Enrollment per Subject</h3>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={enrollmentBySubject}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="students" fill="hsl(217,91%,53%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Activity</h3>
              <div className="space-y-3">
                {adminActivities.map(a => (
                  <div key={a.id} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-1.5 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-card-foreground">{a.text}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'Teachers' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Teachers</h2>
            <button onClick={() => openDrawer('teacher')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Add Teacher
            </button>
          </div>
          <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Students</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Courses</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {teacherList.map(t => (
                  <tr key={t.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                        <span className="font-medium text-foreground">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{t.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.studentCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.courseCount}</td>
                    <td className="px-4 py-3"><StatusBadge status={t.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openDrawer('teacher', t)} className="p-1.5 rounded hover:bg-muted transition" title="Edit"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => toggleStatus(t.id, 'teacher')} className="p-1.5 rounded hover:bg-muted transition" title="Toggle Status"><ToggleLeft className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button className="p-1.5 rounded hover:bg-muted transition" title="View Profile"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Moderators' && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Moderators</h2>
            <button onClick={() => openDrawer('moderator')} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
              <Plus className="w-4 h-4" /> Add Moderator
            </button>
          </div>
          <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Students Managed</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Last Active</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
              </tr></thead>
              <tbody>
                {modList.map(m => (
                  <tr key={m.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{m.avatar}</div>
                        <span className="font-medium text-foreground">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{m.studentsManaged}</td>
                    <td className="px-4 py-3 text-muted-foreground">{m.lastActive}</td>
                    <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => openDrawer('moderator', m)} className="p-1.5 rounded hover:bg-muted transition"><Pencil className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button onClick={() => toggleStatus(m.id, 'moderator')} className="p-1.5 rounded hover:bg-muted transition"><ToggleLeft className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        <button className="p-1.5 rounded hover:bg-muted transition"><Eye className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Reports' && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Monthly New Enrollments</h3>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={monthlyEnrollments}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="hsl(217,91%,53%)" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-card rounded-lg p-5 shadow-card border border-border">
              <h3 className="text-sm font-semibold text-card-foreground mb-4">Students per Teacher</h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={studentsPerTeacher} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {studentsPerTeacher.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="bg-card rounded-lg p-5 shadow-card border border-border">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Subject Pass Rates</h3>
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Subject</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Enrolled</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Passed</th>
                <th className="text-left px-4 py-2 font-semibold text-muted-foreground">Pass Rate</th>
              </tr></thead>
              <tbody>
                {subjectPassRates.map(s => (
                  <tr key={s.subject} className="border-b border-border last:border-0">
                    <td className="px-4 py-2 font-medium text-foreground">{s.subject}</td>
                    <td className="px-4 py-2 text-muted-foreground">{s.enrolled}</td>
                    <td className="px-4 py-2 text-muted-foreground">{s.passed}</td>
                    <td className="px-4 py-2">
                      <span className={`font-semibold ${s.rate >= 80 ? 'text-status-active' : s.rate >= 60 ? 'text-status-pending' : 'text-status-failed'}`}>{s.rate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'Settings' && (
        <div className="max-w-2xl animate-fade-in">
          <div className="bg-card rounded-lg p-6 shadow-card border border-border space-y-5">
            <h3 className="text-lg font-semibold text-card-foreground">Institution Profile</h3>
            <form onSubmit={e => { e.preventDefault(); toast({ title: 'Saved!', description: 'Settings updated.' }); }} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Institution Name</label>
                  <input defaultValue={center?.name} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Contact Email</label>
                  <input defaultValue={center?.email} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Address</label>
                  <input defaultValue={center?.address} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                  <input defaultValue={center?.phone} className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Logo</label>
                <input type="file" accept="image/*" className="text-sm text-muted-foreground" />
              </div>
              <button type="submit" className="px-6 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">Save Changes</button>
            </form>
          </div>
          <div className="bg-card rounded-lg p-6 shadow-card border border-border mt-6">
            <h3 className="text-lg font-semibold text-card-foreground mb-3">Subscription</h3>
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-semibold text-foreground">{center?.plan}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expires</p>
                <p className="font-semibold text-foreground">{center?.planExpiry}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-card shadow-elevated animate-slide-in-right border-l border-border">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-card-foreground">{editingUser ? 'Edit' : 'Add'} {drawerType === 'teacher' ? 'Teacher' : 'Moderator'}</h3>
              <button onClick={() => setDrawerOpen(false)} className="p-1 rounded hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
                <input defaultValue={editingUser?.name || ''} required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                <input type="email" defaultValue={editingUser?.email || ''} required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
              </div>
              {drawerType === 'teacher' && (
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                  <input defaultValue={editingUser?.subject || ''} required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                </div>
              )}
              {!editingUser && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Password</label>
                    <input type="password" required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Confirm Password</label>
                    <input type="password" required className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none" />
                  </div>
                </>
              )}
              <button type="submit" className="w-full py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
                {editingUser ? 'Update' : 'Create Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
