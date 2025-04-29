
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calendar, CheckCircle } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-brand-gray to-white">
      {/* Header/Navbar */}
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <div className="text-2xl font-bold text-brand-purple">Friday Flow</div>
        <div className="flex gap-4">
          <Button 
            variant="outline" 
            className="border-brand-purple text-brand-purple hover:bg-brand-purple/10"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
          <Button 
            className="bg-brand-purple hover:bg-brand-purple/90"
            onClick={() => navigate("/signup")}
          >
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 container max-w-7xl mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-brand-dark">
            Did You Just Funk Your Friday Calendar Meeting?
          </h1>
          <p className="text-xl text-gray-600">
            Transform your Friday chaos into flow. Organize tasks, track progress, and make your team meetings actually productive.
          </p>
          <Button 
            size="lg" 
            className="text-lg bg-brand-purple hover:bg-brand-purple/90 px-8 py-6"
            onClick={() => navigate("/signup")}
          >
            You Need Me
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <div className="absolute -top-6 -left-6 w-64 h-64 bg-brand-lightPurple rounded-lg transform -rotate-6 animate-pulse-subtle"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg border border-gray-200 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">Friday Meeting</h3>
              <Calendar className="text-brand-purple" />
            </div>
            <div className="space-y-3">
              {[
                "Review weekly progress",
                "Demo new features",
                "Plan next sprint"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                  <CheckCircle size={18} className="text-brand-purple" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-brand-purple/10 rounded text-sm text-brand-purple font-medium">
              Ready for your most productive Friday yet!
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-brand-blue/20 rounded-lg transform rotate-12 animate-pulse-subtle delay-300"></div>
        </div>
      </main>

      {/* Features */}
      <section className="bg-white py-16">
        <div className="container max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Friday Flow Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Organize Tasks",
                desc: "Keep all your projects and tasks in one place, categorized and prioritized.",
                icon: "📋"
              },
              {
                title: "Track Progress",
                desc: "See what's done, what's in progress, and what's stuck at a glance.",
                icon: "📊"
              },
              {
                title: "Collaborate Effectively",
                desc: "Assign tasks, add comments, and keep your team aligned.",
                icon: "🤝"
              }
            ].map((feature, i) => (
              <div key={i} className="p-6 border rounded-lg transition-all hover:shadow-md">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8">
        <div className="container max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-600">© {new Date().getFullYear()} Friday Flow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
