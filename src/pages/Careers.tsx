
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const jobOpenings = [
  {
    id: 1,
    title: "Senior Game Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for a senior game developer with experience in React and interactive web applications to help expand the Door of Illusions universe.",
    requirements: [
      "5+ years of experience in web game development",
      "Strong JavaScript/TypeScript skills",
      "Experience with React or similar frameworks",
      "Understanding of game design principles",
      "Knowledge of AI and machine learning concepts a plus"
    ],
    postedDate: "2025-04-28"
  },
  {
    id: 2,
    title: "Game Psychology Consultant",
    department: "Design",
    location: "Remote",
    type: "Contract",
    description: "Help us design deeper psychological elements for our games by leveraging your expertise in behavioral psychology and cognitive science.",
    requirements: [
      "Advanced degree in Psychology, Cognitive Science, or related field",
      "Experience in game design or UX psychology",
      "Understanding of decision-making processes and cognitive biases",
      "Ability to translate psychological principles into game mechanics",
      "Published research or game credits a plus"
    ],
    postedDate: "2025-05-02"
  },
  {
    id: 3,
    title: "AI/ML Engineer",
    department: "Engineering",
    location: "Hybrid (San Francisco)",
    type: "Full-time",
    description: "Join our AI team to enhance our adaptive game AI systems that create personalized player experiences in Door of Illusions and future titles.",
    requirements: [
      "3+ years of experience in AI/ML engineering",
      "Expertise in natural language processing",
      "Experience with TensorFlow, PyTorch, or similar frameworks",
      "Understanding of reinforcement learning",
      "Game AI development experience is highly desirable"
    ],
    postedDate: "2025-05-10"
  },
  {
    id: 4,
    title: "Community Manager",
    department: "Marketing",
    location: "Remote",
    type: "Full-time",
    description: "Build and nurture our growing community of psychological game enthusiasts across various platforms including Discord, Reddit, and social media.",
    requirements: [
      "2+ years of community management experience",
      "Excellent written and verbal communication skills",
      "Experience moderating online communities",
      "Understanding of gaming communities and cultures",
      "Data-driven approach to community growth and engagement"
    ],
    postedDate: "2025-05-08"
  },
  {
    id: 5,
    title: "Blockchain Integration Specialist",
    department: "Engineering",
    location: "Remote",
    type: "Contract",
    description: "Help us expand our blockchain integration for player achievements, rewards, and digital assets in our gaming ecosystem.",
    requirements: [
      "3+ years of experience with blockchain technologies",
      "Experience with Ethereum, smart contracts, and web3.js",
      "Understanding of NFTs and digital asset management",
      "Experience integrating blockchain with web applications",
      "Gaming industry experience a plus"
    ],
    postedDate: "2025-05-12"
  }
];

const benefits = [
  {
    title: "Flexible Working",
    description: "Work from anywhere with flexible hours that fit your lifestyle."
  },
  {
    title: "Competitive Compensation",
    description: "Salary packages that recognize your skills and experience, plus equity options."
  },
  {
    title: "Learning Budget",
    description: "Annual budget for courses, books, and conferences to keep growing your skills."
  },
  {
    title: "Health & Wellness",
    description: "Comprehensive health coverage and wellness programs to keep you at your best."
  },
  {
    title: "Team Retreats",
    description: "Regular company retreats to connect with the team in person at exciting locations."
  },
  {
    title: "Game Library",
    description: "Access to a vast library of games for research, inspiration, and enjoyment."
  }
];

const coreValues = [
  {
    title: "Psychological Innovation",
    description: "We push boundaries by applying psychological principles to create unique gaming experiences."
  },
  {
    title: "Player-Centered Design",
    description: "We design with players' minds and emotions at the center of everything we create."
  },
  {
    title: "Ethical AI",
    description: "We develop AI systems that create engaging experiences while respecting ethical boundaries."
  },
  {
    title: "Continuous Learning",
    description: "We're constantly learning, experimenting, and adapting to create better experiences."
  },
  {
    title: "Inclusive Gaming",
    description: "We create games that welcome diverse players and perspectives."
  }
];

const Careers = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Careers at <span className="text-purple-400">Door of Illusions</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg">
            Join our team building the future of psychological gaming experiences that challenge the mind and engage the senses.
          </p>
        </div>
        
        <div className="mb-16">
          <Card className="bg-black/60 border-purple-500/30 overflow-hidden">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2 p-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-purple-400">Why Join Us?</h2>
                <p className="mb-4">
                  We're a team of game developers, psychologists, and AI specialists passionate about creating 
                  unique gaming experiences that explore the human mind.
                </p>
                <p className="mb-6">
                  At Door of Illusions Studios, you'll work on cutting-edge psychological games that blend 
                  technology, art, and behavioral science to create unforgettable player experiences.
                </p>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Learn About Our Culture
                </Button>
              </div>
              <div className="md:w-1/2 bg-purple-900/30 p-8 border-t md:border-t-0 md:border-l border-purple-500/30">
                <h3 className="text-xl font-bold mb-4 text-purple-400">Our Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {benefits.slice(0, 4).map((benefit, index) => (
                    <div key={index} className="mb-3">
                      <h4 className="text-purple-300 font-semibold">{benefit.title}</h4>
                      <p className="text-sm text-gray-300">{benefit.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
            Open <span className="text-purple-400">Positions</span>
          </h2>
          
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="marketing">Marketing</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {jobOpenings.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </TabsContent>
            
            <TabsContent value="engineering" className="space-y-4">
              {jobOpenings
                .filter(job => job.department === "Engineering")
                .map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              }
            </TabsContent>
            
            <TabsContent value="design" className="space-y-4">
              {jobOpenings
                .filter(job => job.department === "Design")
                .map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              }
            </TabsContent>
            
            <TabsContent value="marketing" className="space-y-4">
              {jobOpenings
                .filter(job => job.department === "Marketing")
                .map((job) => (
                  <JobCard key={job.id} job={job} />
                ))
              }
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {coreValues.map((value, index) => (
              <Card key={index} className="bg-black/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-purple-400">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Don't see a position that fits?
          </h2>
          <p className="mb-6">
            We're always looking for talented individuals passionate about psychological gaming experiences.
            Send us your resume and let us know how you could contribute to our team.
          </p>
          <Button className="bg-purple-600 hover:bg-purple-700">
            Submit Open Application
          </Button>
        </div>
      </div>
    </div>
  );
};

const JobCard = ({ job }: { job: any }) => {
  return (
    <Card className="bg-black/60 border-purple-500/30 hover:border-purple-400/50 transition-colors">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
          <div>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription className="text-gray-400">{job.department} • {job.location}</CardDescription>
          </div>
          <Badge variant={job.type === "Full-time" ? "default" : "outline"} className="self-start">
            {job.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4">{job.description}</p>
        <div className="space-y-2">
          <h4 className="font-semibold text-purple-400">Requirements:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {job.requirements.map((req: string, i: number) => (
              <li key={i} className="text-sm">{req}</li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="text-sm text-gray-400">
          Posted: {new Date(job.postedDate).toLocaleDateString()}
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Careers;
