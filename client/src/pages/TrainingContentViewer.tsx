import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  PlayCircle, 
  FileText, 
  CheckCircle2, 
  Clock, 
  BookOpen, 
  Download,
  ArrowLeft,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { Link, useParams } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
}

export default function TrainingContentViewer() {
  const { id: trainingId } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentSection, setCurrentSection] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const { data: training } = useQuery({
    queryKey: ['/api/trainings', trainingId],
    enabled: !!trainingId,
  });

  const { data: quizzes = [] } = useQuery({
    queryKey: ['/api/trainings', trainingId, 'quizzes'],
    enabled: !!trainingId,
  });

  const { data: userProgress } = useQuery({
    queryKey: ['/api/me/progress', trainingId],
    enabled: !!user && !!trainingId,
  });

  const updateProgressMutation = useMutation({
    mutationFn: async (data: { section: number; completed?: boolean }) => {
      return apiRequest("POST", `/api/trainings/${trainingId}/progress`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/me/progress'] });
      toast({
        title: "Progress Updated",
        description: "Your learning progress has been saved.",
      });
    },
  });

  const submitQuizMutation = useMutation({
    mutationFn: async (answers: Record<number, string>) => {
      return apiRequest("POST", `/api/trainings/${trainingId}/quiz-submit`, { answers });
    },
    onSuccess: (data) => {
      setQuizSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ['/api/me/progress'] });
      toast({
        title: "Quiz Submitted",
        description: `You scored ${data.score}%! ${data.passed ? 'Congratulations!' : 'Keep practicing!'}`,
        variant: data.passed ? "default" : "destructive",
      });
    },
  });

  if (!training) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading training content...</p>
        </div>
      </div>
    );
  }

  const handleSectionComplete = (sectionIndex: number) => {
    updateProgressMutation.mutate({ 
      section: sectionIndex,
      completed: sectionIndex === sections.length - 1 
    });
  };

  const handleQuizSubmit = () => {
    if (Object.keys(quizAnswers).length < quizzes.length) {
      toast({
        title: "Incomplete Quiz",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    submitQuizMutation.mutate(quizAnswers);
  };

  const calculateQuizScore = () => {
    if (!quizSubmitted) return 0;
    let correct = 0;
    quizzes.forEach((quiz: QuizQuestion) => {
      if (quizAnswers[quiz.id] === quiz.correct_answer) {
        correct++;
      }
    });
    return Math.round((correct / quizzes.length) * 100);
  };

  // Mock sections for different training types
  const sections = [
    {
      title: "Introduction",
      type: "video",
      duration: "5 min",
      content: "Welcome to this comprehensive training on " + training.title,
    },
    {
      title: "Core Concepts",
      type: "document", 
      duration: "15 min",
      content: "Understanding the fundamental principles and biblical foundations.",
    },
    {
      title: "Practical Application",
      type: "video",
      duration: "20 min", 
      content: "Learn how to apply these concepts in your daily prayer life.",
    },
    {
      title: "Assessment",
      type: "quiz",
      duration: "10 min",
      content: "Test your understanding with this interactive quiz.",
    },
  ];

  const renderSectionContent = (section: any, index: number) => {
    switch (section.type) {
      case "video":
        return (
          <div className="space-y-4">
            <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
              <div className="text-center text-white">
                <PlayCircle className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">Video Player</p>
                <p className="text-sm opacity-75">Duration: {section.duration}</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              <p className="text-gray-600">{section.content}</p>
            </div>
            <Button 
              onClick={() => handleSectionComplete(index)}
              className="w-full"
            >
              Mark as Complete
            </Button>
          </div>
        );

      case "document":
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <FileText className="w-6 h-6 mr-2 text-blue-600" />
                <h3 className="text-lg font-semibold">{section.title}</h3>
              </div>
              <div className="prose max-w-none">
                <p className="mb-4">{section.content}</p>
                <h4 className="font-semibold mb-2">Key Learning Points:</h4>
                <ul className="list-disc list-inside space-y-2">
                  <li>Biblical foundations of prayer and intercession</li>
                  <li>Understanding spiritual authority and responsibility</li>
                  <li>Developing a consistent prayer life</li>
                  <li>Recognizing spiritual patterns and cycles</li>
                </ul>
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h5 className="font-semibold text-blue-900 mb-2">Scripture Reference:</h5>
                  <p className="text-blue-800 italic">
                    "Therefore he is able to save completely those who come to God through him, 
                    because he always lives to intercede for them." - Hebrews 7:25
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                onClick={() => handleSectionComplete(index)}
                className="flex-1"
              >
                Mark as Complete
              </Button>
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">Knowledge Assessment</h3>
              <p className="text-gray-600">Test your understanding of the material</p>
            </div>

            {quizzes.length > 0 ? (
              <div className="space-y-6">
                {quizzes.map((quiz: QuizQuestion, qIndex: number) => (
                  <Card key={quiz.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Question {qIndex + 1} of {quizzes.length}
                      </CardTitle>
                      <CardDescription>{quiz.question}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {quiz.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`q${quiz.id}_o${optIndex}`}
                              name={`question_${quiz.id}`}
                              value={option}
                              checked={quizAnswers[quiz.id] === option}
                              onChange={(e) => setQuizAnswers(prev => ({
                                ...prev,
                                [quiz.id]: e.target.value
                              }))}
                              disabled={quizSubmitted}
                              className="text-primary focus:ring-primary"
                            />
                            <label 
                              htmlFor={`q${quiz.id}_o${optIndex}`}
                              className={`cursor-pointer ${
                                quizSubmitted 
                                  ? option === quiz.correct_answer 
                                    ? 'text-green-600 font-medium'
                                    : quizAnswers[quiz.id] === option 
                                      ? 'text-red-600' 
                                      : 'text-gray-500'
                                  : ''
                              }`}
                            >
                              {option}
                            </label>
                            {quizSubmitted && option === quiz.correct_answer && (
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {quizSubmitted && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <div className="mb-4">
                        <div className="text-2xl font-bold mb-2">
                          Your Score: {calculateQuizScore()}%
                        </div>
                        <Progress value={calculateQuizScore()} className="w-full max-w-md mx-auto" />
                      </div>
                      <p className="text-gray-600 mb-4">
                        {calculateQuizScore() >= 70 
                          ? "Congratulations! You passed the assessment."
                          : "Keep studying and try again to improve your score."
                        }
                      </p>
                      <Button 
                        variant="outline"
                        onClick={() => {
                          setQuizAnswers({});
                          setQuizSubmitted(false);
                        }}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Retake Quiz
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {!quizSubmitted && (
                  <Button 
                    onClick={handleQuizSubmit}
                    disabled={Object.keys(quizAnswers).length < quizzes.length}
                    className="w-full"
                  >
                    Submit Quiz
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No quiz questions available for this training.</p>
                <Button 
                  onClick={() => handleSectionComplete(index)}
                  className="mt-4"
                >
                  Complete Section
                </Button>
              </div>
            )}
          </div>
        );

      default:
        return <div>Content not available</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" asChild>
                <Link to="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{training.title}</h1>
                <p className="text-sm text-gray-600">{training.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                Progress: {Math.round(((currentSection + 1) / sections.length) * 100)}%
              </div>
              <Progress 
                value={((currentSection + 1) / sections.length) * 100} 
                className="w-32"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Course Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {sections.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSection(index)}
                      className={`w-full text-left p-3 hover:bg-gray-50 border-b last:border-b-0 ${
                        currentSection === index ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {section.type === 'video' && <PlayCircle className="w-4 h-4" />}
                          {section.type === 'document' && <FileText className="w-4 h-4" />}
                          {section.type === 'quiz' && <CheckCircle2 className="w-4 h-4" />}
                          <span className="text-sm font-medium">{section.title}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{section.duration}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardContent className="p-6">
                {renderSectionContent(sections[currentSection], currentSection)}
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                disabled={currentSection === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={() => setCurrentSection(Math.min(sections.length - 1, currentSection + 1))}
                disabled={currentSection === sections.length - 1}
              >
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}