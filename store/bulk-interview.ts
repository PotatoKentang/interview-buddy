import {create} from 'zustand';

type BulkInterviewState = {
  bulkInterview: {
    [category: string]: string[];
  };
  getBulkCategory: (query: string) => string[] | undefined;
};

const useBulkQuestions = create<BulkInterviewState>((set, get) => ({
  bulkInterview: {
      "General Questions": [
        "Can you tell me about yourself?",
        "What interests you about this company/position?",
        "What are your strengths and weaknesses?",
        "How do you handle stress and pressure?",
        "Describe a challenging situation you faced at work and how you handled it.",
        "What motivates you in your career?",
        "Where do you see yourself in five years?",
        "Can you give an example of a time you demonstrated leadership skills?",
        "How do you prioritize tasks and manage your time?",
        "What do you know about our company?",
        "Why do you want to leave your current job?",
        "What do you think sets you apart from other candidates?",
        "What is your approach to problem-solving?",
        "How do you define success in your career?",
        "How do you handle a situation where you make a mistake at work?",
        "What do you enjoy doing outside of work?",
        "How do you handle a situation where a project is not going as planned?",
        "How do you ensure your team's morale remains high during challenging times?",
        "How do you handle criticism and feedback from peers?",
        "What steps do you take to ensure that your team meets its goals and targets?"
      ],
      "Behavioral Questions": [
        "Describe a time when you had to meet a tight deadline.",
        "Tell me about a time you had to juggle multiple tasks or projects.",
        "Can you provide an example of a time you had to persuade someone to see things your way?",
        "How do you handle difficult coworkers or clients?",
        "Describe a situation where you had to adapt to unexpected changes.",
        "How do you stay up-to-date with industry trends and developments?",
        "Can you provide an example of a time you had to provide constructive criticism?",
        "How do you handle a situation where you disagree with your supervisor's decision?",
        "How do you stay calm and focused in high-pressure situations?",
        "Describe a time when you had to admit to a mistake at work.",
        "How do you handle tight budgets and resource constraints in your projects?",
        "Can you discuss a time when you had to present a complex idea to a non-technical audience?",
        "Describe a time when you had to lead a team through a period of uncertainty.",
        "How do you handle conflicts within your team?",
        "What strategies do you use to keep your team motivated and engaged?",
        "Can you discuss a time when you had to negotiate with a difficult vendor?",
        "Describe a time when you had to make a tough ethical decision at work.",
        "How do you handle a situation where a team member is resistant to change?",
        "Can you provide an example of a time when you had to negotiate with a difficult vendor?",
        "How do you handle a situation where you disagree with a company policy?"
      ],
      "Technical Questions": [
        "What do you do to stay informed about industry regulations and compliance?",
        "How do you keep your technical skills up-to-date?",
        "Can you explain a complex concept in a simple manner?",
        "What role do ethics and integrity play in your decision-making?",
        "What strategies do you use to ensure accuracy and attention to detail in your work?",
        "How do you handle ambiguity and uncertainty in your job?",
        "How do you ensure that your team's work aligns with the organization's goals and values?",
        "What strategies do you use to foster collaboration among team members?",
        "What steps do you take to ensure a safe and inclusive work environment?",
        "How do you prioritize competing tasks or projects?",
        "What steps do you take to ensure the quality of your work?",
        "What strategies do you use to foster innovation within your team?",
        "What steps do you take to ensure that your team is aligned with the company's mission and values?",
        "How do you handle a situation where a project is behind schedule?",
        "How do you ensure that your team's work is in compliance with industry regulations?"
      ],
      "Communication and Interpersonal Skills": [
          "How do you handle conflicts within a team?",
          "Can you provide an example of a time when you had to mediate a dispute between colleagues?",
          "Describe a situation where you had to communicate complex information to a non-technical audience.",
          "How do you build rapport and maintain positive relationships with clients or customers?",
          "Explain your approach to active listening and understanding the needs of others.",
          "Give an example of a time when your communication skills helped resolve a difficult situation."
      ],
      "Leadership and Management": [
          "Can you discuss a time when you had to manage a team with diverse skill sets?",
          "Describe your approach to delegation and empowering team members.",
          "How do you set clear expectations and objectives for your team?",
          "Give an example of a successful project you led from conception to completion.",
          "How do you handle performance evaluations and feedback for your team members?",
          "What leadership style do you believe is most effective, and why?"
      ],
      "Problem Solving and Critical Thinking": [
          "Provide an example of a complex problem you encountered at work and how you solved it.",
          "How do you approach decision-making when faced with limited information?",
          "Can you describe a time when you had to make a difficult decision under pressure?",
          "Explain your process for evaluating multiple solutions to a problem.",
          "What role does data analysis play in your problem-solving approach?",
          "How do you ensure that your decisions align with the organization's goals?"
      ],
      "Adaptability and Flexibility": [
          "Describe a time when you had to quickly adapt to a change in project scope or requirements.",
          "How do you handle a situation where your initial plan doesn't work as expected?",
          "Provide an example of a time when you had to learn a new technology or software tool on the job.",
          "How do you keep yourself motivated and productive during periods of change and uncertainty?",
          "Explain your approach to working with teams in different time zones or locations."
      ],
      "Customer Service and Client Relations": [
          "Describe a challenging customer service experience you had and how you resolved it.",
          "How do you ensure that you meet or exceed customer expectations?",
          "Explain your approach to building long-term client relationships.",
          "Can you provide an example of a time when you had to handle a dissatisfied client?",
          "How do you gather feedback from clients to improve your services/products?"
      ],
      "Conflict Resolution and Teamwork": [
          "Provide an example of a time when you successfully resolved a conflict within your team.",
          "How do you foster collaboration and cooperation among team members?",
          "Explain your approach to working in a cross-functional team.",
          "Describe a situation where you had to work with a team member you didn't get along with.",
          "How do you handle disagreements or differences of opinion within your team?"
      ]
  },
  getBulkCategory: (query: string) => {
    // Use Object.keys to get the category names as an array
    const categories = Object.keys(get().bulkInterview);

    // Use find to search for a matching category
    const matchingCategory = categories.find((category) => category === query);

    // If a matching category is found, return its questions
    if (matchingCategory) {
      return get().bulkInterview[matchingCategory];
    } else {
      // Return undefined if no matching category is found
      return undefined;
    }
  },
}));

export default useBulkQuestions;
