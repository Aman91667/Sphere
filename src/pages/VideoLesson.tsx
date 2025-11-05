import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { mockVideoLessons } from "@/data/mockData";
import { CheckCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const VideoLesson = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const initialLesson = mockVideoLessons.find(l => l.id === id);
  const [lessonData, setLessonData] = useState<any>(initialLesson || null);
  
  const [videoEnded, setVideoEnded] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  if (!lessonData) {
    return <div className="container mx-auto px-4 py-8">Lesson not found</div>;
  }

  const handleVideoEnd = async () => {
    setVideoEnded(true);
    setShowAnalysis(true);
    setAnalyzing(true);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/quiz/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: lessonData.title,
          description: lessonData.analysis || lessonData.description,
          videoUrl: lessonData.videoUrl,
          save: !!token,
        }),
      });

      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Analysis failed');

      // attach generated quiz to lessonData (if saved, server returns persisted quiz with _id)
      setLessonData((l: any) => ({ ...l, quiz: body.quiz }));
      toast.success('Video analyzed and quiz generated');
      setShowAnalysis(false);
      setCurrentQuestion(0);
      setAnswers([]);
      setShowResults(false);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Failed to analyze video');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleStartQuiz = () => {
    setShowAnalysis(false);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answerIndex;
    setAnswers(newAnswers);

    if (currentQuestion < lessonData.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate score
      const correctAnswers = lessonData.quiz.questions.filter(
        (q: any, i: number) => q.correctAnswer === newAnswers[i]
      ).length;
      const score = Math.round((correctAnswers / lessonData.quiz.questions.length) * 100);
      setShowResults(true);
      toast.success(`Quiz completed! Your score: ${score}%`);
    }
  };

  const score = showResults
    ? Math.round(
        (lessonData.quiz.questions.filter((q: any, i: number) => q.correctAnswer === answers[i]).length /
          lessonData.quiz.questions.length) *
          100
      )
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            {lessonData.title}
          </h1>
          <p className="text-muted-foreground text-xl">{lessonData.description}</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            {/* Video Player */}
            <Card className="shadow-premium glass-card border-border/50 overflow-hidden">
              <CardContent className="p-0">
                          {(() => {
                            const url: string = lessonData.videoUrl || "";
                            const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");

                            const getYouTubeEmbed = (raw: string) => {
                              try {
                                // If it's already an embed url, use as-is
                                if (raw.includes("/embed")) return raw;

                                const u = new URL(raw);
                                // Search results like /results?search_query=... -> embed search playlist
                                if (u.pathname.includes("/results") && u.searchParams.has("search_query")) {
                                  const q = u.searchParams.get("search_query") || "";
                                  return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(q)}`;
                                }

                                // watch?v=VIDEO_ID -> embed/VIDEO_ID
                                if (u.searchParams.has("v")) {
                                  const vid = u.searchParams.get("v");
                                  return `https://www.youtube.com/embed/${vid}`;
                                }

                                // youtu.be short link
                                if (u.hostname === "youtu.be") {
                                  const vid = u.pathname.replace(/^\//, "");
                                  return `https://www.youtube.com/embed/${vid}`;
                                }

                                return raw;
                              } catch (e) {
                                return raw;
                              }
                            };

                            if (isYouTube) {
                              const embedSrc = getYouTubeEmbed(url);
                              return (
                                <div className="w-full aspect-video bg-black">
                                  <iframe
                                    title={lessonData.title}
                                    src={embedSrc}
                                    className="w-full h-full"
                                    frameBorder={0}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  />
                                  <div className="p-4 flex items-center justify-end">
                                    <Button onClick={handleVideoEnd} className="shadow-glow">
                                      Mark as watched & Analyze
                                    </Button>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <video
                                ref={videoRef}
                                className="w-full aspect-video bg-black"
                                controls
                                onEnded={handleVideoEnd}
                                src={lessonData.videoUrl}
                              >
                                Your browser does not support the video tag.
                              </video>
                            );
                          })()}
              </CardContent>
            </Card>

            {/* Quiz */}
            {!showResults && (
              <Card className="shadow-premium glass-card border-border/50 overflow-hidden relative">
                <div className="absolute inset-0 gradient-premium opacity-20" />
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Quiz Time!</CardTitle>
                    <Badge className="px-4 py-2 shadow-glow font-semibold">
                      Question {currentQuestion + 1} of {lessonData.quiz.questions.length}
                    </Badge>
                  </div>
                    <Progress
                      value={((currentQuestion + 1) / lessonData.quiz.questions.length) * 100}
                      className="h-3 shadow-glow"
                    />
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div>
                    <h3 className="text-2xl font-semibold mb-6">
                      {lessonData.quiz.questions[currentQuestion].question}
                    </h3>
                    <div className="space-y-4">
                      {lessonData.quiz.questions[currentQuestion].options.map((option: any, index: number) => (
                        <Button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          variant={answers[currentQuestion] === index ? "default" : "outline"}
                          className="w-full justify-start text-left h-auto py-5 px-6 text-base hover-lift transition-bounce shadow-soft"
                        >
                          <span className="mr-4 font-bold text-lg">{String.fromCharCode(65 + index)}.</span>
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {showResults && (
              <Card className="shadow-premium glass-card border-border/50 overflow-hidden relative">
                <div className="absolute inset-0 gradient-premium opacity-30" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-3 text-3xl">
                    <div className="p-3 rounded-full bg-success/10 shadow-glow">
                      <CheckCircle className="h-8 w-8 text-success" />
                    </div>
                    Quiz Completed!
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative space-y-6">
                  <div className="text-center py-12">
                    <div className="text-8xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent shadow-glow">
                      {score}%
                    </div>
                    <p className="text-2xl text-muted-foreground mb-8">
                      You got {lessonData.quiz.questions.filter((q: any, i: number) => q.correctAnswer === answers[i]).length} out of {lessonData.quiz.questions.length} correct!
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button 
                        onClick={() => navigate("/dashboard")}
                        size="lg"
                        className="shadow-premium hover:shadow-glow transition-bounce"
                      >
                        Back to Dashboard
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        className="hover-lift transition-bounce"
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
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="shadow-premium glass-card border-border/50 hover-lift">
              <CardHeader>
                <CardTitle className="text-xl">Lesson Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <div className="text-sm text-muted-foreground mb-1">Duration</div>
                  <div className="font-bold text-lg">{lessonData.duration}</div>
                </div>
                <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                  <div className="text-sm text-muted-foreground mb-1">Questions</div>
                  <div className="font-bold text-lg">{lessonData.quiz.questions.length} questions</div>
                </div>
                <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
                  <div className="text-sm text-muted-foreground mb-1">Status</div>
                  <Badge className="shadow-glow mt-1">
                    {lessonData.completed ? "Completed" : "In Progress"}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-premium glass-card border-border/50 hover-lift">
              <CardHeader>
                <CardTitle className="text-xl">Up Next</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Complete this lesson to unlock more content and continue your learning journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoLesson;
