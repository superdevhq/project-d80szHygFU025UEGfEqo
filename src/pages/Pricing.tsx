
import { Check, ChevronRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const PricingCard = ({
  title,
  price,
  description,
  features,
  popular,
  buttonText,
  buttonVariant = "default",
}: {
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  buttonText: string;
  buttonVariant?: "default" | "outline";
}) => (
  <Card className={`flex flex-col ${popular ? "border-primary shadow-lg" : ""}`}>
    {popular && (
      <div className="absolute -top-3 left-0 right-0 flex justify-center">
        <Badge variant="default" className="px-3 py-1 text-xs">Most Popular</Badge>
      </div>
    )}
    <CardHeader className="flex flex-col space-y-1.5">
      <CardTitle className="text-2xl font-bold">{title}</CardTitle>
      <div>
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Custom" && <span className="text-muted-foreground ml-1">/month</span>}
      </div>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-1">
      <ul className="space-y-2 text-sm">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2">
            <Check className="h-4 w-4 text-primary" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </CardContent>
    <CardFooter>
      <Button variant={buttonVariant} className="w-full" size="lg">
        {buttonText} <ChevronRight className="ml-1 h-4 w-4" />
      </Button>
    </CardFooter>
  </Card>
);

const Pricing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold">
            <Link to="/" className="text-xl">Whisper<span className="text-primary">AI</span></Link>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/pricing" className="text-sm font-medium text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Pricing Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-12">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Simple, Transparent Pricing
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                Choose the plan that's right for you and start transcribing today.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Monthly</span>
              <Button variant="outline" size="sm" className="rounded-full px-3">
                Save 20%
              </Button>
              <span className="text-sm font-medium">Annually</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8 relative">
            <PricingCard
              title="Free"
              price="$0"
              description="Perfect for trying out our service"
              features={[
                "10 minutes of transcription per month",
                "Standard accuracy",
                "Basic speaker identification",
                "Export to text format",
                "Email support"
              ]}
              buttonText="Get Started"
              buttonVariant="outline"
            />
            <PricingCard
              title="Pro"
              price="$19"
              description="For individuals and small teams"
              features={[
                "5 hours of transcription per month",
                "High accuracy",
                "Advanced speaker identification",
                "Export to multiple formats",
                "Priority email support",
                "Subtitle generation"
              ]}
              popular={true}
              buttonText="Start Free Trial"
            />
            <PricingCard
              title="Enterprise"
              price="Custom"
              description="For organizations with advanced needs"
              features={[
                "Unlimited transcription",
                "Highest accuracy",
                "Custom vocabulary training",
                "API access",
                "Dedicated account manager",
                "Custom integrations",
                "SLA guarantees"
              ]}
              buttonText="Contact Sales"
            />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tighter">Frequently Asked Questions</h2>
            <p className="text-muted-foreground max-w-[600px]">
              Find answers to common questions about our transcription service.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
            <div className="space-y-2">
              <h3 className="text-xl font-bold">How accurate is the transcription?</h3>
              <p className="text-muted-foreground">
                Our transcription service achieves over 95% accuracy for clear audio in supported languages. Accuracy may vary based on audio quality, accents, and background noise.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">What file formats are supported?</h3>
              <p className="text-muted-foreground">
                We support most common audio and video formats including MP3, MP4, WAV, M4A, FLAC, and more.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">How does speaker identification work?</h3>
              <p className="text-muted-foreground">
                Our AI analyzes voice patterns, speaking styles, and context to identify different speakers in the conversation, labeling them as Speaker 1, Speaker 2, etc.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold">Can I cancel my subscription anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. Your access will continue until the end of your current billing period.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Start Transcribing?
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
                Try our service for free, no credit card required.
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button className="w-full" size="lg">
                Start Free Trial
              </Button>
              <p className="text-xs text-muted-foreground">
                No credit card required. Cancel anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} WhisperAI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link to="/" className="hover:underline">Privacy</Link>
            <Link to="/" className="hover:underline">Terms</Link>
            <Link to="/" className="hover:underline">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
