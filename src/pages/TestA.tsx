
import { ArrowRight, CheckCircle, ChevronRight, Play, Sparkles, Zap, Globe, Headphones, Users, FileAudio, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const TestA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  
  // Animation on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Rotate through features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <div className="relative">
              <FileAudio className="h-5 w-5 text-primary" />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
            </div>
            <span className="text-xl">Whisper<span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 font-extrabold">AI</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors relative group">
              Features
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors relative group">
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild className="border-primary/20 hover:border-primary/50 transition-colors">
              <Link to="/">Sign In</Link>
            </Button>
            <Button size="sm" asChild className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 transition-colors">
              <Link to="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div 
          className={`container px-4 md:px-6 transition-all duration-1000 transform ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Introducing Whisper AI</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-primary to-indigo-700 dark:from-white dark:via-primary dark:to-indigo-400">
                Transform Speech to Text <br className="hidden sm:inline" />
                with Unmatched Accuracy
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Our advanced AI-powered transcription service helps you convert audio and video to text in seconds.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 transition-colors shadow-lg shadow-primary/20">
                Try for Free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" className="gap-2 border-primary/20 hover:border-primary/50 transition-colors">
                <Play className="h-4 w-4" /> Watch Demo
              </Button>
            </div>
            
            {/* Floating badges */}
            <div className="relative w-full max-w-2xl h-16 mt-8">
              <div className="absolute left-0 top-0 animate-float-slow">
                <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-primary shadow-sm">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>99% Accuracy</span>
                </div>
              </div>
              <div className="absolute right-0 top-4 animate-float-medium">
                <div className="flex items-center gap-1.5 rounded-full bg-indigo-500/10 px-3 py-1.5 text-indigo-500 shadow-sm">
                  <Globe className="h-3.5 w-3.5" />
                  <span>50+ Languages</span>
                </div>
              </div>
              <div className="absolute left-1/4 bottom-0 animate-float-fast">
                <div className="flex items-center gap-1.5 rounded-full bg-purple-500/10 px-3 py-1.5 text-purple-500 shadow-sm">
                  <Zap className="h-3.5 w-3.5" />
                  <span>Real-time Processing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-16 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-white dark:to-slate-900 pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900 relative">
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 bg-[size:30px_30px] pointer-events-none"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl mb-4">
              Powerful <span className="text-primary">Features</span>
            </h2>
            <p className="mx-auto max-w-[600px] text-muted-foreground">
              Our cutting-edge technology delivers exceptional results for all your transcription needs
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-3">
            <div className={`flex flex-col items-center text-center space-y-4 transition-all duration-500 ${activeFeature === 0 ? 'scale-105' : 'scale-100'}`}>
              <div className="rounded-full bg-gradient-to-br from-primary/20 to-primary/5 p-5 shadow-lg shadow-primary/5">
                <Headphones className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Accurate Transcription</h3>
              <p className="text-muted-foreground">
                Industry-leading accuracy with support for over 50 languages and dialects.
              </p>
              <div className="pt-2">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80 hover:bg-primary/5 gap-1">
                  Learn more <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className={`flex flex-col items-center text-center space-y-4 transition-all duration-500 ${activeFeature === 1 ? 'scale-105' : 'scale-100'}`}>
              <div className="rounded-full bg-gradient-to-br from-indigo-500/20 to-indigo-500/5 p-5 shadow-lg shadow-indigo-500/5">
                <Zap className="h-8 w-8 text-indigo-500" />
              </div>
              <h3 className="text-xl font-bold">Fast Processing</h3>
              <p className="text-muted-foreground">
                Get your transcriptions in seconds, not hours, with our optimized processing.
              </p>
              <div className="pt-2">
                <Button variant="ghost" size="sm" className="text-indigo-500 hover:text-indigo-500/80 hover:bg-indigo-500/5 gap-1">
                  Learn more <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className={`flex flex-col items-center text-center space-y-4 transition-all duration-500 ${activeFeature === 2 ? 'scale-105' : 'scale-100'}`}>
              <div className="rounded-full bg-gradient-to-br from-purple-500/20 to-purple-500/5 p-5 shadow-lg shadow-purple-500/5">
                <Users className="h-8 w-8 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold">Speaker Identification</h3>
              <p className="text-muted-foreground">
                Automatically identify different speakers in your audio for better readability.
              </p>
              <div className="pt-2">
                <Button variant="ghost" size="sm" className="text-purple-500 hover:text-purple-500/80 hover:bg-purple-500/5 gap-1">
                  Learn more <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-slate-50 dark:bg-slate-800/50">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-2">What Our Users Say</h2>
            <p className="text-muted-foreground">Trusted by thousands of professionals worldwide</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "WhisperAI has revolutionized how we handle meeting transcriptions. The accuracy is incredible!",
                author: "Sarah Johnson",
                role: "Product Manager",
                color: "from-primary/10 to-primary/5",
                textColor: "text-primary"
              },
              {
                quote: "The speaker identification feature saves me hours of work when transcribing interviews.",
                author: "Michael Chen",
                role: "Journalist",
                color: "from-indigo-500/10 to-indigo-500/5",
                textColor: "text-indigo-500"
              },
              {
                quote: "I've tried many transcription services, but WhisperAI is by far the most accurate and reliable.",
                author: "Emily Rodriguez",
                role: "Content Creator",
                color: "from-purple-500/10 to-purple-500/5",
                textColor: "text-purple-500"
              }
            ].map((testimonial, i) => (
              <div key={i} className={`rounded-xl bg-gradient-to-br ${testimonial.color} p-6 shadow-md`}>
                <div className="flex flex-col h-full justify-between">
                  <div>
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Sparkles key={i} className={`h-4 w-4 ${testimonial.textColor}`} />
                      ))}
                    </div>
                    <p className="italic mb-4">"{testimonial.quote}"</p>
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-indigo-500/5"></div>
        <div className="container px-4 md:px-6 relative">
          <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Wand2 className="h-3.5 w-3.5" />
              <span>Limited Time Offer</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Your Audio?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of users who trust our service for their transcription needs.
                Get started today with our special introductory pricing.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-4 mt-4">
              <Button className="w-full" size="lg" asChild 
                style={{
                  background: "linear-gradient(135deg, var(--primary) 0%, #4f46e5 100%)",
                  boxShadow: "0 10px 20px -10px rgba(79, 70, 229, 0.4)"
                }}>
                <Link to="/pricing">
                  View Pricing <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <p className="text-xs text-muted-foreground">
                No credit card required. 7-day free trial available.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">API</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Integrations</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Resources</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Documentation</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Guides</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Support</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">API Status</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">About</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Careers</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Press</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Privacy</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Terms</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Cookie Policy</Link></li>
                <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Licenses</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileAudio className="h-5 w-5 text-primary" />
              <span className="font-bold">Whisper<span className="text-primary">AI</span></span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} WhisperAI. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
              </Link>
              <Link to="/" aria-label="GitHub" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
              </Link>
              <Link to="/" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect width="4" height="12" x="2" y="9"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Add custom animations to the stylesheet */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 5s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .bg-grid-slate-100 {
          background-image: linear-gradient(to right, rgba(226, 232, 240, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(226, 232, 240, 0.1) 1px, transparent 1px);
        }
        .bg-grid-slate-800 {
          background-image: linear-gradient(to right, rgba(30, 41, 59, 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(30, 41, 59, 0.1) 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default TestA;
