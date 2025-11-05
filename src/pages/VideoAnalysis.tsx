import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockVideoLessons } from "@/data/mockData";
import { CheckCircle, ArrowRight, Brain, Lightbulb, Target } from "lucide-react";

const VideoAnalysis = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const lesson = mockVideoLessons.find(l => l.id === id);

  if (!lesson) {
    return <div className="container mx-auto px-4 py-8">Lesson not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/learn/${id}`)}
            className="mb-4 hover:bg-primary/10 transition-bounce"
          >
            ← Back to Video
          </Button>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-secondary via-accent to-primary bg-clip-text text-transparent">
            Lesson Analysis
          </h1>
          <p className="text-muted-foreground text-xl">{lesson.title}</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* Main Analysis Card */}
          <Card className="shadow-premium glass-card border-border/50 overflow-hidden relative">
            <div className="absolute inset-0 gradient-premium opacity-30" />
            <CardHeader className="relative">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 rounded-lg bg-gradient-to-br from-success/20 to-success/10 shadow-glow">
                  <CheckCircle className="h-8 w-8 text-success" />
                </div>
                <div>
                  <CardTitle className="text-3xl">Video Completed!</CardTitle>
                  <CardDescription className="text-base mt-1">Here are the key takeaways</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative space-y-6">
              <div className="prose prose-lg max-w-none">
                <p className="text-foreground/90 leading-relaxed text-lg">{lesson.analysis}</p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-lg glass-card border border-primary/20 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Core Concepts</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Master the fundamentals</p>
                </div>
                
                <div className="p-4 rounded-lg glass-card border border-secondary/20 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-5 w-5 text-secondary" />
                    <h3 className="font-semibold">Key Insights</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Practical applications</p>
                </div>
                
                <div className="p-4 rounded-lg glass-card border border-accent/20 hover-lift">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-5 w-5 text-accent" />
                    <h3 className="font-semibold">Next Steps</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">Apply your knowledge</p>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  onClick={() => navigate(`/learn/${id}`)} 
                  size="lg"
                  className="w-full gap-2 shadow-premium hover:shadow-glow transition-bounce text-lg py-6"
                >
                  Take Quiz to Test Your Knowledge
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card className="shadow-premium glass-card border-border/50">
            <CardHeader>
              <CardTitle className="text-xl">Lesson Details</CardTitle>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Duration</div>
                <div className="font-semibold text-lg">{lesson.duration}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Quiz Questions</div>
                <div className="font-semibold text-lg">{lesson.quiz.questions.length} questions</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground mb-1">Status</div>
                <Badge className="shadow-glow">
                  {lesson.completed ? "Completed" : "In Progress"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalysis;
