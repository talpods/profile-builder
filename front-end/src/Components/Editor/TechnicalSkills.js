import React from "react";
import EditBtn from "../UI/EditBtn";
import RegenerateBtn from "../UI/RegenerateBtn";

function TechnicalSkills({ data }) {
  if (data.technicalSkills.length === 0) {
    return (
      <section
        className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
        data-toggle
      >
        {/* Section title */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Technical Skills</h2>
          <div className="flex space-x-2">
            <EditBtn formType="EditSkills" data={data} />
            <RegenerateBtn formType="CandidateTechnicalSkills" data={data} />
          </div>
        </div>
      </section>
    );
  }
  return (
    <section
      className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
      data-toggle
    >
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Technical Skills</h2>
        <div className="flex space-x-2">
          <EditBtn formType="EditSkills" data={data} />
          <RegenerateBtn formType="CandidateTechnicalSkills" data={data} />
        </div>
      </div>
      <div className="content">
        <div className="w-100 h-px bg-Gray my-4"></div>
        {/* Skill categories */}
        {data.technicalSkills.map((skillSection, sectionIndex) => (
          <div
            key={sectionIndex}
            className="mb-6 lg:flex lg:space-x-6 lg:space-x-9"
          >
            <h3 className="mb-2 font-bold text-lg lg:w-1/6">
              {skillSection.sectionName}:
            </h3>
            <p className="lg:w-5/6">
              {skillSection.skills.map((sk, index) => (
                <React.Fragment key={index}>
                  {sk}
                  {index === skillSection.skills.length - 1 ? "." : ", "}
                </React.Fragment>
              ))}
            </p>
          </div>
        ))}
        <div className="ml-auto"></div>
      </div>
    </section>
  );
}

export default TechnicalSkills;
