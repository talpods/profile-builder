import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, Space, message } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { fetchProfile } from "../../State/profile/profileSlice";
import { REGENERATE_PROFILE_API } from "../../api";
import "./Forms.css";
const RegenrateApiCall = async (slug, newData) => {
  const result = await axios.put(`${REGENERATE_PROFILE_API}${slug}`, newData);
  return result;
};

export const SummaryRegenerateForm = ({ data, close }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { slug } = data;

  useEffect(() => {
    form.setFieldsValue({
      yearsExperience: data.yearsExperience,
      seniority: data.seniority,
      domainExperience: data.domainExperience,
      keyStrengths: data.keyStrengths,
      unique: data.uniqueness,
    });
  }, [data, form]);

  const onFinish = async (values) => {
    const newData = {
      propertyName: "summary",
      generateType: "profileSummary",
      updatedData: values,
    };

    try {
      setLoading(true);
      await RegenrateApiCall(slug, newData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Profile summary</h2>
      <Form
        form={form}
        name="profileSummary"
        initialValues={{
          yearsExperience: data.yearsExperience,
          seniority: data.seniority,
          domainExperience: data.domainExperience,
          keyStrengths: data.keyStrengths,
          uniqueness: data.uniqueness,
          firstName: data.firstName,
          level: data.level,
        }}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item label="First name" name="firstName">
          <Input />
        </Form.Item>
        <Form.Item label="Level" name="level">
          <Input />
        </Form.Item>
        <Form.Item label="Years of experience" name="yearsExperience">
          <Input />
        </Form.Item>

        <Form.Item label="Seniority/ specialization:" name="seniority">
          <Input />
        </Form.Item>

        <Form.Item label="Domain experience expertise" name="domainExperience">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Key technical and non-technical strengths"
          name="keyStrengths"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="What is unique about him/her" name="uniqueness">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const SummaryRegenerateFormForJunior = ({ data, close }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { slug } = data;

  useEffect(() => {
    form.setFieldsValue({
      level: data.level,
      firstName: data.firstName,
      passion: "",
      evaluation: "",
    });
  }, [data, form]);

  const onFinish = async (values) => {
    const newValues = {
      level: values.level,
      firstName: values.firstName,
      passion: values.passion,
      evaluation: values.evaluation,
      eductions: data.eductions,
      volunteering: data.volunteering,
      additionalProject: data.additionalProjects,
    };
    const newData = {
      propertyName: "summary",
      generateType: "profileSummary",
      updatedData: newValues,
    };

    try {
      setLoading(true);
      await RegenrateApiCall(slug, newData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Profile summary</h2>
      <Form
        form={form}
        name="profileSummary"
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item label="First name" name="firstName">
          <Input disabled={true} />
        </Form.Item>
        <Form.Item label="Level" name="level">
          <Input disabled={true} />
        </Form.Item>

        <Form.Item
          label="Passions and interests"
          name="passion"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Evaluation"
          name="evaluation"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const ExperienceSummary = ({ data, experienceIndex, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const index = experienceIndex;
  const propertyName = "experiences." + index + ".summary";
  const experienceData = data.experiences[index];
  const { firstName, seniority, slug } = data;

  const onFinish = async (values) => {
    const newData = {
      propertyName: propertyName,
      generateType: "experienceSummary",
      updatedData: values,
    };
    try {
      setLoading(true);
      await RegenrateApiCall(slug, newData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      console.log(error);
      //message.error(error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Experience summary</h2>
      <Form
        name="experienceSummary"
        initialValues={experienceData}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item label="First name" name="firstName" initialValue={firstName}>
          <Input />
        </Form.Item>

        <Form.Item label="Job Title" name="seniority" initialValue={seniority}>
          <Input />
        </Form.Item>
        <Form.Item label="Company name" name="companyName">
          <Input />
        </Form.Item>
        <Form.Item label="Company industry" name="companyIndustry">
          <Input />
        </Form.Item>
        <Form.Item label="Company activity" name="companyBusinessActivity">
          <Input />
        </Form.Item>

        <Form.Item
          label="Candidate's unique achievement"
          name="candidatesUniqueAchievement"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Responsibilities and accomplishments"
          name="responsibilitiesAndAccomplishments"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Tools and technologies used"
          name="toolsAndTechnologies"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const ExperienceResponsibilities = ({
  data,
  experienceIndex,
  close,
}) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const index = experienceIndex;
  const propertyName =
    "experiences." + index + ".responsibilitiesAndAccomplishments";
  const experienceData = data.experiences[index];
  const { firstName, seniority, slug } = data;

  const onFinish = async (values) => {
    const newData = {
      propertyName: propertyName,
      generateType: "experienceResponsibilities",
      updatedData: values,
    };
    try {
      setLoading(true);
      await RegenrateApiCall(slug, newData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Experience responsibilities</h2>
      <Form
        name="experienceResponsibilities"
        initialValues={experienceData}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item label="First name" name="firstName" initialValue={firstName}>
          <Input />
        </Form.Item>

        <Form.Item label="Job Title" name="seniority" initialValue={seniority}>
          <Input />
        </Form.Item>
        <Form.Item label="Company name" name="companyName">
          <Input />
        </Form.Item>
        <Form.Item label="Company industry" name="companyIndustry">
          <Input />
        </Form.Item>
        <Form.Item label="Company activity" name="companyBusinessActivity">
          <Input />
        </Form.Item>

        <Form.Item
          label="Candidate's unique achievement"
          name="candidatesUniqueAchievement"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Responsibilities and accomplishments"
          name="responsibilitiesAndAccomplishments"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item
          label="Tools and technologies used"
          name="toolsAndTechnologies"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const CandidateTechnicalSkills = ({ data, close }) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { slug } = data;

  let initialSkills = [];
  const allSkills = () => {
    data.technicalSkills.forEach((section) => {
      section.skills.forEach((skill) => {
        initialSkills.push(skill);
      });
    });
  };

  const onFinish = async (values) => {
    const newData = {
      propertyName: "technicalSkills",
      generateType: "technicalSkills",
      updatedData: values,
    };

    try {
      setLoading(true);
      await RegenrateApiCall(slug, newData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response.data.error);
      setLoading(false);
    }
  };

  useEffect(() => {
    allSkills();
    form.setFieldsValue({
      skills: initialSkills,
    });
  }, [data, form]);

  return (
    <div className="container">
      <h2 className="title">Candidate Technical Skills</h2>
      <Form
        name="technicalSkillsForm"
        layout="vertical"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Technical skills" name="skills">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const AdditionalProjects = ({ data, projectIndex, close }) => {
  const { slug } = data;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const index = projectIndex;
  const propertyName = "additionalProjects." + index + ".description";
  const projectData = data.additionalProjects[index];
  const firstName = data.firstName;

  const onFinish = async (values) => {
    const newData = {
      propertyName: propertyName,
      generateType: "projectSummary",
      updatedData: values,
    };
    try {
      setLoading(true);
      await RegenrateApiCall(slug, newData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Additional Projects</h2>
      <Form
        name="projects_form"
        onFinish={onFinish}
        initialValues={projectData}
        layout="vertical"
      >
        <Form.Item name="projectName" label="Project Name">
          <Input placeholder="Project Name" />
        </Form.Item>
        <Form.Item name="firstName" label="First Name" initialValue={firstName}>
          <Input placeholder="First Name" />
        </Form.Item>
        <Form.Item name="description" label="Description">
          <Input.TextArea placeholder="Description" />
        </Form.Item>
        <Form.Item name="link" label="Link">
          <Input placeholder="Link" />
        </Form.Item>
        <Form.Item label="Responsibilities">
          <Form.List name="responsibilities">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex" }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name]}
                      fieldKey={[field.fieldKey]}
                    >
                      <Input placeholder="Responsibility" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Responsibility
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label="Technologies">
          <Form.List name="technologies">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <Space
                    key={field.key}
                    style={{ display: "flex" }}
                    align="baseline"
                  >
                    <Form.Item
                      {...field}
                      name={[field.name]}
                      fieldKey={[field.fieldKey]}
                    >
                      <Input placeholder="Technology" />
                    </Form.Item>
                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Technology
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const RecommendationRegenerateForm = ({
  data,
  recommendationIndex,
  close,
}) => {
  const { slug } = data;
  const index = recommendationIndex;
  const formData = data.recommendations[index].recommendationText;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log(values);
    const newData = {
      propertyName: "recommendations." + index + ".recommendationText",
      generateType: "recommendationRefinement",
      updatedData: values,
    };
    try {
      setLoading(true);
      await RegenrateApiCall(slug, newData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response.data.error);
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Profile summary</h2>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Recommendation Text"
          name="recommendationText"
          initialValue={formData}
        >
          <Input.TextArea name="recommendationText" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Regenerating..." : "Regenerate"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
