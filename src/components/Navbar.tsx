import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, LayoutDashboard, PlusCircle, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = location.pathname !== "/auth" && location.pathname !== "/";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/quiz-generator", label: "Create Quiz", icon: PlusCircle },
  ];

  // ✅ logout function
  const handleLogout = () => {
    // You can also clear auth tokens or state here if you’re using localStorage or context
    localStorage.removeItem("token");
    navigate("/auth");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center gap-2 transition-smooth hover:opacity-80"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-hero shadow-glow">
              <GraduationCap className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              LearnSphere
            </span>
          </Link>

          {/* Desktop Menu */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map(({ to, label, icon: Icon }) => {
                const isActive = location.pathname === to;
                return (
                  <Link key={to} to={to}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      className={`gap-2 transition-bounce ${
                        isActive ? "shadow-glow" : "hover:bg-primary/10"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Button>
                  </Link>
                );
              })}
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-destructive/10 text-destructive transition-smooth"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          {isAuthenticated && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-foreground hover:text-primary transition-smooth"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          )}
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && isAuthenticated && (
          <div className="md:hidden flex flex-col mt-3 pb-4 space-y-2 animate-fade-in-down">
            {navLinks.map(({ to, label, icon: Icon }) => {
              const isActive = location.pathname === to;
              return (
                <Link key={to} to={to} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="w-full justify-start gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Button>
                </Link>
              );
            })}
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4 mr-1" /> Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
