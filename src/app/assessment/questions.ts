export interface Question {
    id: number;
    question: string;
    options: Array<{
        text: string;
        path: "frontend" | "backend" | "fullstack" | "data_science" | "devops";
        points: number;
    }>;
    category: string;
}

// Tech Path Assessment Questions (like 3MTT risk assessment)
// Users answer 10 questions, each option maps to a tech path
export const ASSESSMENT_QUESTIONS: Question[] = [
    {
        id: 1,
        question: "What excites you most about technology?",
        options: [
            { text: "Building beautiful, interactive user interfaces", path: "frontend", points: 3 },
            { text: "Creating robust server logic and databases", path: "backend", points: 3 },
            { text: "Both user experience and backend systems equally", path: "fullstack", points: 3 },
            { text: "Working with data, patterns, and AI/ML", path: "data_science", points: 3 },
        ],
        category: "Interests",
    },
    {
        id: 2,
        question: "How do you prefer to solve problems?",
        options: [
            { text: "Through visual and interactive design", path: "frontend", points: 3 },
            { text: "By writing efficient algorithms and logic", path: "backend", points: 3 },
            { text: "By connecting multiple systems together", path: "fullstack", points: 3 },
            { text: "By analyzing data and finding insights", path: "data_science", points: 3 },
        ],
        category: "Problem Solving",
    },
    {
        id: 3,
        question: "Which technology area interests you most?",
        options: [
            { text: "HTML, CSS, JavaScript, React, Vue", path: "frontend", points: 3 },
            { text: "Node.js, Python, Databases, APIs", path: "backend", points: 3 },
            { text: "Full web stack from frontend to backend", path: "fullstack", points: 3 },
            { text: "Python, R, Machine Learning, Statistics", path: "data_science", points: 3 },
        ],
        category: "Technology Preference",
    },
    {
        id: 4,
        question: "What's your ideal work environment?",
        options: [
            { text: "Designing user experiences and interfaces", path: "frontend", points: 3 },
            { text: "Working with systems, servers, and infrastructure", path: "devops", points: 3 },
            { text: "Balancing both frontend and backend responsibilities", path: "fullstack", points: 3 },
            { text: "Working with large datasets and statistical models", path: "data_science", points: 3 },
        ],
        category: "Work Environment",
    },
    {
        id: 5,
        question: "How do you learn best?",
        options: [
            { text: "By seeing visual results immediately", path: "frontend", points: 3 },
            { text: "By understanding deep concepts and architecture", path: "backend", points: 3 },
            { text: "By building end-to-end projects", path: "fullstack", points: 3 },
            { text: "By experimenting with data and models", path: "data_science", points: 3 },
        ],
        category: "Learning Style",
    },
    {
        id: 6,
        question: "What's your comfort level with mathematics?",
        options: [
            { text: "Basic math is enough", path: "frontend", points: 2 },
            { text: "Moderate, with algorithms and logic", path: "backend", points: 2 },
            { text: "Comfortable with both", path: "fullstack", points: 2 },
            { text: "Advanced, comfortable with statistics and calculus", path: "data_science", points: 3 },
        ],
        category: "Mathematics",
    },
    {
        id: 7,
        question: "What would you build first?",
        options: [
            { text: "A responsive, beautiful landing page", path: "frontend", points: 3 },
            { text: "A REST API with database", path: "backend", points: 3 },
            { text: "A complete web application", path: "fullstack", points: 3 },
            { text: "A data analysis project with visualizations", path: "data_science", points: 3 },
        ],
        category: "Project Preference",
    },
    {
        id: 8,
        question: "How important is job market demand?",
        options: [
            { text: "Very important, I want high demand skills", path: "frontend", points: 1 },
            { text: "Important, backend developers are always needed", path: "backend", points: 1 },
            { text: "Very important, fullstack is in high demand", path: "fullstack", points: 2 },
            { text: "Very important, data science is booming", path: "data_science", points: 3 },
        ],
        category: "Career Outlook",
    },
    {
        id: 9,
        question: "How do you handle debugging and problem-solving?",
        options: [
            { text: "Using browser developer tools and visual debugging", path: "frontend", points: 3 },
            { text: "Logging, testing, and systematic debugging", path: "backend", points: 3 },
            { text: "Debugging across multiple layers", path: "fullstack", points: 3 },
            { text: "Using data analysis and statistical methods", path: "data_science", points: 3 },
        ],
        category: "Problem Solving",
    },
    {
        id: 10,
        question: "What's your long-term career vision?",
        options: [
            { text: "UX/UI Designer or Frontend Specialist", path: "frontend", points: 3 },
            { text: "Backend Engineer or Systems Architect", path: "backend", points: 3 },
            { text: "Full-stack Developer or Tech Lead", path: "fullstack", points: 3 },
            { text: "Data Scientist or ML Engineer", path: "data_science", points: 3 },
        ],
        category: "Career Vision",
    },
];

// Tech Path Details
export const TECH_PATHS = {
    frontend: {
        name: "Frontend Development",
        description: "Build beautiful, interactive user interfaces",
        skills: ["HTML/CSS", "JavaScript", "React/Vue/Angular", "Responsive Design", "UX/UI Basics"],
        tools: ["VS Code", "Chrome DevTools", "Figma", "Git"],
        courses: ["Web Design Fundamentals", "JavaScript Mastery", "React Advanced"],
        resources: ["MDN Web Docs", "CSS-Tricks", "Frontend Masters"],
        salaryRange: "₦800k - ₦3M/month",
    },
    backend: {
        name: "Backend Development",
        description: "Create robust server logic, databases, and APIs",
        skills: ["Node.js/Python", "Databases (SQL/NoSQL)", "API Design", "Authentication", "Testing"],
        tools: ["Postman", "Git", "Docker", "AWS/Heroku"],
        courses: ["Backend with Node.js", "Database Design", "REST API Development"],
        resources: ["Node.js Docs", "PostgreSQL Docs", "Backend Roadmap"],
        salaryRange: "₦1M - ₦4M/month",
    },
    fullstack: {
        name: "Full-Stack Development",
        description: "Master both frontend and backend development",
        skills: ["Frontend", "Backend", "Databases", "DevOps Basics", "System Design"],
        tools: ["Full-stack tools", "Docker", "Git", "CI/CD"],
        courses: ["MERN Stack", "Full-Stack Project", "System Design"],
        resources: ["Full-Stack Roadmap", "Web Dev Roadmap", "Architecture Patterns"],
        salaryRange: "₦1.2M - ₦5M/month",
    },
    data_science: {
        name: "Data Science & AI",
        description: "Analyze data and build machine learning models",
        skills: ["Python", "Statistics", "Machine Learning", "Data Visualization", "SQL"],
        tools: ["Jupyter", "Pandas", "TensorFlow", "Git"],
        courses: ["Python for Data", "Machine Learning", "Data Analysis"],
        resources: ["Kaggle", "Fast.ai", "Scikit-learn Docs"],
        salaryRange: "₦1.5M - ₦6M/month",
    },
    devops: {
        name: "DevOps & Infrastructure",
        description: "Manage systems, servers, and deployment",
        skills: ["Linux", "Docker", "Kubernetes", "CI/CD", "Cloud Platforms"],
        tools: ["Docker", "Jenkins", "AWS", "Terraform"],
        courses: ["Docker Masterclass", "Kubernetes", "AWS Solutions"],
        resources: ["Docker Docs", "Kubernetes Docs", "AWS Learning"],
        salaryRange: "₦1.3M - ₦5.5M/month",
    },
};
