const { GoogleGenerativeAI } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const generateTrivia = async (req, res) => {
  try {
    const { topic, difficulty, numQuestions } = req.body;

    if (!topic || !difficulty || !numQuestions) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Generate ${numQuestions} unique multiple-choice quiz questions on the topic of ${topic} at ${difficulty} difficulty level.
    
    Follow these strict formatting rules:
    1. Each question must have exactly 4 options
    2. Only one of the options should be correct
    3. The correct answer should be one of the provided options
    4. Make the questions challenging but fair for the ${difficulty} difficulty level
    5. Format as a pure JSON array

    Return the response in this exact JSON format:
    [
      {
        "question": "Question text here?",
        "options": ["Option A", "Option B", "Option C", "Option D"],
        "answer": "Correct option exactly as it appears in the options array"
      }
    ]

    Do not include any explanations, markdown formatting or code block tags in your response. Just return the raw JSON array.`;

    // Set structured response to ensure we get proper JSON
    const generationConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 8192,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const textResponse = result.response.text();
    console.log("Raw API Response:", textResponse); // Debugging

    // More robust JSON extraction
    let cleanedJSON = textResponse;

    // Handle cases where the API might wrap the response in code blocks or add text before/after
    try {
      // Remove markdown code block formatting if present
      if (cleanedJSON.includes("```json")) {
        cleanedJSON = cleanedJSON.replace(/```json\s*|\s*```/g, "");
      } else if (cleanedJSON.includes("```")) {
        cleanedJSON = cleanedJSON.replace(/```\s*|\s*```/g, "");
      }

      // Try to find JSON content if there's surrounding text
      const jsonMatch = cleanedJSON.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        cleanedJSON = jsonMatch[0];
      }

      // Parse the cleaned JSON
      const quizData = JSON.parse(cleanedJSON);

      // Validate the quiz data structure
      if (!Array.isArray(quizData)) {
        throw new Error("Response is not an array");
      }

      // Validate each question has the required fields
      const validatedQuizData = quizData.map((question, index) => {
        if (!question.question || !Array.isArray(question.options) || !question.answer) {
          console.log(`Invalid question format at index ${index}:`, question);
          throw new Error(`Question at index ${index} is missing required fields`);
        }

        // Ensure we have exactly 4 options
        if (question.options.length !== 4) {
          console.log(`Question ${index} has ${question.options.length} options instead of 4`);
          
          // If too few, add placeholder options
          while (question.options.length < 4) {
            question.options.push(`Additional Option ${question.options.length + 1}`);
          }
          
          // If too many, truncate
          if (question.options.length > 4) {
            // Before truncating, check if the answer is in the part we'd remove
            const willKeep = question.options.slice(0, 4);
            if (!willKeep.includes(question.answer)) {
              // If answer would be removed, replace one of the kept options with the answer
              willKeep[3] = question.answer;
            }
            question.options = willKeep;
          }
        }
        
        // Ensure the answer exists in the options
        if (!question.options.includes(question.answer)) {
          console.log(`Answer not in options for question ${index}:`, question);
          // Instead of blindly setting to first option, add the answer to the options
          // Replace the last option with the correct answer
          question.options[3] = question.answer;
        }

        return question;
      });

      res.json({ quizzes: validatedQuizData });
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Attempted to parse:", cleanedJSON);
      
      // Fallback: Generate a simple quiz if parsing fails
      const fallbackQuiz = generateFallbackQuiz(topic, numQuestions, difficulty);
      res.json({ quizzes: fallbackQuiz });
    }

  } catch (error) {
    console.error("Trivia Generation Error:", error);
    res.status(500).json({ error: "Failed to generate quiz" });
  }
};

// Fallback function to generate a simple quiz if API parsing fails
const generateFallbackQuiz = (topic, numQuestions, difficulty) => {
  const fallbackQuestions = [
    {
      question: `What is a primary feature of ${topic}?`,
      options: ["Feature A", "Feature B", "Feature C", "Feature D"],
      answer: "Feature A"
    },
    {
      question: `Which of these is commonly used in ${topic}?`,
      options: ["Component X", "Component Y", "Component Z", "Component W"],
      answer: "Component X"
    },
    {
      question: `What is a common challenge when working with ${topic}?`,
      options: ["Challenge 1", "Challenge 2", "Challenge 3", "Challenge 4"],
      answer: "Challenge 1"
    },
    {
      question: `Which principle is most important in ${topic}?`,
      options: ["Principle A", "Principle B", "Principle C", "Principle D"],
      answer: "Principle A"
    },
    {
      question: `What tool is commonly used with ${topic}?`,
      options: ["Tool 1", "Tool 2", "Tool 3", "Tool 4"],
      answer: "Tool 1"
    }
  ];

  // Return requested number of questions or all available fallbacks
  return fallbackQuestions.slice(0, Math.min(numQuestions, fallbackQuestions.length));
};

module.exports = { generateTrivia };