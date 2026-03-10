import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart2, X, Plus, Upload, PenLine, Sparkles } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { courses, lessons, lessonStats } from '@/data/mockData';
import { LayoutDashboard, BookOpen, Users, Award, FileQuestion } from 'lucide-react';
import TestQuestionCard, { type TestQuestion, type QuestionType, emptyQuestion } from '@/components/teacher/TestQuestionCard';
import AITestGenerator from '@/components/teacher/AITestGenerator';

const navItems = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'My Courses', icon: BookOpen },
  { label: 'Students', icon: Users },
  { label: 'Grades', icon: Award },
  { label: 'Requests', icon: FileQuestion },
];

type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
}

const emptyQuestion = (): TestQuestion => ({
  id: crypto.randomUUID(),
  type: 'multiple_choice',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
});

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [statsModalOpen, setStatsModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [addLessonOpen, setAddLessonOpen] = useState(false);
  const [entryTestEnabled, setEntryTestEnabled] = useState(false);
  const [testQuestions, setTestQuestions] = useState<TestQuestion[]>([emptyQuestion()]);
  const [passingScore, setPassingScore] = useState(60);
  const [retakeInterval, setRetakeInterval] = useState(24);

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

  const addQuestion = () => {
    setTestQuestions(prev => [...prev, emptyQuestion()]);
  };

  const removeQuestion = (qId: string) => {
    setTestQuestions(prev => prev.filter(q => q.id !== qId));
  };

  const updateQuestion = (qId: string, updates: Partial<TestQuestion>) => {
    setTestQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const updated = { ...q, ...updates };
      // Reset options/correctAnswer when type changes
      if (updates.type) {
        if (updates.type === 'true_false') {
          updated.options = ['True', 'False'];
          updated.correctAnswer = '';
        } else if (updates.type === 'short_answer') {
          updated.options = [];
          updated.correctAnswer = '';
        } else {
          updated.options = q.options.length < 2 ? ['', '', '', ''] : q.options;
        }
      }
      return updated;
    }));
  };

  const updateOption = (qId: string, index: number, value: string) => {
    setTestQuestions(prev => prev.map(q => {
      if (q.id !== qId) return q;
      const options = [...q.options];
      options[index] = value;
      return { ...q, options };
    }));
  };

  const handleSaveLesson = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: 'Lesson Saved!', description: 'New lesson has been created.' });
    setAddLessonOpen(false);
    setEntryTestEnabled(false);
    setTestQuestions([emptyQuestion()]);
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
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/teacher')} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition">
            <ArrowLeft className="w-4 h-4" /> Back to Courses
          </button>
          <button onClick={() => setAddLessonOpen(true)} className="inline-flex items-center gap-1.5 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition">
            <Plus className="w-4 h-4" /> Add Lesson
          </button>
        </div>

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

      {/* Add Lesson Drawer */}
      {addLessonOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setAddLessonOpen(false)} />
          <div className="relative w-full max-w-lg bg-card shadow-elevated animate-slide-in-right border-l border-border overflow-auto">
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h3 className="font-semibold text-card-foreground">Add Lesson</h3>
              <button onClick={() => setAddLessonOpen(false)} className="p-1 rounded hover:bg-muted transition"><X className="w-4 h-4" /></button>
            </div>
            <form onSubmit={handleSaveLesson} className="p-5 space-y-4">
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
                <div className="bg-muted rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">Test Questions</p>
                    <button type="button" onClick={addQuestion} className="inline-flex items-center gap-1 text-xs text-secondary font-medium hover:underline">
                      <Plus className="w-3.5 h-3.5" /> Add Question
                    </button>
                  </div>

                  {testQuestions.map((q, qi) => (
                    <div key={q.id} className="bg-background rounded-lg p-4 border border-border space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-muted-foreground">Question {qi + 1}</span>
                        {testQuestions.length > 1 && (
                          <button type="button" onClick={() => removeQuestion(q.id)} className="p-1 rounded hover:bg-muted transition text-status-failed">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Question Type</label>
                        <select
                          value={q.type}
                          onChange={e => updateQuestion(q.id, { type: e.target.value as QuestionType })}
                          className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
                        >
                          <option value="multiple_choice">Multiple Choice</option>
                          <option value="true_false">True / False</option>
                          <option value="short_answer">Short Answer</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs text-muted-foreground mb-1">Question Text *</label>
                        <input
                          value={q.question}
                          onChange={e => updateQuestion(q.id, { question: e.target.value })}
                          placeholder="Enter question..."
                          className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
                        />
                      </div>

                      {q.type === 'multiple_choice' && (
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground">Answer Options</label>
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`correct-${q.id}`}
                                checked={q.correctAnswer === opt && opt !== ''}
                                onChange={() => updateQuestion(q.id, { correctAnswer: opt })}
                                className="accent-secondary"
                                title="Mark as correct"
                              />
                              <input
                                value={opt}
                                onChange={e => updateOption(q.id, oi, e.target.value)}
                                placeholder={`Option ${oi + 1}`}
                                className="flex-1 px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
                              />
                            </div>
                          ))}
                          <p className="text-[10px] text-muted-foreground">Select the radio button next to the correct answer.</p>
                        </div>
                      )}

                      {q.type === 'true_false' && (
                        <div className="space-y-2">
                          <label className="block text-xs text-muted-foreground">Correct Answer</label>
                          <div className="flex gap-3">
                            {['True', 'False'].map(val => (
                              <label key={val} className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition ${q.correctAnswer === val ? 'border-secondary bg-accent' : 'border-border hover:bg-muted/50'}`}>
                                <input
                                  type="radio"
                                  name={`tf-${q.id}`}
                                  checked={q.correctAnswer === val}
                                  onChange={() => updateQuestion(q.id, { correctAnswer: val })}
                                  className="accent-secondary"
                                />
                                <span className="text-sm text-foreground">{val}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                      )}

                      {q.type === 'short_answer' && (
                        <div>
                          <label className="block text-xs text-muted-foreground mb-1">Correct Answer *</label>
                          <input
                            value={q.correctAnswer}
                            onChange={e => updateQuestion(q.id, { correctAnswer: e.target.value })}
                            placeholder="Expected answer..."
                            className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Passing Score %</label>
                      <input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs text-muted-foreground mb-1">Retake Interval (hrs)</label>
                      <input type="number" value={retakeInterval} onChange={e => setRetakeInterval(Number(e.target.value))} className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm" />
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
