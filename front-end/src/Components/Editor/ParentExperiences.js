import React from "react";
import EditBtn from "../UI/EditBtn";
import ExperienceEntry from "./Experience";
const Experiences = ({ data }) => {
  if (data.experiences.length === 0) {
    return (
      <section
        id="experience"
        className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
        data-toggle
      ></section>
    );
  }
  return (
    <section
      id="experience"
      className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
      data-toggle
    >
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Experiences</h2>
        <EditBtn formType="ExperiencesForm" data={data} />
      </div>

      <div className="content custom-height">
        <div className="w-100 h-px bg-Gray my-8"></div>
        {data.experiences.map((experience, experienceIndex) => (
          <ExperienceEntry
            key={experienceIndex}
            experience={experience}
            experienceIndex={experienceIndex}
            totalExperiences={data.experiences.length}
            data={data}
          />
        ))}
      </div>
    </section>
  );
};

export default Experiences;
