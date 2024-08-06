import { Modal } from "antd";
import React from "react";

const ConfirmModal = ({ isConfirmOpen, handleConfirm, handleCancel }) => (
	<Modal
		title="Confirm Recreate"
		onOk={handleConfirm}
		open={isConfirmOpen}
		onCancel={handleCancel}
		okText="Yes"
		cancelText="No"
	>
		<p>
			This will update all the changes you done before and create re-create the
			profile agian. Do you want to continue?
		</p>
	</Modal>
);

export default ConfirmModal;
