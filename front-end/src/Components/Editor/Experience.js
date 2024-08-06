import React from "react";
import EditBtn from "../UI/EditBtn";
import RegenerateBtn from "../UI/RegenerateBtn";

const ExperienceEntry = ({
  experience,
  experienceIndex,
  totalExperiences,
  data,
}) => {
  if (!experience) return null;
  return (
    <div className="flex space-x-9">
      {/* Left side + Dates */}
      <div className="hidden lg:block lg:w-1/6">
        {experience.positions.map((position, index) => (
          <div key={index}>
            <h2
              className={`text-base font-bold text-EX${
                index + 1 > 3 ? 3 : index + 1
              } mb-6`}
            >
              {position.startDate} - {position.endDate || "Present"}
            </h2>
            {position.note && (
              <p className="text-sm text-EX2 __web-inspector-hide-shortcut__">
                {position.note}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Right */}
      <div className="w-5/6">
        <div>
          {/* Experience titles */}
          {experience.positions.map((position, index) => (
            <div key={index} className="mb-2 lg:mb-0 experience-title-small">
              <h2
                className={`text-base font-bold text-EX${
                  index + 1 > 3 ? 3 : index + 1
                } mb-1 block lg:hidden lg:mb-6`}
              >
                {position.startDate} - {position.endDate || "Present"}
              </h2>
              <h2
                className={`text-base font-bold text-EX${
                  index + 1 > 3 ? 3 : index + 1
                } mb-1 experience-title lg:mb-6`}
              >
                <span className="block lg:inline-block">{position.title}</span>
                <span className="hidden lg:inline-block">-</span>
                <span className="block lg:inline-block">
                  {experience.companyName} | ({position.employmentType})
                </span>
              </h2>
            </div>
          ))}

          {/* Experience desc */}
          <div
            className={`experience-desc mt-6 pb-6 ${
              experienceIndex === totalExperiences - 1 ? "" : "mb-6"
            }`}
          >
            <p>{experience.summary}</p>
            <RegenerateBtn
                formType="ExperienceSummary"
                data={data}
                experienceIndex={experienceIndex}
              />
            {experience.candidatesUniqueAchievement && (
              <p>{experience.candidatesUniqueAchievement}</p>
            )}
            {/* Responsibilities */}
            <h3 className="text-base font-bold mt-6">Responsibilities:</h3>
            <ul className="mt-2 list-disc list-indent pl-2 ml-4">
              {experience.responsibilitiesAndAccomplishments.map(
                (item, index) => (
                  <li key={index} className="my-2">
                    {item}
                  </li>
                )
              )}
            </ul>
            <RegenerateBtn
                formType="ُExperienceResponsibilities"
                data={data}
                experienceIndex={experienceIndex}
              />
            {/* Technologies */}
            <h3 className="text-base font-bold mt-6 mb-3">
              Tools and Technologies
            </h3>
            <div>
              {experience.toolsAndTechnologies.map((tech, index) => (
                <span
                  key={index}
                  className="inline-block border-2 border-Gray rounded-full text-xs py-1 px-2 font-bold mb-2"
                >
                  {tech}
                </span>
              ))}
            </div>

            {/* Projects */}
            {experience.projects.length > 0 && (
              <div className="bg-LightPurple py-6 px-4 mt-5 rounded-md">
                <h3 className="text-base font-bold">Projects:</h3>
                {experience.projects.map((project, projectIndex) => (
                  <div key={projectIndex} className="flex mt-2">
                    {/* Project number */}
                    <span className="inline-block mr-4 font-normal">
                      {projectIndex + 1}
                    </span>
                    {/* Project info */}
                    <div>
                      <div>
                        <span className="text-base font-bold">
                          {project.projectName}
                        </span>
                      </div>
                      {/* Responsibilities */}
                      <p className="mt-2">{project.description}</p>
                      {project.responsibilities.length > 0 && (
                        <>
                          <h3 className="text-base font-bold mt-6">
                            Responsibilities:
                          </h3>
                          <ul className="mb-6 list-disc list-indent pl-2 ml-4">
                            {project.responsibilities.map(
                              (responsibility, index) => (
                                <li key={index} className="my-2">
                                  {responsibility}
                                </li>
                              )
                            )}
                          </ul>
                        </>
                      )}
                      <div className="flex">
                        <span className="font-bold mr-3">Link:</span>
                        <a
                          href={project.link}
                          target="_blank"
                          className="text-Primary font-semibold"
                          rel="noopener noreferrer"
                        >
                          {project.link}
                        </a>
                      </div>
                      {/* Technologies */}
                      <div className="mt-2">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="inline-block border-2 border-Gray rounded-full text-xs py-1 px-2 font-bold mb-2"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex space-x-2">
                 <EditBtn formType="EditExperience" data={data} experienceIndex={experienceIndex} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExperienceEntry;
