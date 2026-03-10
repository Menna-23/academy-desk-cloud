import { useState } from 'react';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import type { QuestionType, TestQuestion } from './TestQuestionCard';

interface AITestGeneratorProps {
  onGenerated: (questions: TestQuestion[]) => void;
}

const mockGenerateQuestions = (
  numQuestions: number,
  types: QuestionType[]
): TestQuestion[] => {
  const sampleQuestions: Record<QuestionType, () => Omit<TestQuestion, 'id'>> = {
    multiple_choice: () => ({
      type: 'multiple_choice',
      question: 'What is the primary function of mitochondria in a cell?',
      options: ['Energy production', 'Protein synthesis', 'Cell division', 'Waste removal'],
      correctAnswer: 'Energy production',
    }),
    true_false: () => ({
      type: 'true_false',
      question: 'Photosynthesis occurs only in plant cells.',
      options: ['True', 'False'],
      correctAnswer: 'True',
    }),
    short_answer: () => ({
      type: 'short_answer',
      question: 'What molecule carries genetic information in most organisms?',
      options: [],
      correctAnswer: 'DNA',
    }),
  };

  const questions: TestQuestion[] = [];
  for (let i = 0; i < numQuestions; i++) {
    const type = types[i % types.length];
    const base = sampleQuestions[type]();
    questions.push({ ...base, id: crypto.randomUUID() });
  }
  return questions;
};

export default function AITestGenerator({ onGenerated }: AITestGeneratorProps) {
  const [file, setFile] = useState<File | null>(null);
  const [numQuestions, setNumQuestions] = useState(5);
  const [selectedTypes, setSelectedTypes] = useState<QuestionType[]>(['multiple_choice']);
  const [generating, setGenerating] = useState(false);

  const toggleType = (type: QuestionType) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? (prev.length > 1 ? prev.filter(t => t !== type) : prev) : [...prev, type]
    );
  };

  const handleGenerate = async () => {
    if (!file) return;
    setGenerating(true);
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 2000));
    const questions = mockGenerateQuestions(numQuestions, selectedTypes);
    setGenerating(false);
    onGenerated(questions);
  };

  const typeOptions: { value: QuestionType; label: string }[] = [
    { value: 'multiple_choice', label: 'Multiple Choice' },
    { value: 'true_false', label: 'True / False' },
    { value: 'short_answer', label: 'Short Answer' },
  ];

  return (
    <div className="space-y-4">
      {/* File Upload */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Upload Lesson Content *</label>
        <div className="flex items-center gap-2 p-3 border border-dashed border-border rounded-lg bg-muted/30">
          <Upload className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt,.pptx"
            onChange={e => setFile(e.target.files?.[0] || null)}
            className="text-sm text-muted-foreground flex-1"
          />
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">PDF, DOC, DOCX, TXT, or PPTX — AI will analyze the content to generate questions.</p>
      </div>

      {/* Question Types */}
      <div>
        <label className="block text-xs text-muted-foreground mb-2">Question Types *</label>
        <div className="flex flex-wrap gap-2">
          {typeOptions.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => toggleType(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition ${
                selectedTypes.includes(opt.value)
                  ? 'border-secondary bg-accent text-secondary'
                  : 'border-border bg-background text-muted-foreground hover:bg-muted/50'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Number of Questions */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Number of Questions</label>
        <input
          type="number"
          min={1}
          max={50}
          value={numQuestions}
          onChange={e => setNumQuestions(Math.max(1, Math.min(50, Number(e.target.value))))}
          className="w-full px-2 py-1.5 rounded border border-border bg-background text-foreground text-sm focus:ring-2 focus:ring-secondary focus:outline-none"
        />
      </div>

      {/* Generate Button */}
      <button
        type="button"
        onClick={handleGenerate}
        disabled={!file || generating}
        className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-secondary text-secondary-foreground rounded-lg text-sm font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Generating Questions...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" /> Generate Test with AI
          </>
        )}
      </button>
    </div>
  );
}
