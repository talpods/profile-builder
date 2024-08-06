import SimpleForm from "../../Components/Forms/CreateProfileForm";
function CreateProfilePage() {
	return (
		<>
			<h1
				style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}
			>
				Create profile
			</h1>
			<SimpleForm />
		</>
	);
}

export default CreateProfilePage;
