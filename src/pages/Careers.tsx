
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Careers = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Resume Sent!",
        description: "Thanks for your interest. We'll be in touch soon.",
      });
      setIsSubmitting(false);
      setName("");
      setEmail("");
      setMessage("");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join <span className="text-purple-400">Our Team</span>
          </h1>
          <p className="text-lg text-purple-300">Catch Me If You Can</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <Card className="bg-black/60 border-purple-500/30 shadow-lg">
            <CardContent className="p-8">
              <p className="text-gray-100 mb-8 text-lg">
                We're a team of hackathon enthusiasts building psychological gaming experiences that challenge the mind. 
                "Catch Me If You Can" started as a weekend project and is growing into something bigger. 
                Whether you're a developer, designer, or have a psychology background, we'd love to explore 
                collaboration opportunities for future hackathons or group projects.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                      Send Resume
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-black/90 border-purple-500/30">
                    <DialogHeader>
                      <DialogTitle className="text-white">Send Your Resume</DialogTitle>
                      <DialogDescription className="text-gray-300">
                        Share your details with us and let's collaborate on future projects.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 py-2">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">Name</Label>
                        <Input 
                          id="name" 
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Your name" 
                          className="bg-purple-950/20 border-purple-500/30 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-white">Email</Label>
                        <Input 
                          id="email" 
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com" 
                          className="bg-purple-950/20 border-purple-500/30 text-white"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-white">Message</Label>
                        <Textarea 
                          id="message" 
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder="Tell us about your skills and interests..." 
                          className="bg-purple-950/20 border-purple-500/30 text-white min-h-[100px]"
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button 
                          type="submit" 
                          className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Sending..." : "Send"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
                <a 
                  href="https://www.instagram.com/cm_guptaji/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-white hover:text-purple-300 transition"
                >
                  <Instagram size={20} />
                  <span>Connect on Instagram</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Careers;
