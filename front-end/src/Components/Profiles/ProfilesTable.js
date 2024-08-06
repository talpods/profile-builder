import {
	DeleteOutlined,
	EditOutlined,
	FolderViewOutlined,
	ReloadOutlined,
} from "@ant-design/icons";
import { Button, Flex, Spin, Table, Tag, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { VIEW_PROFILE } from "../../api";

const statusColorMap = {
	draft: "gray",
	"in-tech-review": "blue",
	"in-business-review": "orange",
	processing: "green",
	completed: "green",
};

function ProfilesTable({ profiles, onDelete }) {
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();
	const handleClick = (slug) => {
		navigate(`/recreate-profile?slug=${slug}`);
	};

	const columns = [
		{
			title: "Profile number",
			dataIndex: "profileNumber",
			key: "profileNumber",
			render: (text) => <p>{text}</p>,
		},
		{
			title: "Full name",
			dataIndex: "fullName",
			key: "fullName",
			render: (text) => <p>{text}</p>,
		},
		{
			title: "Email",
			dataIndex: "email",
			key: "email",
			render: (text) => <p>{text}</p>,
		},
		{
			title: "Position",
			dataIndex: "position",
			key: "position",
			render: (text) => <p>{text}</p>,
		},
		{
			title: "Status",
			key: "status",
			dataIndex: "status",
			render: (status) => {
				const color = statusColorMap[status] || "default"; // Default color if status not found
				return <Tag color={color}>{status.toUpperCase()}</Tag>;
			},
		},
		{
			title: "Action",
			key: "action",
			render: (_, profile) => (
				<Flex gap={6}>
					<Tooltip title="Preview">
						<a
							href={`${VIEW_PROFILE}${profile.slug}`}
							target="_blank"
							rel="noreferrer"
							style={{
								padding: "4px 8px",
								border: "1px solid #ddd",
								borderRadius: "50%",
								color: "black",
							}}
						>
							<FolderViewOutlined />
						</a>
					</Tooltip>
					<Tooltip title="Edit">
						<Button
							shape="circle"
							icon={<EditOutlined />}
							onClick={() => {
								navigate(`/profiles/editor/${profile.slug}`);
							}}
						/>
					</Tooltip>
					<Tooltip title="Delete">
						<Button
							shape="circle"
							icon={<DeleteOutlined />}
							onClick={() => {
								onDelete(profile.slug);
							}}
						/>
					</Tooltip>
					<Tooltip title="Recreate">
						<Button
							shape="circle"
							onClick={() => handleClick(profile.slug)}
							icon={<ReloadOutlined />}
						/>
					</Tooltip>
				</Flex>
			),
		},
	];

	const dataSource = profiles.map((profile) => ({
		key: profile.profileNumber || "",
		profileNumber: profile.profileNumber || "",
		fullName: `${profile.firstName} ${profile.secondNameInitials}` || "",
		email: profile.email || "",
		position: profile.seniority || "",
		status: profile.status || "",
		slug: profile.slug || "",
	}));
	useEffect(() => {
		if (dataSource.length !== 0) {
			setLoading(false);
		} else {
			setLoading(true);
		}
	}, [dataSource]);
	return (
		<Spin spinning={loading} tip="Loading...">
			<Table columns={columns} dataSource={dataSource} pagination={false} />
		</Spin>
	);
}

export default ProfilesTable;
