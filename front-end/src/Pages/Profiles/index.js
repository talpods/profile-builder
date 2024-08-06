import { Button, Col, Row, Tabs, message } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";

import axios from "axios";
import DeleteModal from "../../Components/Profiles/DeleteModal";
import TabContent from "../../Components/Profiles/TabContent";
import useFetchProfiles from "../../Hooks/useFetchProfile";
import useUserRole from "../../Hooks/useUserRole";
import { DELETE_PROFILE } from "../../api";

const Profiles = () => {
	const [status, setStatus] = useState("");
	const [pagination, setPagination] = useState(null);
	const { profiles, fetchProfiles, setProfiles, resetPagination } =
		useFetchProfiles(status, setPagination, pagination);
	const activeTabKey = useUserRole(setStatus);
	const [isConfirmOpen, setIsConfirmOpen] = useState(false);
	const [profileToDelete, setProfileToDelete] = useState(null);
	const [activeKey, setActiveKey] = useState(null);
	const [lastProfileStatus, setLastProfileStatus] = useState("");

	useEffect(() => {
		if (activeTabKey) {
			setActiveKey(activeTabKey);
		}
	}, [activeTabKey]);

	useEffect(() => {
		if (activeKey !== null) {
			resetPagination();
		}
	}, [status]);

	useEffect(() => {
		const interval = setInterval(() => {
			const lastProfile = profiles[0];
			if (lastProfile) {
				if (
					lastProfile.status === "processing" ||
					lastProfile.status === "generating"
				) {
					fetchProfiles(true);
				} else if (
					lastProfile.status === "draft" &&
					lastProfileStatus !== "draft"
				) {
					message.success("Profile created successfully!");
					clearInterval(interval);
				} else if (lastProfile.status === "error") {
					message.error("Error in creating profile!");
					clearInterval(interval);
				}

				setLastProfileStatus(lastProfile.status);
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [profiles]);

	const confirmDelete = (slug) => {
		setProfileToDelete(slug);
		setIsConfirmOpen(true);
	};

	const handleConfirmDelete = () => {
		if (profileToDelete) {
			axios
				.delete(`${DELETE_PROFILE}${profileToDelete}`)
				.then(() => {
					setIsConfirmOpen(false);
					setProfiles((prevProfiles) =>
						prevProfiles.filter((profile) => profile.slug !== profileToDelete)
					);
				})
				.catch((err) => {
					console.log("Failed to delete profile", err);
				});
		}
	};

	const handleCancelDelete = () => {
		setIsConfirmOpen(false);
		setProfileToDelete(null);
	};

	const handleShowMore = () => {
		fetchProfiles();
	};

	const getStatusFromActiveKey = (key) => {
		switch (key) {
			case "1":
				return "in-tech-review";
			case "2":
				return "in-business-review";
			case "3":
				return "draft";
			case "4":
				return "completed";
			default:
				return "all";
		}
	};

	const handleChangeTab = (key) => {
		setStatus(getStatusFromActiveKey(key));
		setActiveKey(key);
	};

	if (activeKey === null) {
		return null;
	}

	return (
		<>
			<Tabs activeKey={activeKey} onChange={(key) => handleChangeTab(key)}>
				<TabPane tab="Tech reviewer" key="1">
					<TabContent
						tabKey="1"
						profiles={profiles}
						confirmDelete={confirmDelete}
					/>
				</TabPane>
				<TabPane tab="Business reviewer" key="2">
					<TabContent
						tabKey="2"
						profiles={profiles}
						confirmDelete={confirmDelete}
					/>
				</TabPane>
				<TabPane tab="Recruiter" key="3">
					<TabContent
						tabKey="3"
						profiles={profiles}
						confirmDelete={confirmDelete}
					/>
				</TabPane>
				<TabPane tab="Completed" key="4">
					<TabContent
						tabKey="4"
						profiles={profiles}
						confirmDelete={confirmDelete}
					/>
				</TabPane>
				<TabPane tab="All" key="5">
					<TabContent
						tabKey="5"
						profiles={profiles}
						confirmDelete={confirmDelete}
					/>
				</TabPane>
			</Tabs>

			{pagination !== null && (
				<Row justify="center" style={{ marginTop: "20px" }}>
					<Col>
						<Button type="primary" onClick={handleShowMore}>
							Show more
						</Button>
					</Col>
				</Row>
			)}
			<DeleteModal
				isConfirmOpen={isConfirmOpen}
				handleConfirmDelete={handleConfirmDelete}
				handleCancelDelete={handleCancelDelete}
			/>
		</>
	);
};

export default Profiles;
