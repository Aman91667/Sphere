import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mockVideoLessons, mockQuizzes } from "@/data/mockData";
import { Play, CheckCircle, Clock, TrendingUp, Award, BookOpen } from "lucide-react";

const Dashboard = () => {
  const completedLessons = mockVideoLessons.filter(l => (typeof l.videoProgress === "number" ? l.videoProgress >= 100 : l.completed)).length;
  const totalLessons = mockVideoLessons.length;
  const completedQuizzes = mockQuizzes.filter(q => q.completed).length;
  const totalQuizzes = mockQuizzes.length;
  // Average score across completed quizzes (guard divide by zero)
  const completedWithScore = mockQuizzes.filter(q => q.completed && typeof q.score === "number");
  const averageScore = (completedWithScore.reduce((acc, q) => acc + (q.score || 0), 0) / (completedWithScore.length || 1)) || 0;

  // Real analysis: compute weighted completion using per-lesson video progress and quiz score.
  // - For each lesson: video contributes 70% of that lesson's completion, quiz contributes 30%.
  // - Standalone quizzes (not linked to a lesson) contribute by their completion/score.
  const LESSON_VIDEO_WEIGHT = 0.7;
  const LESSON_QUIZ_WEIGHT = 0.3;

  // Detect quizzes that are linked from lessons so we don't double-count them
  const linkedQuizIds = new Set(mockVideoLessons.map(l => l.quiz?.id).filter(Boolean));

  // Compute earned points and total possible points (each lesson/quizzes normalized to 100)
  let earnedPoints = 0;
  let totalPoints = 0;

  // Lessons: each lesson worth 100 points
  mockVideoLessons.forEach((l) => {
    const videoProg = typeof l.videoProgress === "number" ? l.videoProgress : (l.completed ? 100 : 0);
    const quizScore = l.quiz && typeof l.quiz.score === "number" ? l.quiz.score : 0;
    const lessonEarned = (videoProg * LESSON_VIDEO_WEIGHT) + (quizScore * LESSON_QUIZ_WEIGHT);
    earnedPoints += lessonEarned;
    totalPoints += 100;
  });

  // Standalone quizzes (not linked to lessons)
  const standaloneQuizzes = mockQuizzes.filter(q => !linkedQuizIds.has(q.id));
  standaloneQuizzes.forEach((q) => {
    const quizEarned = q.completed && typeof q.score === "number" ? q.score : 0;
    earnedPoints += quizEarned;
    totalPoints += 100;
  });

  const overallProgress = totalPoints > 0 ? (earnedPoints / totalPoints) * 100 : 0;

  const stats = [
    { label: "Lessons Completed", value: `${completedLessons}/${totalLessons}`, icon: BookOpen, color: "text-primary" },
    { label: "Quizzes Completed", value: `${completedQuizzes}/${totalQuizzes}`, icon: CheckCircle, color: "text-success" },
    { label: "Average Score", value: `${Math.round(averageScore)}%`, icon: Award, color: "text-accent" },
    { label: "Overall Progress", value: `${Math.round(overallProgress)}%`, icon: TrendingUp, color: "text-secondary" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-10">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Welcome back, Learner!
          </h1>
          <p className="text-muted-foreground text-xl">Continue your learning journey</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-10">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-premium hover-lift glass-card border-border/50 overflow-hidden relative group">
                <div className="absolute inset-0 gradient-premium opacity-0 group-hover:opacity-100 transition-smooth" />
                <CardHeader className="relative flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 shadow-glow">
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Overview */}
        <Card className="mb-10 shadow-premium glass-card border-border/50 overflow-hidden relative">
          <div className="absolute inset-0 gradient-premium opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="text-2xl">Learning Progress</CardTitle>
            <CardDescription className="text-base">Your overall completion rate</CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground font-medium">Overall Progress</span>
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {Math.round(overallProgress)}%
                </span>
              </div>
              <Progress value={overallProgress} className="h-4 shadow-glow" />
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Video Lessons */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Video Lessons
              </h2>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold shadow-glow">
                {completedLessons}/{totalLessons} completed
              </Badge>
            </div>
            <div className="space-y-5">
              {mockVideoLessons.map((lesson) => (
                <Card key={lesson.id} className="shadow-premium hover-lift glass-card border-border/50 overflow-hidden group">
                  <div className="absolute inset-0 gradient-premium opacity-0 group-hover:opacity-100 transition-smooth" />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{lesson.title}</CardTitle>
                        <CardDescription className="text-base">{lesson.description}</CardDescription>
                      </div>
                      {lesson.completed && (
                        <div className="p-2 rounded-full bg-success/10 shadow-glow">
                          <CheckCircle className="h-6 w-6 text-success" />
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                        <div className="p-1.5 rounded-lg bg-primary/10">
                          <Clock className="h-4 w-4 text-primary" />
                        </div>
                        <span>{lesson.duration}</span>
                      </div>
                      <Link to={`/learn/${lesson.id}`}>
                        <Button 
                          variant={lesson.completed ? "outline" : "default"} 
                          className="gap-2 shadow-glow hover:shadow-premium transition-bounce"
                        >
                          <Play className="h-4 w-4" />
                          {lesson.completed ? "Review" : "Start"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Quizzes */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                Practice Quizzes
              </h2>
              <Badge variant="secondary" className="px-4 py-2 text-sm font-semibold shadow-glow">
                {completedQuizzes}/{totalQuizzes} completed
              </Badge>
            </div>
            <div className="space-y-5">
              {mockQuizzes.map((quiz) => (
                <Card key={quiz.id} className="shadow-premium hover-lift glass-card border-border/50 overflow-hidden group">
                  <div className="absolute inset-0 gradient-premium opacity-0 group-hover:opacity-100 transition-smooth" />
                  <CardHeader className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">{quiz.title}</CardTitle>
                        <CardDescription className="text-base">{quiz.description}</CardDescription>
                      </div>
                      {quiz.completed && (
                        <Badge className="bg-gradient-to-r from-success to-success/80 shadow-glow px-3 py-1 text-base font-bold">
                          {quiz.score}%
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-medium">
                        {quiz.questions.length} questions
                      </span>
                      <Link to={`/quiz/${quiz.id}`}>
                        <Button 
                          variant={quiz.completed ? "outline" : "default"}
                          className="shadow-glow hover:shadow-premium transition-bounce"
                        >
                          {quiz.completed ? "Retake" : "Start Quiz"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
