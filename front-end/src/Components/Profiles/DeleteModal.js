import { Modal } from "antd";
import React from "react";

const DeleteModal = ({
	isConfirmOpen,
	handleConfirmDelete,
	handleCancelDelete,
}) => (
	<Modal
		title="Confirm Deletion"
		onOk={handleConfirmDelete}
		open={isConfirmOpen}
		onCancel={handleCancelDelete}
		okText="Delete"
		cancelText="Cancel"
	>
		<p>Are you sure you want to delete this profile?</p>
	</Modal>
);

export default DeleteModal;
