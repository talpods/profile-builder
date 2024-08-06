import React from "react";
import EditBtn from "../UI/EditBtn";
import RegenerateBtn from "../UI/RegenerateBtn";

const Recommendation = ({ data }) => {
  if (data.recommendations.length === 0) {
    return (
      <section
        className="container bg-white mx-auto mt-2 py-6 px-4 rounded-lg lg:px-10"
        data-toggle
      >
        {/* Section title */}
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl">Recommendations</h2>
          <EditBtn formType="EditRecommendations" data={data} />
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
        <h2 className="font-bold text-xl">Recommendations</h2>
        <EditBtn formType="EditRecommendations" data={data} />
      </div>
      <div className="content">
        <div className="w-100 h-px bg-Gray my-8"></div>
        {data.recommendations.map((recommendation, index) => (
          <div key={index} className="lg:flex lg:space-x-9 mb-6">
            {/* Left side + Project Title */}
            <div className="lg:w-1/6">
              <div className="flex add-wrap gap-3 items-center">
                {/* Title and name flex container */}
                <div className="lg:w-3/4">
                  <h3 className="text-base font-bold">
                    {recommendation.recommenderName}
                  </h3>
                  <p className="text-xs text-EX2">
                    {recommendation.recommenderRelation}
                  </p>
                </div>
              </div>
            </div>
            {/* Right side */}
            <div className="lg:w-5/6">
              {/* Recommendation desc */}
              <div className="recom-desc mt-4 lg:mt-0">
                <p className="text-base">{recommendation.recommendationText}</p>
                <RegenerateBtn
                  formType="Recommendations"
                  data={data}
                  recommendationIndex={index}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
export default Recommendation;
