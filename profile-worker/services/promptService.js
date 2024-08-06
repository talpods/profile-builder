const {
  fetchAndParseFileFromS3,
} = require("../infrastructure/profileRepository");

class PromptService {
  static async createProfileGenerationPrompt(profileInformation) {
    //Get content from the s3 bucket
    const { coverLetterUrl, cvUrl, linkedInProfile, level } =
      profileInformation;
    let coverLetterContent = null;
    let cvContent = null;
    let linkedInProfileContent = null;

    try {
      if (coverLetterUrl !== "") {
        coverLetterContent = await fetchAndParseFileFromS3(coverLetterUrl);
      }
      if (cvUrl !== "") {
        cvContent = await fetchAndParseFileFromS3(cvUrl);
      }
      if (linkedInProfile !== "") {
        linkedInProfileContent = await fetchAndParseFileFromS3(linkedInProfile);
      }
      //Provide the json schama of the data on the database.
      const jsonProperties = `
            specialization: { type: String },
            yearsExperience: { type: Number },
            domainExperience: { type: Array, items: String },
            keyStrengths: { type: Array, maxItems: 3, items: String },
            uniqueness: {  type: Array, items: String },
            summary: { type: String },
            bases: {
                type: Object,
                properties: {
                    cityState: { type: String },
                    country: { type: String }
                }
            },
            languages: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        name: { type: String },
                        proficiencyLevel: { type: String }
                    }
                }
            },
            technicalSkills: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        sectionName: { type: String },
                        skills: { type: Array, items: String }
                    }
                }
            },
            experiences: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        companyName: { type: String },
                        companyDomain: { type: String },
                        companyIndustry: { type: String },
                        companyBusinessActivity: { type: String },
                        candidatesUniqueAchievement: { type: String },
                        summary: { type: String },
                        positions: {
                            type: Array,
                            items: {
                                type: Object,
                                properties: {
                                    title: { type: String },
                                    startDate: { type: String },
                                    endDate: { type: String, optional: true },
                                    note: {type: String, optional: true},
                                    employmentType: { type: String }
                                }
                            }
                        },
                        location: {
                            type: Object,
                            properties: {
                                cityState: { type: String },
                                country: { type: String }
                }
                        },
                        responsibilitiesAndAccomplishments: { type: Array, items: String },
                        toolsAndTechnologies: { type: Array, items: String },
                        projects: {
                            type: Array,
                            optional: true,
                            items: {
                                type: Object,
                                properties: {
                                    projectName: { type: String },
                                    link: { type: String },
                                    description: { type: String },
                                    responsibilities: {type: Array, optional: true},
                                    technologies: { type: Array, items: String, optional: true }
                                }
                            }
                    }
                }
            },
            educations: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        startDate: { type: String },
                        endDate: { type: String },
                        institutionName: { type: String },
                        location: {
                            type: Object,
                            properties: {
                                cityState: { type: String },
                                country: { type: String }
                            }
                        },
                        level: { type: String },
                        major: { type: String },
                        scoreGPA: { type: String }
                    }
                }
            },
            additionalProjects: {
                type: Array,
                optional: true,
                items: {
                    type: Object,
                    properties: {
                        projectName: { type: String },
                        link: { type: String },
                        description: { type: String },
                        responsibilities: {type: Array, optional: true},
                        technologies: { type: Array, items: String, optional: true }
                    }
                }
            },
            volunteering: {
                type: Array,
                optional: true,
                items: {
                    type: Object,
                    properties: {
                        startDate: { type: String },
                        endDate: { type: String },
                        nameOfVolunteeringActivity: { type: String },
                        location: {
                            type: Object,
                            properties: {
                                cityState: { type: String },
                                country: { type: String }
                            }
                        },
                        type: { type: String },
                        description: { type: String }
                    }
                }
            },
            awardsCertificates: {
                type: Array,
                optional: true,
                items: {
                    type: Object,
                    properties: {
                        gradeScore: { type: String },
                        eventCourseTitle: { type: String },
                        description: { type: String }, 
                        courseDate: {type: String}
                    }
                }
            }, 
            recommendations: {
                type: Array, 
                optional: true, 
                items: {
                    type: Object,
                    properties: {
                        recommenderName: {type: String}, 
                        recommenderRelation: {type: String}, 
                        recommendationText: {type: String}, 
                        recommenderImg: {type: String},
                        recommendationDate: {type: String}
                    }
                }
            }, 
            courses: {
                type: Array, 
                    optional: true, 
                    items: {
                        type: Object,
                        properties: {
                        courseProvider: {type: String}, 
                        coursesNames: {type: Array}
                        }
            }`;
      //Adding the summrya prompt for junior to write the summary for the profile
      let juniorSummaryPrompt = `Use the following information to write the summary section of this candidate’s CV. Make it appealing to hiring managers for an entry-level software engineering role, highlighting the following inputs
    1. The candidate’s name
    2. Highlight degree and major if it’s engineering
        a. Omit if non-engineering. Instead, mention what has been done to learn the CS fundamentals
    3. Personal passion/interests from bio or coverletter or cv if provided
        a. Highlight volunteering and community service activities
    4. SE career-related passion/interests
        a. Highlight demonstrated experiences in the field of software engineering
    5.Highlight strengths in soft and cultural skills that have been observed by our evaluators`;

      //Adding the summrya prompt for junior to write the summary for the profile for expereinced candidates
      let summaryPrompt = `Use the following information to write the summary section of this candidate’s CV. Make it appealing to hiring managers for a software engineering role
    1. Years of experience
    2. Seniority/ specialization
    3. Domain expertise
    4. Key technical and non-technical strengths
    5. What is unique about him/her`;

      //Creating the pormpt based on the data that we collect up from parsing the content of the cv, cover letter and linkedIn profile and combine all the content with the db schema to create the prompt
      const prompt = `
      You are a professional profile builder and recruiter with over 10 years of experience. Your task is to extract and organize relevant data from the provided CV, cover letter, and additional information into a specific JSON format.
    You have this data 
    1- CV: ${cvContent}
    2- Cover Letter: ${coverLetterContent} this maybe empty
    3- LinkedIn Profile: ${linkedInProfileContent}
    4- Json Properties Structure: ${jsonProperties}
Instructions:

1. Property Names:
   - Use the exact property names as specified in the JSON structure.
   - Any deviation from the given property names will cause errors.

2. Additional Properties:
   - Do not include any properties that are not defined in the JSON structure.
   - Adding extra properties will disrupt the database and application functionality.

3. Missing Properties:
   - For properties defined in the JSON structure but not present in the provided information:
     - Use empty strings ("") for string properties.
     - Use null for number properties.
     - Use empty arrays ([]) for array properties.
     - Use empty objects ({}) for object properties.

4. Data Extraction:
   - Extract all relevant data from the CV, cover letter, and additional information for the defined properties.
   - Include specific information such as uniqueness if present.
   - For optional properties like courses, volunteering, or additional projects, only include them if the information is provided. Otherwise, use an empty array.
   - For the location object in the all objects if the information of the city or state is not provided, use the capital of the country.
   - For the languages if the information is not provided, Add the level is Higly Proficient.
   - For the courses and awardsAndCertificates if the certificate doesn't have date or grade added it to the course section.
   - For the Education section if the grade is not provided, leave it empty.
   - All Dates should be in this format Aug 2021.
   - In voluneterning, if the end date is not provided, use Present.
   - All Properties in the schema should be there in the result. even if it is not showing on the cv or the data provided. just add it as empty string or array or object as it is in the schema.

5. Recommendations:
   - Extract recommendations verbatim from the LinkedIn profile content and add the recommendationText string as it is in the LinkedIn profile and don't trim anything from it.
   - If recommendations are not present in the LinkedIn content or CV, use an empty array.
   - If the recommenderRelation is not provided, use Team Member instead.

6. Summary Section:
   - Incorporate relevant information from the cover letter, if available.
   - ${
     level == "Software engineer level 1" ||
     level == "Software engineer entry level"
       ? juniorSummaryPrompt
       : summaryPrompt
   }

7. Experience Section:
   - Include multiple roles within the same company if applicable.
   - Include projects related to specific companies within the respective experience entry.
   - Dates should be in this format Aug 2021 and if the end date is not provided, leave it empty.
   - Write at least 30 words summary for each experience entry extract it from the responsibilities and make it appeleanig to hiring managers.
   - All Properties in the schema should be there in the experience entry. even if it is not showing on the cv just add it as empty string or array or object as it is in the schema.
   - For each experience rewrite the responsibilities to make it appealing to hiring managers.
   - For each experience entry, extract and include the following information:
     * Company name: Extract from the CV
     * Company domain: Extract from the CV
     * Company industry: Extract from the CV
     * Company business activity: Extract from the CV
     
8. Technical Skills Section:
   - Extract technical skills from the entire CV, including the experiences section.
   - Group the technical skills into appropriate categories.
   - Create a comprehensive list of skills, avoiding duplicates.
   - Use the following structure for the technicalSkills property:
     "technicalSkills": [
       {
         "sectionName": "Category Name",
         "skills": ["Skill 1", "Skill 2", "Skill 3"]
       },
       ...
     ]
   - Common categories may include (but are not limited to):
     * Programming Languages & Frameworks
     * Databases & Tools
     * Cloud & DevOps
     * Machine Learning & AI
     * Web Technologies
     * Mobile Development
     * Version Control & Collaboration Tools
     * Testing & QA
     * Other relevant categories based on the CV content  

9. Specific Property Guidelines:
   - specialization: String (e.g., "JavaScript, Python")
   - yearsExperience: Number (e.g., 6)
   - domainExperience: Array of strings (extract from CV content)
   - keyStrengths: Array of up to 3 strings (extract from CV content)
   - uniqueness: Array of strings (extract from CV or set as empty array if not found)
   - bases: Object with cityState and country properties
   - languages: Array of objects with name and proficiencyLevel
   - technicalSkills: Array of objects with sectionName and skills array
   - experiences: Array of detailed work experience objects
   - educations: Array of education history objects
   - additionalProjects: Array of project objects (use empty array if none exist)
   - volunteering: Array of volunteering experience objects (use empty array if none exist)
   - awardsCertificates: Array of award/certificate objects (use empty array if none exist)
   - recommendations: Array of recommendation objects (extract from LinkedIn profile or use empty array if none exist)
   - courses: Array of course provider objects with coursesNames arrays (use empty array if none exist)

10. Examples of Properties and expected values: 
specialization: { type: String } : "specialization": "JavaScript, Python", yearsExperience: { type: Number } : "yearsExperience": 6,
 domainExperience: { type: Array, items: String }: "domainExperience": [
  "Fintech",
  "E-commerce",
  "Ed-Tech"
 ] you should get them from the cv content
 keyStrengths: { type: Array, maxItems: 3, items: String }: "keyStrengths": [
  "Full-stack development",
  "Software architecture",
  "Cloud native solutions",
 ] you should get them from the cv content
 uniqueness: {  type: Array, items: String }: "uniqueness": [
  "Pioneered SmartMitt's AI-driven implementation, analyzing baseball pitches through video",
  "Led revamp of xiQ's email marketing platform to microservices architecture",
  "Developed an AI-powered email client platform integrated with Outlook/Gmail"
 ] or set as empty array of you can't extract the data from the cv.
bases: { type: Object,properties: {  cityState: { type: String },  country: { type: String } } } : "bases": {
  "cityState": "Lahore",
  "country": "Pakistan"
 }
languages: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        name: { type: String },
                        proficiencyLevel: { type: String }
                    }
                }
            }: "languages": [
  {
   "name": "Urdu",
   "proficiencyLevel": "Native"
  },
  {
   "name": "English",
   "proficiencyLevel": "Highly Proficient"
  }
 ],
technicalSkills: {type: Array,items: { type: Object,                     properties: {                         sectionName: { type: String },                         skills: { type: Array, items: String }                     }                 }             }: "technicalSkills": [
  {
   "sectionName": "Programming Languages & Frameworks",
   "skills": [
    "Python",
    "Django",
    "Flask",
    "JavaScript",
    "React",
    "Redux",
    "HTML",
    "CSS",
    "C#"
   ]
  },
  {
   "sectionName": "Databases & Tools",
   "skills": [
    "MSSQL",
    "PostgreSQL",
    "MySQL",
    "MongoDB",
    "DynamoDB",
    "Elastic Search",
    "Apache Solr"
   ]
  },
  {
   "sectionName": "Machine Learning & Data Processing",
   "skills": [
    "TensorFlow",
    "PyTorch",
    "Keras",
    "Pandas",
    "NumPy",
    "Spacy",
    "NLTK",
    "OpenCV",
    "Pillow",
    "Moviepy"
   ]
  },
  {
   "sectionName": "DevOps & Cloud",
   "skills": [
    "AWS",
    "Docker",
    "NGINX",
    "Apache",
    "Heroku",
    "CI/CD",
    "GitHub Actions"
   ]
  },
  {
   "sectionName": "Architectures",
   "skills": [
    "Microservices",
    "RESTful APIs",
    "MVC",
    "Serverless"
   ]
  },
  {
   "sectionName": "Miscellaneous",
   "skills": [
    "LLMs",
    "GPT",
    "Falcon",
    "Bard",
    "Image Processing",
    "Video Processing",
    "SDK Integrations"
   ]
  }
 ],
experiences: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        companyName: { type: String },
                        companyDomain: { type: String },
                        companyIndustry: { type: String },
                        companyBusinessActivity: { type: String },
                        candidatesUniqueAchievement: { type: String },
                        summary: { type: String },
                        positions: {
                            type: Array,
                            items: {
                                type: Object,
                                properties: {
                                    title: { type: String },
                                    startDate: { type: String },
                                    endDate: { type: String, optional: true },
                                    note: {type: String, optional: true},
                                    employmentType: { type: String }
                                }
                            }
                        },
                        location: {
                            type: Object,
                            properties: {
                                cityState: { type: String },
                                country: { type: String }
                }
                        },
                        responsibilitiesAndAccomplishments: { type: Array, items: String },
                        toolsAndTechnologies: { type: Array, items: String },
                        projects: {
                            type: Array,
                            optional: true,
                            items: {
                                type: Object,
                                properties: {
                                    projectName: { type: String },
                                    link: { type: String },
                                    description: { type: String },
                                    responsibilities: {type: Array, optional: true},
                                    technologies: { type: Array, items: String, optional: true }
                                }
                            }
                    }
                }
            }: "experiences": [
  {
   "candidatesUniqueAchievement": "",
   "companyBusinessActivity": "Software Development",
   "companyDomain": "Software",
   "companyIndustry": "Software",
   "companyName": "RootPointers",
   "location": {
    "cityState": "Lahore",
    "country": "Pakistan"
   },
   "positions": [
    {
     "employmentType": "Onsite",
     "endDate": "Mar 2024",
     "note": "",
     "startDate": "Aug 2021",
     "title": "Senior Full-Stack Developer"
    },
    {
     "endDate": "Apr 2022",
     "note": "",
     "startDate": "Aug 2021",
     "title": "Software Engineer II"
    }
   ],
   "projects": [
    {
     "description": "An AI-based sports technology company designs LED pitching targets for baseball and softball, providing vital data and feedback to players and coaches worldwide.",
     "link": "https://www.smartmitt.com/",
     "projectName": "SmartMitt",
     "responsibilities": [
     ],
     "technologies": [
      "Deep Learning",
      "Flask",
      "React.js",
      "MongoDB",
      "AWS",
      "Python",
      "JavaScript"
     ]
    }
   ],
   "responsibilitiesAndAccomplishments": [
    "Pioneered the complete development and testing cycle of diverse enterprise applications",
    "Led a dynamic team of Web/Mobile frontend and backend developers",
    "Innovated in sports analytics with AI-driven features for SmartMitt",
    "Developed an AI-powered email client platform, integrating with Outlook/Gmail"
   ],
   "summary": "Employed as a Senior Full-stack developer at RootPointers, worked on multiple software projects, and led SmartMitt's AI-driven implementation.",
   "toolsAndTechnologies": [
    "Python",
    "React",
    "Django",
    "AWS",
    "MongoDB",
    "Git"
   ]
  },
  {
   "candidatesUniqueAchievement": "",
   "companyBusinessActivity": "AI-Driven Sales & Marketing",
   "companyDomain": "Software",
   "companyIndustry": "Software",
   "companyName": "xiQ Inc.",
   "location": {
    "cityState": "Remote",
    "country": "USA"
   },
   "positions": [
    {
     "employmentType": "Remote",
     "endDate": "Aug 2021",
     "note": "Started as a Full Stack Developer, later got promoted to Lead Developer in Jun 2022",
     "startDate": "Jan 2020",
     "title": "Full-Stack Developer"
    }
   ],
   "projects": [
    {
     "description": "A Silicon Valley B2B Sales and Marketing Startup with major clientele like DELL, AWS, Nutanix",
     "link": "https://xiqinc.com/",
     "projectName": "xiQ Inc Website",
     "responsibilities": [
     ],
     "technologies": [
      "Django",
      "React.js",
      "SQL",
      "Microservices",
      "Python"
     ]
    }
   ],
   "responsibilitiesAndAccomplishments": [
    "Led the revamp of the email marketing platform, Workbench, transitioning from legacy Django code to a Microservices architecture",
    "Implemented Test Driven Development to integrate new features into production",
    "Mentored junior developers to enhance their skills and contribute effectively"
   ],
   "summary": "mployed as a Full-Stack developer at xiQ, a Silicon Valley-based, software development company that brings together generative AI (xGPT) with behavioural psychology. Responsible for transitioning legacy code to microservices.",
   "toolsAndTechnologies": [
    "Python",
    "Django",
    "React",
    "SQL",
    "Git",
    "Microservices"
   ]
  },{
   "candidatesUniqueAchievement": "",
   "companyBusinessActivity": "Software Development",
   "companyDomain": "AI",
   "companyIndustry": "Software",
   "companyName": "Datics AI",
   "location": {
    "cityState": "Lahore",
    "country": "Pakistan"
   },
   "positions": [
    {
     "employmentType": "Onsite",
     "endDate": "Jan 2020",
     "note": "",
     "startDate": "Jan 2019",
     "title": "Backend Developer"
    }
   ],
   "projects": [
   ],
   "responsibilitiesAndAccomplishments": [
    "Specialized in backend development, focusing on robust database solutions and API integrations",
    "Pioneered the development of Sparrowcharts.com, centering on server-side logic and cloud-based solutions",
    "Utilized GCP to create efficient data pipelines for sensor data management"
   ],
   "summary": "Engaged as a Backend Developer at Datics AI's product development life cycle using various technologies.",
   "toolsAndTechnologies": [
    "Python",
    "Django",
    "Flask",
    "MySQL",
    "Git"
   ]
  },
  {
   "candidatesUniqueAchievement": "",
   "companyBusinessActivity": "Game Development",
   "companyDomain": "Gaming",
   "companyIndustry": "Gaming",
   "companyName": "Brain Games Studio",
   "location": {
    "cityState": "Lahore",
    "country": "Pakistan"
   },
   "positions": [
    {
     "employmentType": "Onsite",
     "endDate": "Dec 2018",
     "note": "",
     "startDate": "Mar 2017",
     "title": "Software Engineer"
    }
   ],
   "projects": [
   ],
   "responsibilitiesAndAccomplishments": [
    "Developed Ed-tech games and a platform for local schools to teach basics of English, Math, and Rhymes",
    "Developed an engine for tracing games to detect English, Urdu words, and numbers",
    "Led a team of developers, designers, and QA to meet project goals"
   ],
   "summary": "Employed as a Software Engineer ( Unity & C# ) at Brain Game Studios, a leading game development company. Responsible for developing multiple games related to Education.",
   "toolsAndTechnologies": [
    "Unity 3D",
    "C#"
   ]
  }

 ],
in the experience section  the candidate could have multiple roles in the same company so check how it appears in the example and if there is any project to a certine company also include it in the experience section and the example if not keep the property as empty array.
educations: {
                type: Array,
                items: {
                    type: Object,
                    properties: {
                        startDate: { type: String },
                        endDate: { type: String },
                        institutionName: { type: String },
                        location: {
                            type: Object,
                            properties: {
                                cityState: { type: String },
                                country: { type: String }
                            }
                        },
                        level: { type: String },
                        major: { type: String },
                        scoreGPA: { type: String }
                    }
                }
            }:  "educations": [
  {
   "endDate": "2020",
   "institutionName": "Cairo University",
   "level": "Bachelor's degree",
   "location": {
    "cityState": "Cairo",
    "country": "Egypt"
   },
   "major": "Business Administration and Management, General",
   "scoreGPA": "",
   "startDate": "2016"
  },
  {
   "endDate": "2016",
   "institutionName": "Cairo University",
   "level": "Bachelor of Science - BS",
   "location": {
    "cityState": "Cairo",
    "country": "Egypt"
   },
   "major": "Geophysics and Seismology",
   "scoreGPA": "",
   "startDate": "2012"
  }
 ],
 additionalProjects: {
                type: Array,
                optional: true,
                items: {
                    type: Object,
                    properties: {
                        projectName: { type: String },
                        link: { type: String },
                        description: { type: String },
                        responsibilities: {type: Array, optional: true},
                        technologies: { type: Array, items: String, optional: true }
                    }
                }
            }:"additionalProjects": [
  {
   "description": "Developed a mobile application and corresponding website for the buying and selling of top-up, gift, gaming, and entertainment cards. The app is available on both iOS and Android platforms.",
   "link": "http://topupcards.co",
   "projectName": "Top-up Cards - Mobile Application and Website Development",
   "responsibilities": [
   ],
   "technologies": [
    "ASP.NET Core",
    "Web API",
    "SQL Server",
    "HTML",
    "CSS",
    "JavaScript",
    "Angular",
    "Flutter",
    "Dart"
   ]
  },
  {
   "description": "",
   "link": "https://lpicorp.org/",
   "projectName": "Light Peace Initiative Corp",
   "responsibilities": [
   ],
   "technologies": [
    "HTML",
    "CSS",
    "JavaScript",
    "WordPress"
   ]
  }
 ] but if there is no additional project leave it as empty array.
volunteering: {
                type: Array,
                optional: true,
                items: {
                    type: Object,
                    properties: {
                        startDate: { type: String },
                        endDate: { type: String },
                        nameOfVolunteeringActivity: { type: String },
                        location: {
                            type: Object,
                            properties: {
                                cityState: { type: String },
                                country: { type: String }
                            }
                        },
                        type: { type: String },
                        description: { type: String }
                    }
                }
            }: "volunteering": [
  {
   "description": "Organized and conducted tech workshops",
   "endDate": "Jun 2018",
   "location": {
    "cityState": "Suart",
    "country": "India"
   },
   "nameOfVolunteeringActivity": "Tech Community",
   "startDate": "Jun 2017",
   "type": "Comunity service"
  }
 ] but if the data is not exists in the cv don't fill it and leave it as empty array.
awardsCertificates: {
                type: Array,
                optional: true,
                items: {
                    type: Object,
                    properties: {
                        gradeScore: { type: String },
                        eventCourseTitle: { type: String },
                        description: { type: String }, 
                        courseDate: {type: String}
                    }
                }
            }:  "awardsCertificates": [
  {
   "courseDate": "Aug 2022 - Aug 2025",
   "description": "",
   "eventCourseTitle": "AWS Certified Developer Associate",
   "gradeScore": ""
  },
  {
   "courseDate": "Oct 2021 - Oct 2024",
   "description": "",
   "eventCourseTitle": "AWS Certified Cloud Practitioner",
   "gradeScore": ""
  },
  {
   "courseDate": "May 2023",
   "description": "",
   "eventCourseTitle": "Executive Leadership - LinkedIn",
   "gradeScore": ""
  }
 ] also if there is no awards or certificates don't include it and leave the section as empty array.
recommendations: {
                type: Array, 
                optional: true, 
                items: {
                    type: Object,
                    properties: {
                        recommenderName: {type: String}, 
                        recommenderRelation: {type: String}, 
                        recommendationText: {type: String}, 
                        recommenderImg: {type: String},
                        recommendationDate: {type: String}
                    }
                }
            }:
"recommendations": [
  {
   "recommendationDate": "December 18, 2023",
   "recommendationText": "Working with Mughees has been a remarkable learning experience. His mastery of software development is impressive, contributing significantly to the team's success. Mughees excels in writing optimized code, ensuring both efficiency and reliability in our applications. Beyond his technical skills, Mughees is an exceptional mentor. His clear approach to problem-solving and willingness to share knowledge greatly enhanced my professional growth. His calm demeanor and teamwork make him an invaluable leader and colleague. I highly recommend Mughees for any project requiring top-tier expertise in web development. His blend of technical acumen and leadership skills makes him an asset to any team.",
   "recommenderImg": "",
   "recommenderName": "Afzal Z.",
   "recommenderRelation": ""
  },
  {
   "recommendationDate": "October 7, 2023",
   "recommendationText": "I had the privilege of working closely with Mughees as a full stack developer on several projects. He demonstrated exceptional proficiency in React and Python, seamlessly navigating complex challenges and delivering top-notch solutions. His keen eye for detail, collaborative mindset, and problem-solving skills significantly contributed to the success of our team. Mughees consistently impressed with his ability to optimize code, ensuring our applications were both efficient and reliable. He is not only a talented developer but also a great team player, always willing to share expertise and provide guidance. I highly recommend Mughees Mehdi for any project requiring a skilled full stack developer.",
   "recommenderImg": "",
   "recommenderName": "Munaem Rudab",
   "recommenderRelation": "Staff Software Engineer"
  }
 ] Get the recommendations from the LinkedIn profile content as it is and if it does not appear on the LinkedIn content or in the cv just keep it as empty array.

courses: {
                type: Array, 
                    optional: true, 
                    items: {
                        type: Object,
                        properties: {
                        courseProvider: {type: String}, 
                        coursesNames: {type: Array}
                        }
            }: "courses": [
  {
   "courseProvider": "Coursera",
   "coursesNames": [
    "AWS Fundamentals",
    "Deep Learning Specialization",
    "Generative Adversarial Networks (GANs) Specialization",
    "Generative AI with LLMS"
   ]
  },
  {
   "courseProvider": "Deep Learning AI",
   "coursesNames": [
    "Prompt Engineering"
   ]
  }
 ] if the data doesn't exist in the cv don't fill this and keep it as empty array.
Please process the provided information according to these instructions and generate the JSON output.
Output shouldn't contain any explanation and just return the JSON without anything else.
      `;

      return prompt;
    } catch (error) {
      console.log("Error generating prompt:", error);
      throw new Error(`Error generating prompt: ${error.message}`);
    }
  }
}
module.exports = PromptService;
