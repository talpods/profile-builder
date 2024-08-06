import React from "react";
import EditBtn from "../UI/EditBtn";

const Awards = ({ data }) => {
  if (data.awardsCertificates.length === 0) {
    return (
      <section
        id="awards"
        className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
        data-toggle
      >
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Awards & Certificates</h2>
          <EditBtn formType="EditAwards" data={data} />
        </div>
      </section>
    );
  }
  return (
    <section
      id="awards"
      className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
      data-toggle
    >
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Awards & Certificates</h2>
        <EditBtn formType="EditAwards" data={data} />
      </div>

      {/* Awards Container */}
      <div className="content">
        <div className="w-100 h-px bg-Gray my-8"></div>
        <div className="flex flex-wrap gap-4">
          {data?.awardsCertificates?.map((award, index) => (
            /* Award entry */
            <div
              key={index}
              className="w-full bg-LightPurple rounded-lg py-6 px-4 lg:w-[248px] lg:h-[248px]"
            >
              <p className="text-base text-EX2 my-4">
                {award.courseDate || award.gradeScore}
              </p>
              <h2 className="text-xl font-bold">{award.eventCourseTitle}</h2>
              <p className="mt-2">{award.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Awards;
