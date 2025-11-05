import { useState, useEffect } from "react";
// removed duplicate Navigation import
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Sparkles, BookOpen, Code, Palette, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import API_BASE from "@/lib/api";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface MockQuiz {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: any;
  questions: QuizQuestion[];
  difficulty: "beginner" | "intermediate" | "advanced";
}

/* mockQuizzes ... (keep the same mock array you already have) */
const mockQuizzes: MockQuiz[] = [
  // ... (same as your current mock data)
];

const QuizGenerator = () => {
  const [activeTab, setActiveTab] = useState("create");
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: "1",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    },
  ]);

  const addQuestion = () => {
    const newQuestion: QuizQuestion = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
    };
    setQuestions([...questions, newQuestion]);
    toast.success("New question added");
  };

  // quizzes fetched from backend (user-created)
  const [serverQuizzes, setServerQuizzes] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return; // only fetch if logged in
  const res = await fetch(`${API_BASE}/api/quiz`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const body = await res.json();
        setServerQuizzes(body.quizzes || []);
      } catch (err) {
        // ignore - user may be unauthenticated or server down
        console.debug('could not fetch server quizzes', err);
      }
    };

    fetchQuizzes();
  }, []);

  const removeQuestion = (id: string) => {
    if (questions.length === 1) {
      toast.error("Quiz must have at least one question");
      return;
    }
    setQuestions(questions.filter((q) => q.id !== id));
    toast.success("Question removed");
  };

  const updateQuestion = (id: string, field: string, value: any) => {
    setQuestions(
      questions.map((q) =>
        q.id === id ? { ...q, [field]: value } : q
      )
    );
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt, idx) =>
                idx === optionIndex ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleGenerateQuiz = () => {
    if (!quizTitle.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }

    const hasEmptyQuestions = questions.some(
      (q) => !q.question.trim() || q.options.some((opt) => !opt.trim())
    );

    if (hasEmptyQuestions) {
      toast.error("Please fill in all questions and options");
      return;
    }

    // send to backend (sanitize client-side: remove any id fields and coerce types)
    (async () => {
      try {
        const token = localStorage.getItem('token');

        const sanitizedQuestions = questions.map((q) => ({
          question: String(q.question || ""),
          options: Array.isArray(q.options) ? q.options.map((o) => String(o)) : [],
          correctAnswer: Number.isFinite(Number(q.correctAnswer)) ? Number(q.correctAnswer) : 0,
        }));

        const payload = {
          title: quizTitle,
          description: quizDescription,
          questions: sanitizedQuestions,
        };

  const res = await fetch(`${API_BASE}/api/quiz/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });

        const body = await res.json();
        if (!res.ok) throw new Error(body.error || 'Failed to generate quiz');

        toast.success('Quiz generated and saved to your account 🎉', {
          description: `Created "${quizTitle}" with ${questions.length} questions`,
        });
        console.log('quiz saved', body.quiz);
        // append to serverQuizzes so it appears in Templates immediately
        setServerQuizzes((s) => [body.quiz, ...s]);
      } catch (err: any) {
        console.error(err);
        toast.error(err.message || 'Failed to save quiz');
      }
    })();
  };

  const loadMockQuiz = (mockQuiz: MockQuiz) => {
    setQuizTitle(mockQuiz.title);
    setQuizDescription(mockQuiz.description);
    setQuestions(mockQuiz.questions);
    setActiveTab("create");
    toast.success(`Loaded "${mockQuiz.title}" template`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-700 dark:text-green-400";
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
      case "advanced":
        return "bg-red-500/10 text-red-700 dark:text-red-400";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* NOTE: removed the duplicate <Navigation /> render to avoid two navbars.
          If your app layout already includes Navbar, keep it out of pages. */}

      {/* add padding-top so sticky navbar doesn't overlap content */}
      <main className="container mx-auto px-4 py-8 pt-20 md:pt-24">
        <div className="mb-8 animate-slide-up">
          <h1 className="mb-2 text-4xl font-bold text-foreground">Quiz Generator</h1>
          <p className="text-lg text-muted-foreground">
            Create custom quizzes or choose from our templates
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Custom
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-2">
              <BookOpen className="h-4 w-4" />
              Browse Templates
            </TabsTrigger>
          </TabsList>

          {/* Templates */}
          <TabsContent value="templates" className="animate-fade-in">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  {[...serverQuizzes, ...mockQuizzes].map((quiz: any) => {
                    // server quizzes come with _id and may not have icon/difficulty/category
                    const isServer = !!quiz._id;
                    const id = isServer ? quiz._id : quiz.id;
                    const IconComponent = quiz.icon || BookOpen;
                    const difficulty = quiz.difficulty || 'beginner';
                    const category = quiz.category || 'Custom';
                    const questionsCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
                    return (
                      <Card
                        key={id}
                        className="group overflow-hidden shadow-elegant transition-all hover:shadow-elegant-xl"
                      >
                        <div className="p-6">
                          <div className="mb-4 flex items-start justify-between">
                            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <Badge className={getDifficultyColor(difficulty)}>
                              {difficulty}
                            </Badge>
                          </div>

                          <h3 className="mb-2 text-xl font-bold text-foreground">
                            {quiz.title}
                          </h3>
                          <p className="mb-4 text-sm text-muted-foreground">
                            {quiz.description}
                          </p>

                          <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {category}
                              </Badge>
                            </span>
                            <span>{questionsCount} questions</span>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => loadMockQuiz(quiz)}
                              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              Use This Template
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                const id = quiz._id || quiz.id;
                                // navigate to quiz page
                                window.location.href = `/quiz/${id}`;
                              }}
                              className="flex-1"
                            >
                              Take Quiz
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
            </div>

            <Card className="mt-8 bg-muted/50 p-8 text-center">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                Want to create your own?
              </h3>
              <p className="mb-4 text-sm text-muted-foreground">
                Switch to the Create Custom tab to build a quiz from scratch
              </p>
              <Button
                onClick={() => setActiveTab("create")}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Create Custom Quiz
              </Button>
            </Card>
          </TabsContent>

          {/* Create */}
          <TabsContent value="create" className="animate-fade-in">
            <div className="grid gap-6 lg:grid-cols-3">
              {/* Quiz Form */}
              <div className="lg:col-span-2">
                <Card className="p-6 shadow-elegant">
                  <div className="mb-6 space-y-4">
                    <div>
                      <Label htmlFor="quiz-title" className="text-foreground">
                        Quiz Title *
                      </Label>
                      <Input
                        id="quiz-title"
                        placeholder="e.g., Introduction to Machine Learning"
                        value={quizTitle}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        className="mt-1.5"
                      />
                    </div>

                    <div>
                      <Label htmlFor="quiz-description" className="text-foreground">
                        Description (Optional)
                      </Label>
                      <Textarea
                        id="quiz-description"
                        placeholder="Brief description of the quiz..."
                        value={quizDescription}
                        onChange={(e) => setQuizDescription(e.target.value)}
                        className="mt-1.5"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-foreground">Questions</h2>
                    <Badge className="bg-secondary text-secondary-foreground">
                      {questions.length} {questions.length === 1 ? "Question" : "Questions"}
                    </Badge>
                  </div>

                  <div className="space-y-6">
                    {questions.map((question, qIndex) => (
                      <Card key={question.id} className="border-2 border-border p-6">
                        <div className="mb-4 flex items-start justify-between">
                          <h3 className="text-lg font-semibold text-foreground">
                            Question {qIndex + 1}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeQuestion(question.id)}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-foreground">Question *</Label>
                            <Input
                              placeholder="Enter your question..."
                              value={question.question}
                              onChange={(e) =>
                                updateQuestion(question.id, "question", e.target.value)
                              }
                              className="mt-1.5"
                            />
                          </div>

                          <div>
                            <Label className="text-foreground">Options *</Label>
                            <div className="mt-2 space-y-2">
                              {question.options.map((option, optIndex) => (
                                <div key={optIndex} className="flex items-center gap-2">
                                  <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                                    {String.fromCharCode(65 + optIndex)}
                                  </div>
                                  <Input
                                    placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                                    value={option}
                                    onChange={(e) =>
                                      updateOption(question.id, optIndex, e.target.value)
                                    }
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div>
                            <Label className="text-foreground">Correct Answer *</Label>
                            <div className="mt-2 flex gap-2">
                              {question.options.map((_, optIndex) => (
                                <Button
                                  key={optIndex}
                                  variant={
                                    question.correctAnswer === optIndex ? "default" : "outline"
                                  }
                                  size="sm"
                                  onClick={() =>
                                    updateQuestion(question.id, "correctAnswer", optIndex)
                                  }
                                  className="w-12"
                                >
                                  {String.fromCharCode(65 + optIndex)}
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={addQuestion}
                    variant="outline"
                    className="mt-6 w-full border-dashed border-2 hover:border-primary hover:bg-primary/5"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Question
                  </Button>
                </Card>
              </div>

              {/* Preview/Actions Sidebar */}
              <div className="lg:col-span-1">
                <Card className="sticky top-4 p-6 shadow-elegant">
                  <h3 className="mb-4 text-lg font-bold text-foreground">Quiz Summary</h3>

                  <div className="mb-6 space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Questions:</span>
                      <span className="font-semibold text-foreground">{questions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Completed:</span>
                      <span className="font-semibold text-foreground">
                        {questions.filter(
                          (q) => q.question.trim() && q.options.every((opt) => opt.trim())
                        ).length}
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerateQuiz}
                    className="w-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Quiz
                  </Button>

                  <div className="mt-6 rounded-lg bg-muted/50 p-4">
                    <h4 className="mb-2 text-sm font-semibold text-foreground">Tips</h4>
                    <ul className="space-y-1 text-xs text-muted-foreground">
                      <li>• Keep questions clear and concise</li>
                      <li>• Provide 4 options per question</li>
                      <li>• Mark the correct answer</li>
                      <li>• Review before generating</li>
                    </ul>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default QuizGenerator;
