import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import About from "../../Components/Editor/About";
import Awards from "../../Components/Editor/Awards";
import Courses from "../../Components/Editor/Courses";
import Education from "../../Components/Editor/Education";
import Experiences from "../../Components/Editor/ParentExperiences";
import ParentProject from "../../Components/Editor/ParentProject";
import Recommendation from "../../Components/Editor/Recommendation";
import Status from "../../Components/Editor/Status";
import TechnicalSkills from "../../Components/Editor/TechnicalSkills";
import Volunteering from "../../Components/Editor/Volunteering";
import { fetchProfile } from "../../State/profile/profileSlice";
import "../../editor.css";

function ProfileEditor() {
	const { slug } = useParams();
	const dispatch = useDispatch();
	const profile = useSelector((state) => state.profile.data);

	useEffect(() => {
		if (slug) {
			dispatch(fetchProfile(slug));
		}
	}, [slug, dispatch]);

	return (
		<>
			{profile && (
				<div>
					<Status data={profile} />
					<About data={profile} />
					<TechnicalSkills data={profile} />
					<Experiences data={profile} />
					<Education data={profile} />
					<Courses data={profile} />
					<ParentProject data={profile} />
					<Awards data={profile} />
					<Volunteering data={profile} />
					<Recommendation data={profile} />
				</div>
			)}
		</>
	);
}

export default ProfileEditor;
