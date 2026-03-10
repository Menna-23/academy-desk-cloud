import { Trash2 } from 'lucide-react';

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer';

export interface TestQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const emptyQuestion = (): TestQuestion => ({
  id: crypto.randomUUID(),
  type: 'multiple_choice',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '',
});

interface TestQuestionCardProps {
  question: TestQuestion;
  index: number;
  canDelete: boolean;
  onUpdate: (id: string, updates: Partial<TestQuestion>) => void;
  onUpdateOption: (id: string, index: number, value: string) => void;
  onRemove: (id: string) => void;
}

export default function TestQuestionCard({ question: q, index: qi, canDelete, onUpdate, onUpdateOption, onRemove }: TestQuestionCardProps) {
  return (
    <div className="bg-background rounded-lg p-4 border border-border space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground">Question {qi + 1}</span>
        {canDelete && (
          <button type="button" onClick={() => onRemove(q.id)} className="p-1 rounded hover:bg-muted transition text-status-failed">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs text-muted-foreground mb-1">Question Type</label>
        <select
          value={q.type}
          onChange={e => onUpdate(q.id, { type: e.target.value as QuestionType })}
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
          onChange={e => onUpdate(q.id, { question: e.target.value })}
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
                onChange={() => onUpdate(q.id, { correctAnswer: opt })}
                className="accent-secondary"
                title="Mark as correct"
              />
              <input
                value={opt}
                onChange={e => onUpdateOption(q.id, oi, e.target.value)}
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
                  onChange={() => onUpdate(q.id, { correctAnswer: val })}
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
            onChange={e => onUpdate(q.id, { correctAnswer: e.target.value })}
            placeholder="Expected answer..."
            className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
          />
        </div>
      )}
    </div>
  );
}
