import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { students, studentLessonProgress } from '@/data/mockData';
import { LayoutDashboard, BookOpen, Users, Award, FileQuestion } from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Courses', icon: BookOpen },
  { label: 'Students', icon: Users },
  { label: 'Grades', icon: Award },
  { label: 'Requests', icon: FileQuestion },
];

const scoreColor = (s: number | null) => {
  if (s === null) return 'text-muted-foreground';
  if (s >= 80) return 'text-status-active';
  if (s >= 60) return 'text-status-pending';
  return 'text-status-failed';
};

const resultIcon: Record<string, string> = {
  'Completed': '✓',
  'Passed': '✓',
  'Pending': '⏳',
  'Locked': '🔒',
};

export default function StudentProgress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const student = students.find(s => s.id === id);
  if (!student) return <div className="p-8 text-center text-muted-foreground">Student not found</div>;

  const avgScore = 82;
  const completionRate = 75;
  const submissionRate = 88;

  return (
    <DashboardLayout
      navItems={navItems}
      activeTab="Students"
      onTabChange={() => navigate('/teacher')}
      pageTitle=""
      breadcrumbs={[
        { label: 'Students', path: '/teacher' },
        { label: student.name },
      ]}
    >
      <div className="animate-fade-in space-y-6">
        <button onClick={() => navigate('/teacher')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>

        {/* Student header */}
        <div className="bg-card rounded-lg p-6 shadow-card border border-border flex items-start gap-5">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">{student.avatar}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${avgScore >= 80 ? 'bg-status-active/10 text-status-active' : avgScore >= 60 ? 'bg-status-pending/10 text-status-pending' : 'bg-status-failed/10 text-status-failed'}`}>
                Grade: {avgScore}%
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Enrolled {student.joinedDate}</p>
          </div>
        </div>

        {/* Overall stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-lg p-4 shadow-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{avgScore}%</p>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{completionRate}%</p>
            <p className="text-xs text-muted-foreground">Completion Rate</p>
          </div>
          <div className="bg-card rounded-lg p-4 shadow-card border border-border text-center">
            <p className="text-2xl font-bold text-foreground">{submissionRate}%</p>
            <p className="text-xs text-muted-foreground">Homework Submission</p>
          </div>
        </div>

        {/* Progress table */}
        <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lesson</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Watch %</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Views Used</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Entry Test</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Result</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Homework</th>
            </tr></thead>
            <tbody>
              {studentLessonProgress.map(l => (
                <tr key={l.lessonId} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium text-foreground">{l.lessonTitle}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${l.watchPercent}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{l.watchPercent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.viewsUsed}/{l.maxViews}</td>
                  <td className="px-4 py-3">
                    {l.entryTestScore !== null ? (
                      <span className={`font-semibold ${scoreColor(l.entryTestScore)}`}>{l.entryTestScore}%</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={l.result as any} />
                  </td>
                  <td className="px-4 py-3">
                    {l.homeworkGrade !== null ? (
                      <span className={`font-semibold ${scoreColor(l.homeworkGrade)}`}>{l.homeworkGrade}/100</span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
