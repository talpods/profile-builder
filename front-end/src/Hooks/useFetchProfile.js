import axios from "axios";
import { useEffect, useState } from "react";
import { GET_PROFILES } from "../api";

const useFetchProfiles = (status, setPagination, pagination) => {
	const [profiles, setProfiles] = useState([]);

	useEffect(() => {
		fetchProfiles();
	}, []);

	const fetchProfiles = (resetPagination = false) => {
		let params = {
			limit: 5,
			status,
		};

		if (status === "all")
			params = {
				limit: 5,
				status: "",
			};
		if (!resetPagination && pagination) {
			params.lastEvaluatedKey = JSON.stringify(pagination);
		}

		if (resetPagination) {
			setProfiles([]);
			setPagination(null);
		}

		if (status !== "")
			axios
				.get(GET_PROFILES, { params })
				.then((res) => {
					setProfiles((prevProfiles) => {
						const newProfiles = res.data.profiles.filter(
							(profile) => !prevProfiles.some((p) => p.slug === profile.slug)
						);
						return [...prevProfiles, ...newProfiles];
					});
					setPagination(res.data.lastEvaluatedKey);
				})
				.catch((err) => {
					console.error(err);
				});
	};

	const resetPagination = () => {
		fetchProfiles(true);
	};

	return { profiles, setProfiles, fetchProfiles, resetPagination };
};

export default useFetchProfiles;
