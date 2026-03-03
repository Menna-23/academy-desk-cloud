import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { students, getTeachersForCenter } from '@/data/mockData';
import { useState } from 'react';
import { LayoutDashboard, Link2, Activity } from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Students', icon: Users },
  { label: 'Enrollments', icon: Link2 },
  { label: 'Activity', icon: Activity },
];

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { center } = useAuth();
  const { toast } = useToast();
  const student = students.find(s => s.id === id);
  const teachers = getTeachersForCenter(center?.id || '');
  const [enrolledTeacherIds, setEnrolledTeacherIds] = useState(student?.enrolledTeachers || []);
  const [showAddTeacher, setShowAddTeacher] = useState(false);

  if (!student) return <div className="p-8 text-center text-muted-foreground">Student not found</div>;

  const enrolledTeachers = teachers.filter(t => enrolledTeacherIds.includes(t.id));
  const availableTeachers = teachers.filter(t => !enrolledTeacherIds.includes(t.id));

  const removeTeacher = (tid: string) => {
    setEnrolledTeacherIds(prev => prev.filter(x => x !== tid));
    toast({ title: 'Removed', description: 'Teacher removed from student enrollment.' });
  };

  const addTeacher = (tid: string) => {
    setEnrolledTeacherIds(prev => [...prev, tid]);
    setShowAddTeacher(false);
    toast({ title: 'Added!', description: 'Teacher assigned to student.' });
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeTab="Students"
      onTabChange={t => navigate('/moderator')}
      pageTitle=""
      breadcrumbs={[
        { label: 'Students', path: '/moderator' },
        { label: student.name },
      ]}
    >
      <div className="animate-fade-in space-y-6">
        <button onClick={() => navigate('/moderator')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>

        {/* Student Info */}
        <div className="bg-card rounded-lg p-6 shadow-card border border-border flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{student.avatar}</div>
          <div className="space-y-1 flex-1">
            <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
            <p className="text-sm text-muted-foreground">@{student.username}</p>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>{student.phone}</span>
              <span>Joined {student.joinedDate}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-1">
              <span><span className="font-medium text-foreground">Education Level:</span> {student.academicLevel} – {student.academicYear} Year</span>
              <span><span className="font-medium text-foreground">Parent Phone:</span> {student.parentPhone}</span>
            </div>
          </div>
        </div>

        {/* Enrolled Teachers */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-foreground">Enrolled Teachers</h3>
            <div className="relative">
              <button onClick={() => setShowAddTeacher(!showAddTeacher)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
                <Plus className="w-3.5 h-3.5" /> Add Teacher
              </button>
              {showAddTeacher && availableTeachers.length > 0 && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-card border border-border rounded-lg shadow-elevated z-10 py-1">
                  {availableTeachers.map(t => (
                    <button key={t.id} onClick={() => addTeacher(t.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition text-foreground">
                      {t.name} — {t.subject}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {enrolledTeachers.map(t => (
              <div key={t.id} className="bg-card rounded-lg p-4 shadow-card border border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.subject}</p>
                  </div>
                </div>
                <button onClick={() => removeTeacher(t.id)} className="p-1.5 rounded hover:bg-destructive/10 transition" title="Remove">
                  <Trash2 className="w-3.5 h-3.5 text-destructive" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Enrollment History */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">Enrollment History</h3>
          <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Teacher</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Subject</th>
                <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Date Enrolled</th>
              </tr></thead>
              <tbody>
                {enrolledTeachers.map(t => (
                  <tr key={t.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{t.name}</td>
                    <td className="px-4 py-3 text-muted-foreground">{t.subject}</td>
                    <td className="px-4 py-3 text-muted-foreground">{student.joinedDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
