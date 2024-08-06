import React from "react";
import EditBtn from "../UI/EditBtn";
const Volunteering = ({ data }) => {
  const volunteeringData = data.volunteering || [];
  if (volunteeringData.length === 0) {
    return (
      <section
        id="volunteering"
        className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
        data-toggle
      >
        {/* Section title */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Volunteering</h2>
          <EditBtn formType="EditVolunteering" data={data} />
        </div>
      </section>
    );
  }
  return (
    <section
      id="volunteering"
      className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
      data-toggle
    >
      {/* Section title */}
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl">Volunteering</h2>
        <EditBtn formType="EditVolunteering" data={data} />
      </div>
      <div className="content">
        <div className="w-100 h-px bg-Gray my-8"></div>
        {data?.volunteering.map((volunteering, volunteeringIndex) => (
          // Volunteering entry
          <div className="flex space-x-9" key={volunteeringIndex}>
            {/* left side + Dates */}
            <div className="hidden lg:block lg:w-1/6">
              <h2 className="text-base font-bold text-EX1 mb-6">
                {volunteering.startDate} - {volunteering.endDate}
              </h2>
              <p className="text-sm text-EX2">{volunteering.type}</p>
            </div>
            {/* right */}
            <div className="w-5/6">
              <div>
                {/* Volunteering titles */}
                <div>
                  {/* title */}
                  <div className="mb-2 lg:mb-0 volunteer-title-small">
                    <h2 className="text-base font-bold text-EX1 mb-1 block lg:hidden lg:mb-6">
                      {volunteering.startDate} - {volunteering.endDate}
                    </h2>
                    <h2 className="text-base font-bold text-EX1 mb-1 volunteer-title lg:mb-6">
                      {volunteering.nameOfVolunteeringActivity}
                    </h2>
                  </div>
                </div>
                {/* Volunteering desc */}
                <div
                  className={`volunteer-desc pb-6 ${
                    volunteeringIndex === data.volunteering.length - 1
                      ? ""
                      : "mb-6"
                  }`}
                >
                  <p>{volunteering.description}</p>
                  <p>
                    {volunteering.location.cityState},{" "}
                    {volunteering.location.country}
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
export default Volunteering;
