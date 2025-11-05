import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockQuizzes } from "@/data/mockData";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const QuizPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const localQuiz = mockQuizzes.find(q => q.id === id);
  const [quiz, setQuiz] = useState<any>(localQuiz || null);
  const [loading, setLoading] = useState(!localQuiz && !!id);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (!localQuiz && id) {
      setLoading(true);
      fetch(`http://localhost:3000/api/quiz/${id}`)
        .then((r) => r.json())
        .then((body) => {
          if (body && body.quiz) {
            setQuiz(body.quiz);
          } else {
            setError('Quiz not found');
          }
        })
        .catch(() => setError('Failed to load quiz'))
        .finally(() => setLoading(false));
    }
  }, [id, localQuiz]);

  if (loading) return <div className="container mx-auto px-4 py-8">Loading quiz...</div>;
  if (error) return <div className="container mx-auto px-4 py-8">{error}</div>;
  if (!quiz) return <div className="container mx-auto px-4 py-8">Quiz not found</div>;

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // If this quiz is from server (has _id), submit answers for grading
      if (quiz._id) {
        (async () => {
          try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3000/api/quiz/${quiz._id}/submit`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
              },
              body: JSON.stringify({ answers: newAnswers }),
            });
            const body = await res.json();
            if (!res.ok) throw new Error(body.error || 'Failed to grade quiz');
            // attach grading result to quiz
            setQuiz((qz: any) => ({ ...qz, _grading: body }));
            setShowResults(true);
            toast.success(`Quiz completed! Your score: ${body.score}%`);
          } catch (err: any) {
            console.error(err);
            toast.error(err.message || 'Failed to submit quiz');
            // fallback to local scoring
            const correctAnswers = quiz.questions.filter((q: any, i: number) => q.correctAnswer === newAnswers[i]).length;
            const score = Math.round((correctAnswers / quiz.questions.length) * 100);
            setQuiz((qz: any) => ({ ...qz, _grading: { score, correct: correctAnswers, total: quiz.questions.length, details: quiz.questions.map((q: any, idx: number) => ({ questionIndex: idx, selected: newAnswers[idx], correctAnswer: q.correctAnswer, isCorrect: newAnswers[idx] === q.correctAnswer })) } }));
            setShowResults(true);
          }
        })();
        return;
      }

      // local quiz scoring
      const correctAnswers = quiz.questions.filter((q: any, i: number) => q.correctAnswer === newAnswers[i]).length;
      const score = Math.round((correctAnswers / quiz.questions.length) * 100);
      setQuiz((qz: any) => ({ ...qz, _grading: { score, correct: correctAnswers, total: quiz.questions.length, details: quiz.questions.map((q: any, idx: number) => ({ questionIndex: idx, selected: newAnswers[idx], correctAnswer: q.correctAnswer, isCorrect: newAnswers[idx] === q.correctAnswer })) } }));
      setShowResults(true);
      toast.success(`Quiz completed! Your score: ${score}%`);
    }
  };

  const score = showResults && quiz._grading ? quiz._grading.score : 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-muted-foreground text-lg">{quiz.description}</p>
      </div>

      {!showResults ? (
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Question {currentQuestion + 1}</CardTitle>
              <Badge variant="secondary">
                {currentQuestion + 1} of {quiz.questions.length}
              </Badge>
            </div>
            <Progress
              value={((currentQuestion + 1) / quiz.questions.length) * 100}
              className="h-2"
            />
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-6">
                {quiz.questions[currentQuestion].question}
              </h3>
              <div className="space-y-3">
                {quiz.questions[currentQuestion].options.map((option: any, index: number) => (
                  <Button
                    key={index}
                    variant={answers[currentQuestion] === index ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-4 px-6"
                    onClick={() => handleAnswer(index)}
                  >
                    <span className="mr-3 font-semibold">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-success" />
              Quiz Completed!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <div className="text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {score}%
              </div>
              <p className="text-xl text-muted-foreground mb-6">
                You got {quiz._grading?.correct ?? quiz.questions.filter((q: any, i: number) => q.correctAnswer === answers[i]).length} out of {quiz.questions.length} correct!
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate("/dashboard")}>
                  Back to Dashboard
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setCurrentQuestion(0);
                    setAnswers([]);
                    setShowResults(false);
                  }}
                >
                  Retake Quiz
                </Button>
              </div>
            </div>

            {/* Show detailed results */}
            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Detailed Results</h3>
              <div className="space-y-4">
                {quiz.questions.map((question: any, index: number) => {
                  const grading = quiz._grading?.details?.find((d: any) => d.questionIndex === index);
                  const isCorrect = grading ? grading.isCorrect : answers[index] === question.correctAnswer;
                  return (
                    <div
                      key={question.id || index}
                      className={`p-4 rounded-lg border-2 ${
                        isCorrect ? "border-success bg-success/5" : "border-destructive bg-destructive/5"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <CheckCircle
                          className={`h-5 w-5 mt-0.5 ${
                            isCorrect ? "text-success" : "text-destructive"
                          }`}
                        />
                        <div className="flex-1">
                          <p className="font-medium mb-2">{question.question}</p>
                          <p className="text-sm text-muted-foreground">
                            Your answer: {question.options[answers[index]]}
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-success mt-1">
                              Correct answer: {question.options[question.correctAnswer]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizPage;
