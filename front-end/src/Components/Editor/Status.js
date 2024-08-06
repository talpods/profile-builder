import EditBtn from "../UI/EditBtn";
function Status({ data }) {
  return (
    <section
      id="status"
      class="container bg-white mx-auto mt-4 flex flex-wrap py-6 px-4 rounded-lg lg:space-x-9 lg:flex-nowrap lg:px-10 lg:mt-6"
    >
      <div class="w-full" id="profile-info-container">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-xl">
              {data.firstName}'s profile status is currently ({data.status}).
            </h2>
          </div>
          <EditBtn formType="EditStatus" data={data} />
        </div>
      </div>
    </section>
  );
}

export default Status;
