import React from "react";
import RegenerateBtn from "../UI/RegenerateBtn";


const Project = ({ project, projectIndex, data }) => {
  if (!project) return null;
  return (
    <div className="lg:flex lg:space-x-9 mb-6">
      {/* left side + Project Title */}
      <div className="lg:w-1/6">
        <h2 className="text-base font-bold text-EX1">{project.projectName}</h2>
      </div>

      {/* Left */}
      <div className="lg:w-5/6">
        <div className="lg:flex lg:justify-between">
          {/* Projects desc */}
          <div className="projects-desc mt-2 lg:w-5/6 lg:mt-0">
            <p>{project.description}</p>
            {project.responsibilities?.length > 0 && (
              <>
                <h3 className="text-base font-bold mt-6">Responsibilities:</h3>
                <ul className="mt-2 list-disc list-indent pl-2 ml-4">
                  {project.responsibilities.map((responsibility, index) => (
                    <li key={index} className="my-2">
                      {responsibility}
                    </li>
                  ))}
                </ul>
              </>
            )}
            {project.technologies?.length > 0 && (
              <>
                <h3 className="text-base font-bold mt-6 mb-3">Technologies:</h3>
                <div>
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="inline-block border-2 border-Gray rounded-full text-xs py-1 px-2 font-bold mb-2"
                    >
                      {tech}
                    </span>
                  ))}
                  <div className="flex space-x-2">
                    <RegenerateBtn
                      formType="AdditionalProjects"
                      data={data}
                      projectIndex={projectIndex}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right */}
          <div className="mt-2 lg:w-1/6 lg:mt-0">
            <div>
              {/* Projects Link */}
              {project.link && (
                <div className="projects-link lg:text-right">
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-Primary font-semibold"
                  >
                    Link
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Project;
