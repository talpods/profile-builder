import { OpenAIOutlined } from "@ant-design/icons";
import { Button } from "antd";
import React, { useState } from "react";
import {
  AdditionalProjects,
  CandidateTechnicalSkills,
  ExperienceResponsibilities,
  ExperienceSummary,
  RecommendationRegenerateForm,
  SummaryRegenerateForm,
  SummaryRegenerateFormForJunior,
} from "../Forms/RegenerateForms";

const RegenerateBtn = ({
  formType,
  data,
  projectIndex,
  experienceIndex,
  recommendationIndex,
}) => {
  const [showForm, setShowForm] = useState(false);
  const handleClickButton1 = () => {
    setShowForm(true);
  };

  const handleCloseModal = () => {
    setShowForm(false);
  };

  const renderForm = () => {
    switch (formType) {
      case "summary":
        return (
          <>
            {data.level == "Software engineer entry level" ||
            data.level == "Software engineer level 1" ? (
              <SummaryRegenerateFormForJunior
                data={data}
                close={handleCloseModal}
              />
            ) : (
              <SummaryRegenerateForm data={data} close={handleCloseModal} />
            )}
          </>
        );
      case "ExperienceSummary":
        return (
          <ExperienceSummary
            data={data}
            experienceIndex={experienceIndex}
            close={handleCloseModal}
          />
        );
      case "ُExperienceResponsibilities":
        return (
          <ExperienceResponsibilities
            data={data}
            experienceIndex={experienceIndex}
            close={handleCloseModal}
          />
        );
      case "CandidateTechnicalSkills":
        return (
          <CandidateTechnicalSkills data={data} close={handleCloseModal} />
        );
      case "AdditionalProjects":
        return (
          <AdditionalProjects
            data={data}
            projectIndex={projectIndex}
            close={handleCloseModal}
          />
        );
      case "Recommendations":
        return (
          <RecommendationRegenerateForm
            data={data}
            recommendationIndex={recommendationIndex}
            close={handleCloseModal}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="button-container">
      <Button
        type="primary"
        size="small"
        icon={<OpenAIOutlined />}
        onClick={handleClickButton1}
      >
        Re-generate
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

export default RegenerateBtn;
