import React from "react";
import EditBtn from "../UI/EditBtn";
import Project from "./Project";

const AdditionalProjects = ({ data }) => {
  if (data.additionalProjects.length === 0) {
    return (
      <section
        id="projects"
        className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
        data-toggle
      >
        {/* Section title */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Projects</h2>
          <EditBtn formType="EditProjects" data={data} />
        </div>
      </section>
    );
  }
  return (
    <section
      id="projects"
      className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
      data-toggle
    >
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Projects</h2>
        <EditBtn formType="EditProjects" data={data} />
      </div>

      <div className="content custom-height">
        <div className="w-100 h-px bg-Gray my-8"></div>
        {data.additionalProjects.map((project, projectIndex) => (
          <Project
            key={projectIndex}
            project={project}
            projectIndex={projectIndex}
            totalProjects={data.additionalProjects.length}
            data={data}
          />
        ))}
      </div>
    </section>
  );
};

export default AdditionalProjects;
