import EditBtn from "../UI/EditBtn";
import RegenerateBtn from "../UI/RegenerateBtn";
function About({ data }) {
  return (
    <section
      id="summary"
      class="container bg-white mx-auto mt-4 flex flex-wrap py-6 px-4 rounded-lg lg:space-x-9 lg:flex-nowrap lg:px-10 lg:mt-6"
    >
      <div class="w-full" id="profile-info-container">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl">
              {data.firstName} {data.secondNameInitials}
            </h1>
            <h2 className="text-xl font-normal mt-5">
              {data.level} | {data.seniority}
            </h2>
          </div>
        </div>
        <EditBtn formType="EditLevel" data={data} />
        <div class="flex space-x-2">
          <h4 class="text-lg font-bold mt-6">Summary</h4>
        </div>
        <p class="text-base mt-2">{data.summary}</p>
        <div class="flex space-x-2">
          <EditBtn formType="EditSummary" data={data} />
          <RegenerateBtn formType="summary" data={data} />
        </div>
        <h4 class="text-lg font-bold mt-6">Based in:</h4>
        <p class="text-base mt-1">
          {data.bases.cityState}, {data.bases.country}
        </p>
        <EditBtn formType="EditBases" data={data} />
        <h4 class="text-lg font-bold mt-6">Languages</h4>
        <p class="text-base mt-1">
          {data.languages.map(
            (language) =>
              language.name + "(" + language.proficiencyLevel + "), "
          )}
        </p>
        <EditBtn formType="EditLanguages" data={data} />
        <div class="flex mt-6 font-semibold space-x-2">
          {data.scoreSheetLink && (
            <a href={data.scoreSheetLink} target="_blank" class="text-Primary">
              TalPods Evaluation Report
            </a>
          )}
        </div>
      </div>
    </section>
  );
}

export default About;
