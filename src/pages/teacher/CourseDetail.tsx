import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { courses, lessons, lessonStats } from '@/data/mockData';
import { LayoutDashboard, BookOpen, Users, Award, FileQuestion } from 'lucide-react';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Courses', icon: BookOpen },
  { label: 'Students', icon: Users },
  { label: 'Grades', icon: Award },
  { label: 'Requests', icon: FileQuestion },
];

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);

  const course = courses.find(c => c.id === id);
  const courseLessons = lessons.filter(l => l.courseId === id);

  if (!course) return <div className="p-8 text-center text-muted-foreground">Course not found</div>;

  const openStats = (lessonId: string) => {
    setSelectedLesson(lessonId);
    setStatsModalOpen(true);
  };

  const getRowColor = (stat: typeof lessonStats[0]) => {
    if (stat.viewsUsed >= stat.maxViews) return 'bg-status-pending/5';
    if (stat.entryTest === 'Failed') return 'bg-status-failed/5';
    if (stat.progress >= 80) return 'bg-status-active/5';
    return '';
  };

  return (
    <DashboardLayout
      navItems={navItems}
      activeTab="My Courses"
      onTabChange={t => navigate('/teacher')}
      pageTitle=""
      breadcrumbs={[
        { label: 'My Courses', path: '/teacher' },
        { label: course.title },
      ]}
    >
      <div className="animate-fade-in space-y-6">
        <button onClick={() => navigate('/teacher')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> Back to Courses
        </button>

        <div className="bg-card rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-xl font-bold text-foreground mb-1">{course.title}</h2>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{courseLessons.length} lessons</span>
            <span>{course.studentCount} students enrolled</span>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-card border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground w-8">#</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Lesson Title</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Avg Progress</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Views</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Homework</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Entry Test</th>
              <th className="text-left px-4 py-3 font-semibold text-muted-foreground">Actions</th>
            </tr></thead>
            <tbody>
              {courseLessons.map(l => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition">
                  <td className="px-4 py-3 text-muted-foreground font-medium">{l.order}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{l.title}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-secondary rounded-full" style={{ width: `${l.avgProgress}%` }} />
                      </div>
                      <span className="text-muted-foreground text-xs">{l.avgProgress}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{l.avgViews} avg</td>
                  <td className="px-4 py-3 text-muted-foreground">{l.homeworkSubmitted}</td>
                  <td className="px-4 py-3"><StatusBadge status={l.entryTest} /></td>
                  <td className="px-4 py-3">
                    <button onClick={() => openStats(l.id)} className="inline-flex items-center gap-1 text-xs text-secondary font-medium hover:underline">
                      <BarChart2 className="w-3.5 h-3.5" /> Stats
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lesson Stats Modal */}
      {statsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setStatsModalOpen(false)} />
          <div className="relative w-full max-w-3xl bg-card rounded-xl shadow-elevated border border-border animate-fade-in max-h-[80vh] overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-card z-10">
              <h3 className="font-semibold text-card-foreground">Lesson Stats — {lessons.find(l => l.id === selectedLesson)?.title}</h3>
              <button onClick={() => setStatsModalOpen(false)} className="p-1 rounded hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Student</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Views</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Progress</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Last Watched</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Entry Test</th>
                  <th className="text-left px-3 py-2 font-semibold text-muted-foreground">Homework</th>
                </tr></thead>
                <tbody>
                  {lessonStats.map(s => (
                    <tr key={s.studentId} className={`border-b border-border last:border-0 ${getRowColor(s)}`}>
                      <td className="px-3 py-2 font-medium text-foreground">{s.studentName}</td>
                      <td className="px-3 py-2">
                        <span className={s.viewsUsed >= s.maxViews ? 'text-status-quota font-semibold' : 'text-muted-foreground'}>
                          {s.viewsUsed}/{s.maxViews} {s.viewsUsed >= s.maxViews && '⚠️'}
                        </span>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-secondary rounded-full" style={{ width: `${s.progress}%` }} />
                          </div>
                          <span className="text-xs text-muted-foreground">{s.progress}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground text-xs">{s.lastWatched}</td>
                      <td className="px-3 py-2">
                        <StatusBadge status={s.entryTest as any} />
                        {s.entryTestScore !== undefined && <span className="text-xs text-muted-foreground ml-1">({s.entryTestScore}%)</span>}
                      </td>
                      <td className="px-3 py-2"><StatusBadge status={s.homework as any} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
