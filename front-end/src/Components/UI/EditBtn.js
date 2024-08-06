import React, { useEffect, useRef, useState } from "react";

import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";
import {
	LevelSeniorityForm,
	SummaryForm,
	LanguagesForm,
	LocationForm,
	TechnicalSkillsForm,
	EducationForm,
	CoursesForm,
	AwardsForm,
	ProjectsForm,
	ExperienceForm,
	VolunteeringForm,
	RecommendationsForm,
	ExperiencesForm,
} from "../Forms/EditForms";
import { EditStatusForm } from "../Forms/EditStatusForm";

const EditBtn = ({ formType, data, experienceIndex }) => {
	const [showForm, setShowForm] = useState(false);
	const modalRef = useRef(null);
	const handleClickButton = () => {
		setShowForm(true);
	};

	const handleCloseModal = () => {
		setShowForm(false);
	};
	const handleClickOutside = (event) => {
		if (modalRef.current && !modalRef.current.contains(event.target)) {
			handleCloseModal();
		}
	};

	useEffect(() => {
		if (showForm) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [showForm]);

	const renderForm = () => {
		switch (formType) {
			case "EditStatus":
				return <EditStatusForm data={data} close={handleCloseModal} />;
			case "EditLevel":
				return <LevelSeniorityForm data={data} close={handleCloseModal} />;
			case "EditSummary":
				return <SummaryForm data={data} close={handleCloseModal} />;
			case "EditBases":
				return <LocationForm data={data} close={handleCloseModal} />;
			case "EditLanguages":
				return <LanguagesForm data={data} close={handleCloseModal} />;
			case "EditSkills":
				return <TechnicalSkillsForm data={data} close={handleCloseModal} />;
			case "EditExperienceSummary":
				return <LevelSeniorityForm data={data} close={handleCloseModal} />;
			case "EditTechnicalSkills":
				return <LevelSeniorityForm data={data} close={handleCloseModal} />;
			case "EditEducation":
				return <EducationForm data={data} close={handleCloseModal} />;
			case "EditCourses":
				return <CoursesForm data={data} close={handleCloseModal} />;
			case "EditAwards":
				return <AwardsForm data={data} close={handleCloseModal} />;
			case "EditProjects":
				return <ProjectsForm data={data} close={handleCloseModal} />;
			case "EditExperience":
				return (
					<ExperienceForm
						data={data}
						experienceIndex={experienceIndex}
						close={handleCloseModal}
					/>
				);
			case "ExperiencesForm":
				return (
					<ExperiencesForm
						data={data}
						experienceIndex={experienceIndex}
						close={handleCloseModal}
					/>
				);

			case "EditVolunteering":
				return <VolunteeringForm data={data} close={handleCloseModal} />;
			case "EditRecommendations":
				return <RecommendationsForm data={data} close={handleCloseModal} />;
			default:
				return null;
		}
	};

	return (
		<div className="button-container">
			<Button
				type="primary"
				size="small"
				icon={<EditOutlined />}
				onClick={handleClickButton}
			>
				Edit
			</Button>
			{showForm && (
				<div className="modal">
					<div className="modal-content">
						<span className="close-button" onClick={handleCloseModal}>
							&times;
						</span>
						{renderForm()}
					</div>
				</div>
			)}
		</div>
	);
};

export default EditBtn;
