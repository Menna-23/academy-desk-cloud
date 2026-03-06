import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Shield, Users, BookOpen, ArrowRight, CheckCircle, Video, Mic, Paperclip, ClipboardList, BarChart2, MessageSquare } from "lucide-react";

const features = [
  {
    icon: Video,
    title: "Educational Videos",
    description: "Upload and organize educational videos by subject and topic.",
  },
  {
    icon: Mic,
    title: "Audio Recordings",
    description: "Easily upload audio lectures for students to access anytime.",
  },
  {
    icon: Paperclip,
    title: "Attachments",
    description: "Add one or more attachments to each video lesson.",
  },
  {
    icon: ClipboardList,
    title: "Exams & Quizzes",
    description: "Self-correcting tests with an integrated question bank.",
  },
  {
    icon: BarChart2,
    title: "Student Tracking",
    description: "Monitor student progress with detailed statistics and insights.",
  },
  {
    icon: MessageSquare,
    title: "Discussion Forum",
    description: "Discuss subject-related topics and questions with students.",
  },
];

const stats = [
  { value: "+7,500", label: "Students" },
  { value: "+60", label: "Instructors" },
  { value: "+7,000", label: "Videos" },
  { value: "+1,000,000", label: "Views" },
];

const faqs = [
  {
    q: "Where are my videos stored?",
    a: "Videos are saved in your account and remain available on the platform until you delete them yourself.",
  },
  {
    q: "How are my videos protected from downloading?",
    a: "Student apps block all forms of screen recording. The student's name also appears randomly over the video to identify them if they film the screen with another device.",
  },
  {
    q: "I run a tutoring center — can I subscribe?",
    a: "Yes! The platform lets you add all instructors working at your center. Students will also see your center's logo when using the app.",
  },
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-secondary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">EduCore</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition">Features</a>
            <a href="#stats" className="hover:text-foreground transition">Stats</a>
            <a href="#about" className="hover:text-foreground transition">About</a>
            <a href="#faq" className="hover:text-foreground transition">FAQ</a>
          </div>
          <Button onClick={() => navigate("/login")} variant="outline" size="sm">
            Login
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-navy py-24 md:py-36">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full bg-secondary blur-3xl" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-secondary/20 text-secondary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Trusted by Educational Institutions
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight">
            EduCore — The Bridge Between Teacher and Student
          </h1>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto mb-10">
            EduCore is an e-learning system that connects teachers and students, providing all the integrated solutions to deliver educational services easily from anywhere — with a seamless experience and continuous technical support.
          </p>
          <div className="flex justify-center">
            <Button onClick={() => navigate("/login")} size="lg" className="gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/90 text-base px-8 py-6">
              Start <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-foreground mb-3">EduCore Educational System</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A premium learning experience for you and your students — deliver your educational services in a distinctive way.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f) => (
              <div key={f.title} className="bg-card border border-border rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-4">
                  <f.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 bg-gradient-navy">
        <div className="max-w-5xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-foreground mb-2">EduCore by the Numbers</h2>
          <p className="text-primary-foreground/60">What EduCore has achieved so far</p>
        </div>
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-secondary mb-1">{s.value}</p>
              <p className="text-primary-foreground/70 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-background">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">About EduCore</h2>
          <p className="text-muted-foreground leading-relaxed">
            EduCore is an electronic system that allows teachers to upload educational videos and audio recordings and attach supplementary files, accessible online with regular follow-ups. Students can watch lectures, take quizzes with instant automatic grading, and benefit from 24/7 technical support — all designed to ensure a comprehensive educational experience. EduCore is available on Windows, Android & iOS mobile apps, and a web dashboard accessible from any browser.
          </p>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-muted/30">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-foreground text-center mb-10">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-card-foreground mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-navy">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-primary-foreground mb-4">Contact Us</h2>
          <p className="text-primary-foreground/70 mb-8">
            Subscribe to EduCore now and step into the future of education.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              Contact Sales
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              Technical Support
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-card border-t border-border text-center text-sm text-muted-foreground">
        © 2026 EduCore Educational System. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing;
