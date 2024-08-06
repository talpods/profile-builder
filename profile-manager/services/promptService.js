class PromptService {
  static async profileSummaryPrompt(data) {
    const {
      yearsExperience,
      uniqueness,
      keyStrengths,
      seniority,
      domainExperience,
      level,
      firstName,
    } = data;
    const prompt = `"Use the following information to write the summary section of this candidate’s CV. Make it appealing to hiring managers for a software engineering role:

Years of experience: ${yearsExperience}
Seniority/specialization: ${seniority} ${level}
Domain expertise: ${domainExperience}
Key technical and non-technical strengths: ${keyStrengths}
What is unique about him/her: ${uniqueness}
First Name: ${firstName}
The summary should follow the style of the examples below, written by expert recruiters:

Example 1:
Mostafa is an experienced Full-stack software engineer with a robust track record spanning over 5.5 years in various industries, including Fintech, E-commerce, and Ed-Tech. He holds a master's and a bachelor's degree from Cairo University and brings a wealth of expertise to software development. He is proficient in JavaScript ES6, TypeScript, and Python and specializes in building scalable backend services using frameworks like Express/Node.js, Fastify, Flask, and FastAPI. He is adept at crafting seamless user experiences through frontend technologies such as React, Preact, and Angular. With a strong foundation in software engineering best practices, he champions methodologies like Test-Driven Development (TDD) and Behavior-Driven Development (BDD) to ensure the delivery of high-quality software solutions. As a natural leader, he has led cross-functional teams to successful project outcomes, leveraging agile methodologies such as Scrum and SAFe. Committed to nurturing talent, Mostafa actively mentors junior developers to foster their growth and enhance team performance.

Example 2:
With 8 years of experience in software engineering, specializing as a Senior Software Engineer, Nikunj brings a wealth of expertise in the fintech and healthcare sectors. His key technical strengths lie in the latest Python technologies, enabling him to deliver robust and innovative solutions. What sets him apart is his passion for professional growth, leading him to advance to an Assistant System Architect role in his previous organization. He is dedicated to leveraging his skills and experience to drive impactful results and contribute to the success of future endeavors.

if one of the properties provided is not valid, or undefined don't use it.`;
    return prompt;
  }
  static async profileSummaryPromptForJunior(data) {
    const {
      level,
      firstName,
      passion,
      eductions,
      volunteering,
      additionalProject,
      evaluation,
    } = data;
    const prompt = `Use the following information to write the summary section of this candidate’s CV. Make it appealing to hiring managers for an entry-level software engineering role, highlighting the following inputs:

1. First name: ${firstName}
2. Highlight degree and major if it’s engineering: ${eductions}
    a. Omit if non-engineering. Instead, mention what has been done to learn the CS fundamentals
3. Personal passion/interests: ${passion}
    a. Highlight volunteering and community service activities if provided and applicable: ${volunteering}
4. SE career-related passion/interests: ${passion}
5. SE, most exciting project: ${additionalProject}
    a. Highlight demonstrated experiences in the field of software engineering
6. Highlight strengths in soft and cultural skills that have been observed by our evaluators ${evaluation}

The summary should follow the style of the examples below, written by expert recruiters:

Example 1:
Mostafa is an experienced Full-stack software engineer with a robust track record spanning over 5.5 years in various industries, including Fintech, E-commerce, and Ed-Tech. He holds a master's and a bachelor's degree from Cairo University and brings a wealth of expertise to software development. He is proficient in JavaScript ES6, TypeScript, and Python and specializes in building scalable backend services using frameworks like Express/Node.js, Fastify, Flask, and FastAPI. He is adept at crafting seamless user experiences through frontend technologies such as React, Preact, and Angular. With a strong foundation in software engineering best practices, he champions methodologies like Test-Driven Development (TDD) and Behavior-Driven Development (BDD) to ensure the delivery of high-quality software solutions. As a natural leader, he has led cross-functional teams to successful project outcomes, leveraging agile methodologies such as Scrum and SAFe. Committed to nurturing talent, Mostafa actively mentors junior developers to foster their growth and enhance team performance.

Example 2:
With 8 years of experience in software engineering, specializing as a Senior Software Engineer, Nikunj brings a wealth of expertise in the fintech and healthcare sectors. His key technical strengths lie in the latest Python technologies, enabling him to deliver robust and innovative solutions. What sets him apart is his passion for professional growth, leading him to advance to an Assistant System Architect role in his previous organization. He is dedicated to leveraging his skills and experience to drive impactful results and contribute to the success of future endeavors.

if one of the properties provided is not valid, or undefined don't use it.`;
    return prompt;
  }
  static async experienceSummaryPrompt(data) {
    const {
      candidatesUniqueAchievement,
      companyBusinessActivity,
      companyName,
      companyIndustry,
      responsibilitiesAndAccomplishments,
      toolsAndTechnologies,
      title,
      firstName,
    } = data;
    const prompt = `
    Frist name: ${firstName}
    Job Title: ${title}
    Company Name: ${companyName}
    Company Industry: ${companyIndustry}
    Company Activity: ${companyBusinessActivity}
    Candidate's Unique Achievement: ${candidatesUniqueAchievement}
    Responsibilities and Accomplishments: ${responsibilitiesAndAccomplishments}
    Tools and Technologies Used: ${toolsAndTechnologies}
    
Using the provided information, craft a concise and simple yet professional one  paragraph summary of 2-3 lines of the candidate's professional experience, tailored for a software engineering role. 

The summary should follow the style of the examples below, written by expert recruiters:
Example 1:
As the Team Lead at Tactful, oversee cross-functional software engineering teams, ensuring timely delivery of high-quality projects and fostering professional growth among team members.
Example 2:
As a Full-Stack Developer designed website layouts, built data integration middleware, and maintained software documentation.
Ensure the tone is professional, confident, and appealing to hiring managers in the tech industry. 

Use active voice and impactful verbs to convey the candidate's proactive approach and achievements. Aim for a balance between technical detail and broader impact, crafting a narrative that positions the candidate as a valuable asset to potential employers.
`;
    return prompt;
  }
  static async experienceresponsibilitiesPrompt(data) {
    const { responsibilitiesAndAccomplishments } = data;
    const prompt = `
    Responsibilities and Accomplishments: ${responsibilitiesAndAccomplishments}
    
    Refine this list of bulleted responsibilities, rephrasing them and keeping the bullets to max 5 to 6 points. and return the result as 
    "responsibilitiesAndAccomplishments": ["string","string","string"] format`;
    return prompt;
  }

  static async candidateTechnicalSkillsPrompt(data) {
    const { skills } = data;
    const prompt = `
    skills: ${skills}
    Using provided skills, please categorize these skills and arrange them as comma separated and correct names
    Common categories may include (but are not limited to):
     * Programming Languages & Frameworks
     * Databases & Tools
     * Cloud & DevOps
     * Machine Learning & AI
     * Web Technologies
     * Mobile Development
     * Version Control & Collaboration Tools
     * Testing & QA

    return the result as 
    "technicalSkills": [
  {
   "sectionName": "string",
   "skills": [
    "string",
    "string",
    "string",
    "string"
   ]
  },{
   "sectionName": "string",
   "skills": [
    "string",
    "string",
    "string",
    "string"
   ]
  }]`;
    return prompt;
  }

  static async projectSummaryPrompt(data) {
    const {
      projectName,
      responsibilities,
      technologies,
      firstName,
      description,
    } = data;
    const prompt = `
    project name: ${projectName} 
    Responsibilities: ${responsibilities}
    technologies: ${technologies}
    firstName: ${firstName}
    project descrition: ${description}

    Create a concise, one-paragraph summary of the candidate's project experience, tailored for a software engineering role. 
    The summary should follow the style of the examples below, written by expert recruiters:
    example: 
    Developed an AI-powered bot that automatically parses real-time job postings from Upwork and submits tailored proposals, using Python, AI text generation, and Discord API for efficient job acquisition and notification.


Keep the tone professional and confident. Use active voice and impactful verbs to convey the candidate's contributions. Aim for a balance between technical details and project impact, creating a compelling narrative that appeals to hiring managers in the tech industry. The summary should be approximately 3-5 sentences long.
if one of the properties provided is not valid, or undefined don't use it.`;
    return prompt;
  }
  static async recommendationPrompt(data) {
    const { recommendationText } = data;
    const prompt = `
    Recommendation: ${recommendationText}
    Refine this recommendation text to enhance clarity, professionalism, and impact. `;
    return prompt;
  }
}

export default PromptService;
