import React from "react";
import EditBtn from "../UI/EditBtn";

const Education = ({ data }) => {
  if (data.educations.length === 0) {
    return (
      <section
        id="education"
        className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
        data-toggle
      >
        {/* Section title */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Education</h2>
          <EditBtn formType="EditEducation" data={data} />
        </div>
      </section>
    );
  }
  return (
    <section
      id="education"
      className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
      data-toggle
    >
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Education</h2>
        <EditBtn formType="EditEducation" data={data} />
      </div>
      <div className="content">
        <div className="w-100 h-px bg-Gray my-8"></div>
        {data.educations.map((education, educationIndex) => (
          // Education entry
          <div className="flex space-x-9" key={educationIndex}>
            {/* left side + Dates */}
            <div className="hidden lg:block lg:w-1/6">
              <h2 className="text-base font-bold text-EX1 mb-6">
                {education.startDate} - {education.endDate || "Present"}
              </h2>
            </div>
            {/* right */}
            <div className="w-5/6">
              <div>
                {/* Education titles */}
                <div>
                  {/* title */}
                  <div className="mb-2 lg:mb-0 education-title-small">
                    <h2 className="text-base font-bold text-EX1 mb-1 block lg:hidden lg:mb-6">
                      {education.startDate} - {education.endDate || "Present"}
                    </h2>
                    <h2 className="text-base font-bold text-EX1 mb-1 education-title lg:mb-6">
                      {education.institutionName}
                    </h2>
                  </div>
                </div>
                {/* Education desc */}
                <div
                  className={`education-desc pb-6 ${
                    educationIndex === data.educations.length - 1 ? "" : "mb-6"
                  }`}
                >
                  <p>
                    {education.level} ({education.major}){" "}
                    {education.scoreGPA && `- CGPA: ${education.scoreGPA}`}
                  </p>
                  <p>
                    {education.location.cityState}, {education.location.country}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Education;
