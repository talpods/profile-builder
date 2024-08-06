import { Button } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import ProfilesTable from "./ProfilesTable";

const TabContent = ({ profiles, confirmDelete }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate("/create-profile");
	};

	return (
		<div>
			<div
				style={{
					width: "100%",
					display: "flex",
					justifyContent: "flex-end",
					marginBottom: "20px",
				}}
			>
				<Button type="primary" onClick={handleClick}>
					Create profile
				</Button>
			</div>
			<ProfilesTable profiles={profiles} onDelete={confirmDelete} />
		</div>
	);
};

export default TabContent;
