import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Video, Brain, TrendingUp, CheckCircle } from "lucide-react";

const Home = () => {
  const features = [
    {
      icon: Video,
      title: "Video Learning",
      description: "Watch educational videos with integrated quizzes to test your knowledge"
    },
    {
      icon: Brain,
      title: "AI Analysis",
      description: "Get instant analysis and insights after watching each video"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your learning journey with detailed progress analytics"
    },
    {
      icon: CheckCircle,
      title: "Custom Quizzes",
      description: "Create and take personalized quizzes to reinforce learning"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-lg">
              <GraduationCap className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="mb-6 text-5xl font-bold md:text-6xl lg:text-7xl">
              Learn Smarter, Not Harder
            </h1>
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl">
              Master any subject with our interactive video lessons, AI-powered analysis, and smart quizzes
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link to="/auth">
                <Button size="lg" className="gradient-hero text-lg px-8 py-6 hover:opacity-90 transition-smooth">
                  Get Started Free
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold md:text-5xl">
              Everything You Need to Excel
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful features designed to accelerate your learning
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative overflow-hidden rounded-2xl bg-card p-8 shadow-soft transition-smooth hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-3 text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-bold md:text-5xl">
              Ready to Start Learning?
            </h2>
            <p className="mb-8 text-xl text-muted-foreground">
              Join thousands of learners achieving their goals
            </p>
            <Link to="/auth">
              <Button size="lg" className="gradient-accent text-lg px-8 py-6 hover:opacity-90 transition-smooth">
                Start Your Journey
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
