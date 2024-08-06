import React from "react";
import EditBtn from "../UI/EditBtn";

const Courses = ({ data }) => {
  if (data.courses.length === 0) {
    return (
      <section className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10">
        {/* Section title */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Courses</h2>
          <EditBtn formType="EditCourses" data={data} />
        </div>
      </section>
    );
  }
  return (
    <section className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10">
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Courses</h2>
        <EditBtn formType="EditCourses" data={data} />
      </div>
      <div className="content">
        <div className="w-100 h-px bg-Gray my-8"></div>

        {data.courses.map((course, index) => (
          <div key={index} className="lg:flex lg:space-x-9">
            {/* left side + Course Title */}
            <div className="lg:w-1/6">
              <h2 className="text-base font-bold text-EX1 mb-3 lg:mb-6">
                {course.courseProvider}
              </h2>
            </div>
            {/* right */}
            <div className="lg:w-5/6">
              <div>
                {/* Courses desc */}
                <div className="courses-desc pb-6 -mt-2">
                  <ul className="list-disc list-indent pl-2 ml-4">
                    {course.coursesNames.map((c, idx) => (
                      <li key={idx} className="my-2">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Courses;
