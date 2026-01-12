import { ASSESSMENT_QUESTIONS, TECH_PATHS } from "./questions";

export interface AssessmentResult {
    recommendedPath: string;
    pathScores: Record<string, number>;
    analysis: string;
    allPaths: typeof TECH_PATHS;
}

export function calculatePathRecommendation(
    answers: Record<number, string>
): AssessmentResult {
    // Initialize path scores
    const pathScores: Record<string, number> = {
        frontend: 0,
        backend: 0,
        fullstack: 0,
        data_science: 0,
        devops: 0,
    };

    // Calculate scores based on selected options
    ASSESSMENT_QUESTIONS.forEach((question) => {
        const selectedOptionText = answers[question.id];
        const selectedOption = question.options.find(
            (opt) => opt.text === selectedOptionText
        );

        if (selectedOption) {
            pathScores[selectedOption.path] += selectedOption.points;
        }
    });

    // Find the highest scoring path
    const recommendedPath = Object.entries(pathScores).reduce((a, b) =>
        a[1] > b[1] ? a : b
    )[0];

    // Generate analysis
    const analysis = generateAnalysis(recommendedPath, pathScores);

    return {
        recommendedPath,
        pathScores,
        analysis,
        allPaths: TECH_PATHS,
    };
}

function generateAnalysis(
    path: string,
    scores: Record<string, number>
): string {
    const pathInfo = TECH_PATHS[path as keyof typeof TECH_PATHS];

    let analysis = `Based on your assessment responses, your recommended tech path is: **${pathInfo.name}**\n\n`;
    analysis += `${pathInfo.description}\n\n`;

    // Add details based on path
    analysis += `**Why this path?**\n`;
    analysis += `Your responses indicate strong interests and aptitude in the areas that define ${pathInfo.name}. `;
    analysis += `This path aligns with your learning style and career aspirations.\n\n`;

    analysis += `**Next Steps:**\n`;
    analysis += `1. Start with fundamental concepts in the recommended area\n`;
    analysis += `2. Build small projects to apply what you learn\n`;
    analysis += `3. Join communities and contribute to open source\n`;
    analysis += `4. Continuously upgrade your skills with advanced courses\n\n`;

    return analysis;
}
