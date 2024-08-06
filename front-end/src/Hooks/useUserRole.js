import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useUserRole = (setStatus) => {
	const [activeTabKey, setActiveTabKey] = useState("1");
	const { user } = useSelector((state) => state.auth);
	const userData = user?.user;

	useEffect(() => {
		if (userData?.roles) {
			if (userData.roles.techReviewer) {
				setActiveTabKey("1");
				setStatus("in-tech-review");
			} else if (userData.roles.buisnessReviewer) {
				setActiveTabKey("2");
				setStatus("in-business-review");
			} else if (userData.roles.recruiter) {
				setActiveTabKey("3");
				setStatus("draft");
			}
		}
	}, [userData]);

	return activeTabKey;
};

export default useUserRole;
