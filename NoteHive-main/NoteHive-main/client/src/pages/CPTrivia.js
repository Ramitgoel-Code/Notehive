import React, { useState, useEffect } from "react";
import { 
  FaClock, 
  FaTrophy, 
  FaStar, 
  FaRegSmileBeam, 
  FaRegSadTear,
  FaBrain,
  FaLightbulb,
  FaRegQuestionCircle,
  FaMedal,
  FaCheck,
  FaTimes
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from 'react-confetti';

const CPTrivia = () => {
  // State declarations
  const [quizData, setQuizData] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(2);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizFinished, setQuizFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [leaderboard, setLeaderboard] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [topic, setTopic] = useState("Data Structures");
  const [difficulty, setDifficulty] = useState("Medium");
  const [numQuestions, setNumQuestions] = useState(5);
  const [activeTab, setActiveTab] = useState("quiz"); // "quiz" or "leaderboard"
  const [showIntro, setShowIntro] = useState(true);

  // Constants
  const topics = [
    "React Js", "Node Js",
    "OOPS", "Operating System", "Computer Networks","Linux","Git",
    "DBMS", "System Design", "Data Structures", "Algorithms"
  ];

  const difficulties = ["Easy", "Medium", "Hard"];

  const difficultyColors = {
    Easy: {bg: "bg-green-100", text: "text-green-700", border: "border-green-300"},
    Medium: {bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300"},
    Hard: {bg: "bg-red-100", text: "text-red-700", border: "border-red-300"}
  };

  // Fetch trivia questions
  const fetchTriviaData = async () => {
    setLoading(true);
    setShowIntro(false);
    try {
      const response = await fetch("http://localhost:5000/api/generateTrivia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });

      const data = await response.json();

      if (data.quizzes) {
        setQuizData(data.quizzes);
        setCurrentQuestion(0);
        setScore(0);
        setAttemptsLeft(2);
        setQuizFinished(false);
        setSelectedAnswer(null);
        setTimer(60);
        setActiveTab("quiz");
      } else {
        setQuizData([]);
      }
    } catch (error) {
      console.error("Error fetching trivia:", error);
    }
    setLoading(false);
  };

  // Handle answer selection
  const handleAnswerClick = (option) => {
    if (selectedAnswer || attemptsLeft === 0) return;

    const isCorrect = option === quizData[currentQuestion].answer;
    
    if (isCorrect) {
      setScore(prev => prev + (attemptsLeft === 2 ? 10 : 5));
      setSelectedAnswer(option);
      setTimeout(nextQuestion, 1500);
    } else {
      setAttemptsLeft(prev => prev - 1);
      setSelectedAnswer(option);
      
      if (attemptsLeft === 2) {
        setTimeout(() => setSelectedAnswer(null), 1500);
      } else {
        setTimeout(nextQuestion, 1500);
      }
    }
  };

  // Move to next question or finish quiz
  const nextQuestion = () => {
    if (currentQuestion + 1 < quizData.length) {
      setCurrentQuestion(prev => prev + 1);
      setAttemptsLeft(2);
      setSelectedAnswer(null);
      setTimer(60);
    } else {
      setQuizFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
      updateLeaderboard();
      saveLeaderboard();
    }
  };

  // Timer logic
  useEffect(() => {
    if (quizFinished || loading || showIntro || quizData.length === 0) return;
    
    if (timer === 0) {
      nextQuestion();
      return;
    }

    const interval = setTimeout(() => setTimer(prev => prev - 1), 1000);
    return () => clearTimeout(interval);
  }, [timer, quizFinished, loading, showIntro, quizData.length]);

  // Update leaderboard
  const updateLeaderboard = () => {
    setLeaderboard(prev => [
      ...prev,
      { topic, difficulty, score, timestamp: new Date().toISOString() }
    ]);
  };

  const saveLeaderboard = async () => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    
    if (!token || !username) {
      console.warn("User not authenticated or missing username.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/saveLeaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ username, topic, difficulty, score }),
      });
  
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
  
      fetchLeaderboard();
    } catch (error) {
      console.error("Error saving leaderboard:", error);
    }
  };
  
  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.warn("No authentication token found.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/leaderboard/getLeaderboard", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      if (Array.isArray(data.leaderboard)) {
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      setLeaderboard([]);
    }
  };
  
  useEffect(() => {
    fetchLeaderboard();
  }, []);

  // Progress calculation
  const progress = quizData.length > 0 
    ? ((currentQuestion + 1) / quizData.length) * 100
    : 0;

  // Reset quiz function
  const resetQuiz = () => {
    setQuizFinished(false);
    setShowIntro(true);
    setQuizData([]);
    setCurrentQuestion(0);
    setScore(0);
    setAttemptsLeft(2);
    setSelectedAnswer(null);
    setTimer(60);
    setActiveTab("quiz");
  };

  // Get timer color based on remaining time
  const getTimerColor = () => {
    if (timer > 30) return "text-green-500";
    if (timer > 10) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-blue-50 to-purple-50 p-6 relative">
      {showConfetti && <Confetti recycle={false} numberOfPieces={400} />}

      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-4xl flex justify-between items-center mb-6"
      >
        <div className="flex items-center gap-2">
          <FaBrain className="text-3xl text-purple-600" />
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CP Trivia
          </h1>
        </div>

        {/* Tab Navigation */}
        {!showIntro && (
          <div className="flex bg-white rounded-lg shadow-md overflow-hidden">
            <button 
              onClick={() => setActiveTab("quiz")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === "quiz" 
                  ? "bg-blue-500 text-white" 
                  : "hover:bg-gray-100"
              }`}
            >
              <FaRegQuestionCircle />
              Quiz
            </button>
            <button 
              onClick={() => setActiveTab("leaderboard")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors ${
                activeTab === "leaderboard" 
                  ? "bg-blue-500 text-white" 
                  : "hover:bg-gray-100"
              }`}
            >
              <FaTrophy />
              Leaderboard
            </button>
          </div>
        )}
      </motion.header>

      <div className="w-full max-w-4xl">
        <AnimatePresence mode="wait">
          {/* Intro/Setup Screen */}
          {showIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <FaLightbulb className="text-3xl text-yellow-300" />
                  <h2 className="text-3xl font-bold">Welcome to CP Trivia!</h2>
                </div>
                <p className="text-lg opacity-90">
                  Test your knowledge in various computer science topics with our interactive quiz.
                  Challenge yourself, learn new concepts, and compete with others on our leaderboard!
                </p>
              </div>

              <div className="p-8">
                <div className="flex flex-col md:flex-row gap-6 mb-6">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Topic</label>
                    <div className="relative">
                      <select
                        className="w-full p-3 rounded-lg border border-gray-300 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                      >
                        {topics.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Difficulty</label>
                    <div className="grid grid-cols-3 gap-3">
                      {difficulties.map((d) => (
                        <button
                          key={d}
                          onClick={() => setDifficulty(d)}
                          className={`p-3 rounded-lg border text-center transition-all ${
                            difficulty === d
                              ? `${difficultyColors[d].bg} ${difficultyColors[d].text} border-2 ${difficultyColors[d].border}`
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={numQuestions}
                      onChange={(e) => setNumQuestions(Number(e.target.value))}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="w-10 h-10 flex items-center justify-center bg-blue-100 text-blue-600 font-bold rounded-full">
                      {numQuestions}
                    </span>
                  </div>
                </div>

                <motion.button 
                  onClick={fetchTriviaData}
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      🚀 Start Quiz!
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Quiz Section */}
          {!showIntro && activeTab === "quiz" && (
            <>
              {/* Quiz Status Bar - Always visible when quiz is active */}
              {quizData.length > 0 && !loading && (
                <motion.div
                  key="statusbar"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full bg-white rounded-xl shadow-md p-4 mb-4 flex flex-wrap justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      quizFinished ? "bg-purple-100" : "bg-blue-100"
                    }`}>
                      <span className={`text-lg font-bold ${
                        quizFinished ? "text-purple-600" : "text-blue-600"
                      }`}>
                        {currentQuestion + 1}/{quizData.length}
                      </span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Topic</span>
                      <span className="font-medium">{topic}</span>
                    </div>
                    
                    <div className="flex flex-col">
                      <span className="text-sm text-gray-500">Difficulty</span>
                      <span className={`font-medium ${difficultyColors[difficulty].text}`}>
                        {difficulty}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full">
                      <FaMedal className="text-blue-500" />
                      <span className="font-bold text-blue-700">{score} pts</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-orange-50 px-3 py-1 rounded-full">
                      <span className="font-bold text-orange-700">{attemptsLeft} {attemptsLeft === 1 ? 'try' : 'tries'} left</span>
                    </div>
                    
                    {!quizFinished && (
                      <div className={`flex items-center gap-1 bg-gray-50 px-3 py-1 rounded-full ${getTimerColor()}`}>
                        <FaClock />
                        <span className="font-bold">{timer}s</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Quiz Loading State */}
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full bg-white rounded-xl shadow-lg p-8 flex flex-col items-center justify-center h-80"
                >
                  <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-6"></div>
                  <h2 className="text-xl font-medium text-gray-700">Generating your quiz...</h2>
                  <p className="text-gray-500 mt-2">Preparing {numQuestions} {difficulty} questions about {topic}</p>
                </motion.div>
              )}

              {/* Quiz Questions */}
              {!loading && !quizFinished && quizData.length > 0 && (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                    <div className="h-1 bg-white bg-opacity-30 rounded-full mb-4 overflow-hidden">
                      <motion.div
                        className="h-full bg-white"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <h2 className="text-xl font-semibold mb-2">Question {currentQuestion + 1}</h2>
                    <p className="text-xl">{quizData[currentQuestion].question}</p>
                  </div>

                  <div className="p-6">
                    <div className="grid grid-cols-1 gap-4">
                      {quizData[currentQuestion].options.map((option, idx) => {
                        const isCorrect = option === quizData[currentQuestion].answer;
                        const isSelected = selectedAnswer === option;
                        
                        return (
                          <motion.div
                            key={idx}
                            whileHover={!selectedAnswer ? { scale: 1.02 } : {}}
                            whileTap={!selectedAnswer ? { scale: 0.98 } : {}}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              selectedAnswer
                                ? isCorrect
                                  ? 'bg-green-50 border-green-500'
                                  : isSelected
                                    ? 'bg-red-50 border-red-500'
                                    : 'bg-white border-gray-200'
                                : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                            }`}
                            onClick={() => handleAnswerClick(option)}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                selectedAnswer 
                                  ? isCorrect
                                    ? 'bg-green-100'
                                    : isSelected
                                      ? 'bg-red-100'
                                      : 'bg-gray-100'
                                  : 'bg-gray-100'
                              }`}>
                                {selectedAnswer ? (
                                  isCorrect ? (
                                    <FaCheck className="text-green-600" />
                                  ) : isSelected ? (
                                    <FaTimes className="text-red-600" />
                                  ) : (
                                    String.fromCharCode(65 + idx)
                                  )
                                ) : (
                                  String.fromCharCode(65 + idx)
                                )}
                              </div>
                              
                              <span className={`text-lg ${
                                selectedAnswer
                                  ? isCorrect 
                                    ? 'text-green-700 font-medium' 
                                    : isSelected 
                                      ? 'text-red-700 font-medium' 
                                      : 'text-gray-500'
                                  : 'text-gray-700'
                              }`}>
                                {option}
                              </span>
                              
                              {selectedAnswer && (isCorrect || isSelected) && (
                                <motion.span
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="ml-auto text-2xl"
                                >
                                  {isCorrect ? (
                                    <FaRegSmileBeam className="text-green-500" />
                                  ) : (
                                    <FaRegSadTear className="text-red-500" />
                                  )}
                                </motion.span>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quiz Finished Screen */}
              {quizFinished && quizData.length > 0 && (
                <motion.div
                  key="finished"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
                >
                  <div className="p-8 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="w-20 h-20 mx-auto mb-4 rounded-full bg-white bg-opacity-20 flex items-center justify-center"
                    >
                      <FaTrophy className="text-4xl text-yellow-300" />
                    </motion.div>
                    <h2 className="text-3xl font-bold mb-2">Quiz Completed!</h2>
                    <p className="text-xl opacity-90">You've completed the {difficulty} level quiz on {topic}</p>
                  </div>
                  
                  <div className="p-8">
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-center mb-8">
                      <div className="w-full md:w-auto bg-blue-50 p-6 rounded-xl text-center">
                        <p className="text-blue-500 font-medium">Final Score</p>
                        <p className="text-4xl font-bold text-blue-700">{score}</p>
                        <p className="text-sm text-blue-500">out of {quizData.length * 10} possible points</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 justify-center">
                        <div className="bg-green-50 p-4 rounded-lg text-center w-32">
                          <p className="text-green-600 font-medium">Accuracy</p>
                          <p className="text-2xl font-bold text-green-700">
                            {Math.round((score / (quizData.length * 10)) * 100)}%
                          </p>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg text-center w-32">
                          <p className="text-purple-600 font-medium">Questions</p>
                          <p className="text-2xl font-bold text-purple-700">{quizData.length}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={resetQuiz}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        Try Another Quiz
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setActiveTab("leaderboard")}
                        className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                      >
                        <FaTrophy className="text-yellow-500" />
                        View Leaderboard
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}

          {/* Leaderboard Section */}
          {!showIntro && activeTab === "leaderboard" && (
            <motion.div 
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                <div className="flex items-center gap-3">
                  <FaTrophy className="text-3xl text-white" />
                  <h2 className="text-2xl font-bold">Leaderboard</h2>
                </div>
                <p className="text-white text-opacity-90 mt-1">
                  See how you compare with other players across different topics and difficulties
                </p>
              </div>

              {leaderboard.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-gray-500">No quiz results yet. Complete a quiz to see your score here!</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Topic</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Difficulty</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Score</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {leaderboard.sort((a, b) => b.score - a.score).map((entry, idx) => (
                        <motion.tr
                          key={idx}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              {idx === 0 && (
                                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center">
                                  <FaStar className="text-yellow-500" />
                                </div>
                              )}
                              {idx === 1 && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                                  <FaStar className="text-gray-400" />
                                </div>
                              )}
                              {idx === 2 && (
                                <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                                  <FaStar className="text-yellow-700" />
                                </div>
                              )}
                              {idx > 2 && (
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 font-medium">
                                  {idx + 1}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{entry.topic}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{entry.topic}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-medium rounded-full ${
                              difficultyColors[entry.difficulty].bg
                            } ${difficultyColors[entry.difficulty].text}`}>
                              {entry.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-blue-600">{entry.score}</span>
                              <span className="ml-1 text-xs text-gray-500">pts</span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="p-6 bg-gray-50 border-t border-gray-200">
                {quizFinished ? (
                  <div className="flex flex-col sm:flex-row gap-4">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setActiveTab("quiz")}
                      className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      Back to Results
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={resetQuiz}
                      className="flex-1 py-3 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                    >
                      Start New Quiz
                    </motion.button>
                  </div>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={resetQuiz}
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    Start New Quiz
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>CP Trivia - Challenge your coding knowledge!</p>
        <p className="mt-1">Made with ❤️ for programmers and CS enthusiasts</p>
      </footer>
    </div>
  );
};

export default CPTrivia;