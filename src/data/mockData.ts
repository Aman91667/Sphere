export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  completed?: boolean;
  score?: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: string;
  analysis: string;
  quiz: Quiz;
  completed?: boolean;
  /** percent watched 0-100 (optional). If omitted, `completed` will be used as binary */
  videoProgress?: number;
}

export const mockQuizzes: Quiz[] = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    completed: true,
    score: 85,
    questions: [
      {
        id: "q1",
        question: "What is the correct way to declare a variable in JavaScript?",
        options: ["var myVar;", "variable myVar;", "v myVar;", "int myVar;"],
        correctAnswer: 0
      },
      {
        id: "q2",
        question: "Which method is used to parse a string to an integer?",
        options: ["parseInt()", "parseInteger()", "toInt()", "convertInt()"],
        correctAnswer: 0
      },
      {
        id: "q3",
        question: "What does '===' operator do?",
        options: ["Assigns value", "Compares value only", "Compares value and type", "None of the above"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "2",
    title: "React Hooks Basics",
    description: "Understanding React Hooks and their usage",
    completed: false,
    questions: [
      {
        id: "q1",
        question: "Which hook is used for side effects?",
        options: ["useState", "useEffect", "useContext", "useReducer"],
        correctAnswer: 1
      },
      {
        id: "q2",
        question: "What does useState return?",
        options: ["A value", "A function", "An array with state and setter", "An object"],
        correctAnswer: 2
      },
      {
        id: "q3",
        question: "When does useEffect run by default?",
        options: ["On mount only", "On unmount only", "After every render", "Never"],
        correctAnswer: 2
      }
    ]
  },
  {
    id: "3",
    title: "CSS Flexbox Mastery",
    description: "Master the art of CSS Flexbox layouts",
    completed: true,
    score: 92,
    questions: [
      {
        id: "q1",
        question: "Which property is used to enable flexbox?",
        options: ["display: flex;", "flex: true;", "flexbox: on;", "layout: flex;"],
        correctAnswer: 0
      },
      {
        id: "q2",
        question: "What does 'justify-content' control?",
        options: ["Vertical alignment", "Horizontal alignment", "Font size", "Border"],
        correctAnswer: 1
      }
    ]
  }
];

export const mockVideoLessons: VideoLesson[] = [
  // NOTE: the original sample URLs pointed to generic demo movies (BigBuckBunny, ElephantsDream, etc.).
  // Those are fine as placeholders, but they don't match the lesson topics. Below we use
  // YouTube links (search-result pages) for each lesson topic. Replace these with
  // specific YouTube watch URLs or local assets when you have preferred videos.
  {
    id: "1",
    title: "Introduction to Web Development",
    description: "Learn the fundamentals of web development",
  // YouTube search results for topic (replace with a direct watch URL if you prefer)
  videoUrl: "https://youtu.be/4WjtQjPQGIs?si=mQpilvGrB2_vXMMQ",
    duration: "10:24",
    analysis: "This lesson covered the core concepts of web development including HTML structure, CSS styling, and JavaScript interactivity. You learned about the Document Object Model (DOM) and how these three technologies work together to create modern web applications.",
    completed: true,
    videoProgress: 100,
    quiz: mockQuizzes[0]
  },
  {
    id: "2",
    title: "Advanced React Patterns",
    description: "Deep dive into React best practices",
  // YouTube search for advanced React patterns / architecture
  videoUrl: "https://youtu.be/iO6px_wz1oc?si=NF1Buk0k0UYHxvjo",
    duration: "16:56",
    analysis: "This advanced lesson explored React Hooks, custom hooks, and performance optimization techniques. You learned how to build reusable components and manage complex state with useReducer and useContext.",
    completed: false,
    // partially watched
    videoProgress: 40,
    quiz: mockQuizzes[1]
  },
  {
    id: "3",
    title: "Modern CSS Techniques",
    description: "Master Flexbox and Grid layouts",
  // YouTube search for modern CSS techniques (Flexbox/Grid tutorials)
  videoUrl: "https://youtu.be/0hrJGWrCux0?si=OzW1p8xcWg5c5pl2",
    duration: "3:22:26",
    analysis: "This lesson covered modern CSS layout techniques including Flexbox and CSS Grid. You learned how to create responsive, flexible layouts that adapt to different screen sizes.",
    completed: true,
    videoProgress: 100,
    quiz: mockQuizzes[2]
  }
];
