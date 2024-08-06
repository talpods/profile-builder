import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, Input, Button, Space, Col, message, Row, Select } from "antd";
import { PlusOutlined, MinusCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { UPDATE_PROFILE_DATA_API } from "../../api";
import { fetchProfile } from "../../State/profile/profileSlice";
import "./Forms.css";

const { Option } = Select;
const EditApiCall = async (slug, newData) => {
  const result = await axios.put(`${UPDATE_PROFILE_DATA_API}${slug}`, newData);
  return result;
};
export const LevelSeniorityForm = ({ data, close }) => {
  const { slug } = data;
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const levelData = {
      path: "level",
      updatedData: values.level,
    };

    const seniorityData = {
      path: "seniority",
      updatedData: values.seniority,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, levelData);
      await EditApiCall(slug, seniorityData);
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
      <h2 className="title">Level/Seniority</h2>
      <Form
        name="Edit Level/Seniority"
        onFinish={onFinish}
        initialValues={{ level: data.level, seniority: data.seniority }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item name="level" label="Level">
          <Input />
        </Form.Item>
        <Form.Item name="seniority" label="Seniority">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const SummaryForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const summaryData = {
      path: "summary",
      updatedData: values.summary,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, summaryData);
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
        name="Edit Summary"
        onFinish={onFinish}
        initialValues={{ summary: data.summary }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item name="summary" label="Summary">
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const LocationForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const locationData = {
      path: "bases",
      updatedData: values,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, locationData);

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
      <h2 className="title">Location</h2>
      <Form
        name="location_form"
        onFinish={onFinish}
        initialValues={{
          cityState: data.bases.cityState,
          country: data.bases.country,
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item name="cityState" label="City/State">
          <Input />
        </Form.Item>
        <Form.Item name="country" label="Country">
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export const StatusForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { slug } = data;
    console.log(values.status);
    const statusData = {
      path: "status",
      updatedData: values.status,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, statusData);
      dispatch(fetchProfile(slug));
      setLoading(false);
      close();
    } catch (error) {
      message.error(error.response?.data?.error || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="title">Update Status</h2>
      <Form
        name="status_form"
        onFinish={onFinish}
        initialValues={{
          status: data.status,
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          name="status"
          label="Profile Status"
          rules={[{ required: true, message: "Please select status" }]}
        >
          <Select placeholder="Select status" allowClear>
            <Option value="draft">Draft</Option>
            <Option value="completed">Completed</Option>
            <Option value="in-tech-review">In tech review</Option>
            <Option value="in-business-review">Inusiness Review</Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Status"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const LanguagesForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const languagesData = {
      path: "languages",
      updatedData: values.languages,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, languagesData);
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
      <h2 className="title">Languages</h2>
      <Form
        name="languages"
        onFinish={onFinish}
        initialValues={{ languages: data.languages }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item label="">
          <Form.List name="languages">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Row>
                    <Space
                      key={field.key}
                      align="baseline"
                      style={{ marginLeft: "10px" }}
                    >
                      <Form.Item
                        {...field}
                        name={[field.name, "name"]}
                        fieldKey={[field.fieldKey, "name"]}
                      >
                        <Input placeholder="Language" />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "proficiencyLevel"]}
                        fieldKey={[field.fieldKey, "proficiencyLevel"]}
                      >
                        <Input placeholder="Proficiency" />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(field.name)} />
                    </Space>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                    style={{ width: "200px" }}
                  >
                    Add language
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
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const TechnicalSkillsForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const technicalSkillsData = {
      path: "technicalSkills",
      updatedData: values.technicalSkills,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, technicalSkillsData);
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
      <h2 className="title">Technical Skills</h2>
      <Form
        name="technical_skills_form"
        onFinish={onFinish}
        initialValues={{ technicalSkills: data.technicalSkills }}
        layout="vertical"
      >
        <Form.Item>
          <Form.List name="technicalSkills">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <div key={field.key} style={{ marginBottom: 20 }}>
                    <label
                      style={{
                        marginBottom: "20px",
                        fontWeight: "bold",
                        display: "block",
                      }}
                    >{`Section Name ${index + 1}`}</label>
                    <Form.Item
                      {...field}
                      name={[field.name, "sectionName"]}
                      fieldKey={[field.fieldKey, "sectionName"]}
                    >
                      <Input placeholder="Section Name" />
                    </Form.Item>
                    <Form.List name={[field.name, "skills"]}>
                      {(
                        skillFields,
                        { add: addSkill, remove: removeSkill }
                      ) => (
                        <>
                          {skillFields.map((skillField) => (
                            <Row>
                              <Space key={skillField.key} align="baseline">
                                <Form.Item
                                  {...skillField}
                                  name={[skillField.name]}
                                  fieldKey={[skillField.fieldKey]}
                                >
                                  <Input placeholder="Skill" />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => removeSkill(skillField.name)}
                                />
                              </Space>
                            </Row>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addSkill()}
                              block
                              icon={<PlusOutlined />}
                              style={{ width: "200px" }}
                            >
                              Add Skill
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                    <Button
                      type="dashed"
                      danger
                      onClick={() => remove(field.name)}
                      block
                      icon={<MinusCircleOutlined />}
                    >
                      Remove Section
                    </Button>
                    <div className="w-100 h-px bg-Gray my-8"></div>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Section
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
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const EducationForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const educationData = {
      path: "educations",
      updatedData: values.educations,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, educationData);
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
      <h2 className="title">Education</h2>
      <Form
        name="education_form"
        onFinish={onFinish}
        initialValues={{ educations: data.educations }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item>
          <Form.List name="educations">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ marginBottom: 20 }}>
                    <Form.Item
                      {...field}
                      name={[field.name, "institutionName"]}
                      fieldKey={[field.fieldKey, "institutionName"]}
                      label="Institution Name"
                    >
                      <Input placeholder="Institution Name" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "major"]}
                      fieldKey={[field.fieldKey, "major"]}
                      label="Major"
                    >
                      <Input placeholder="Major" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "level"]}
                      fieldKey={[field.fieldKey, "level"]}
                      label="Level"
                    >
                      <Input placeholder="Level" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "scoreGPA"]}
                      fieldKey={[field.fieldKey, "scoreGPA"]}
                      label="GPA"
                    >
                      <Input placeholder="GPA" />
                    </Form.Item>
                    <Form.Item label="Location">
                      <Space direction="horizontal">
                        <Form.Item
                          {...field}
                          name={[field.name, "location", "cityState"]}
                          fieldKey={[field.fieldKey, "location", "cityState"]}
                        >
                          <Input placeholder="City/State" />
                        </Form.Item>
                        <Form.Item
                          {...field}
                          name={[field.name, "location", "country"]}
                          fieldKey={[field.fieldKey, "location", "country"]}
                        >
                          <Input placeholder="Country" />
                        </Form.Item>
                      </Space>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "startDate"]}
                      fieldKey={[field.fieldKey, "startDate"]}
                      label="Start Date"
                    >
                      <Input placeholder="Start Date" />
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, "endDate"]}
                      fieldKey={[field.fieldKey, "endDate"]}
                      label="End Date"
                    >
                      <Input placeholder="End Date" />
                    </Form.Item>
                    <Button
                      type="dashed"
                      danger
                      onClick={() => remove(field.name)}
                      block
                      icon={<MinusCircleOutlined />}
                    >
                      Remove Education
                    </Button>
                    <div style={{ textAlign: "center" }}>
                      <p>
                        -----------------------------------------------------------
                      </p>
                    </div>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Education
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
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const CoursesForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    console.log(values);
    const coursesData = {
      path: "courses",
      updatedData: values.courses,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, coursesData);
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
      <h2 className="title">Courses</h2>
      <Form
        name="courses_form"
        onFinish={onFinish}
        initialValues={{ courses: data.courses }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item>
          <Form.List name="courses">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ marginBottom: 20 }}>
                    <Form.Item
                      {...field}
                      name={[field.name, "courseProvider"]}
                      fieldKey={[field.fieldKey, "courseProvider"]}
                      label="Course Provider"
                    >
                      <Input placeholder="Course Provider" />
                    </Form.Item>
                    <Form.Item label="Courses Names">
                      <Form.List name={[field.name, "coursesNames"]}>
                        {(
                          courseFields,
                          { add: addCourse, remove: removeCourse }
                        ) => (
                          <>
                            {courseFields.map((courseField) => (
                              <Space
                                key={courseField.key}
                                style={{ display: "flex" }}
                                align="baseline"
                              >
                                <Form.Item
                                  {...courseField}
                                  name={[courseField.name]}
                                  fieldKey={[courseField.fieldKey]}
                                >
                                  <Input placeholder="Course Name" />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() => removeCourse(courseField.name)}
                                />
                              </Space>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => addCourse()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add Course Name
                              </Button>
                            </Form.Item>
                          </>
                        )}
                      </Form.List>
                    </Form.Item>
                    <Button
                      type="dashed"
                      danger
                      onClick={() => remove(field.name)}
                      block
                      icon={<MinusCircleOutlined />}
                    >
                      Remove Course Provider
                    </Button>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Course Provider
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
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const AwardsForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const awardsData = {
      path: "awardsCertificates",
      updatedData: values.awards,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, awardsData);
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
      <h2 className="title">Awards and certificates</h2>
      <Form
        name="Edit awards"
        onFinish={onFinish}
        initialValues={{ awards: data.awardsCertificates }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item>
          <Form.List name="awards">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field) => (
                  <div key={field.key} style={{ marginBottom: 20 }}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "eventCourseTitle"]}
                        fieldKey={[field.fieldKey, "eventCourseTitle"]}
                        label="Course Title"
                        labelCol={{ span: 8 }} // Adjust label column span
                        wrapperCol={{ span: 16 }} // Adjust wrapper column span
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "gradeScore"]}
                        fieldKey={[field.fieldKey, "gradeScore"]}
                        label="Score"
                        labelCol={{ span: 8 }} // Adjust label column span
                        wrapperCol={{ span: 16 }} // Adjust wrapper column span
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...field}
                        name={[field.name, "courseDate"]}
                        fieldKey={[field.fieldKey, "courseDate"]}
                        label="Date"
                        labelCol={{ span: 8 }} // Adjust label column span
                        wrapperCol={{ span: 16 }} // Adjust wrapper column span
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        fieldKey={[field.fieldKey, "description"]}
                        label="Description"
                        labelCol={{ span: 8 }} // Adjust label column span
                        wrapperCol={{ span: 16 }} // Adjust wrapper column span
                      >
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Col>

                    <Button
                      type="dashed"
                      danger
                      onClick={() => remove(field.name)}
                      block
                      icon={<MinusCircleOutlined />}
                    >
                      Remove Award
                    </Button>
                  </div>
                ))}
                <Form.Item wrapperCol={{ span: 24 }}>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Award
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const ProjectsForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const projectsData = {
      path: "additionalProjects",
      updatedData: values.additionalProjects,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, projectsData);
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
      <h2 className="title">Projects</h2>
      <Form
        name="Edit projects"
        onFinish={onFinish}
        initialValues={{ additionalProjects: data.additionalProjects }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.List name="additionalProjects">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key} style={{ marginBottom: 20 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "projectName"]}
                        fieldKey={[field.fieldKey, "projectName"]}
                        label="Project name"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "link"]}
                        fieldKey={[field.fieldKey, "link"]}
                        label="Link"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "courseDate"]}
                        fieldKey={[field.fieldKey, "courseDate"]}
                        label="Date"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        fieldKey={[field.fieldKey, "description"]}
                        label="Description"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        label="Responsibilities"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Form.List name={[field.name, "responsibilities"]}>
                          {(
                            responsibilityFields,
                            {
                              add: addResponsibility,
                              remove: removeResponsibility,
                            }
                          ) => (
                            <>
                              {responsibilityFields.map(
                                (responsibilityField) => (
                                  <Space
                                    key={responsibilityField.key}
                                    style={{ display: "flex", marginBottom: 8 }}
                                    align="baseline"
                                  >
                                    <Form.Item
                                      {...responsibilityField}
                                      name={[responsibilityField.name]}
                                      fieldKey={[responsibilityField.fieldKey]}
                                    >
                                      <Input placeholder="Responsibility" />
                                    </Form.Item>
                                    <MinusCircleOutlined
                                      onClick={() =>
                                        removeResponsibility(
                                          responsibilityField.name
                                        )
                                      }
                                    />
                                  </Space>
                                )
                              )}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => addResponsibility()}
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
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Technologies"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Form.List name={[field.name, "technologies"]}>
                          {(
                            technologyFields,
                            { add: addTechnology, remove: removeTechnology }
                          ) => (
                            <>
                              {technologyFields.map((technologyField) => (
                                <Space
                                  key={technologyField.key}
                                  style={{ display: "flex", marginBottom: 8 }}
                                  align="baseline"
                                >
                                  <Form.Item
                                    {...technologyField}
                                    name={[technologyField.name]}
                                    fieldKey={[technologyField.fieldKey]}
                                  >
                                    <Input placeholder="Technology" />
                                  </Form.Item>
                                  <MinusCircleOutlined
                                    onClick={() =>
                                      removeTechnology(technologyField.name)
                                    }
                                  />
                                </Space>
                              ))}
                              <Form.Item>
                                <Button
                                  type="dashed"
                                  onClick={() => addTechnology()}
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
                    </Col>
                  </Col>

                  <Button
                    type="dashed"
                    danger
                    onClick={() => remove(field.name)}
                    block
                    icon={<MinusCircleOutlined />}
                  >
                    Remove project
                  </Button>
                </div>
              ))}
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add project
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const ExperienceForm = ({ data, experienceIndex, close }) => {
  const index = experienceIndex;
  const experienceData = data.experiences[index];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const experienceData = {
      path: `experiences.${index}`,
      updatedData: {
        ...values,
        location: {
          cityState: values.location.cityState,
          country: values.location.country,
        },
      },
    };
    try {
      setLoading(true);
      await EditApiCall(slug, experienceData);
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
      <h2 className="title">Experience</h2>
      <Form
        name="experience"
        onFinish={onFinish}
        initialValues={{
          ...experienceData,
          location: {
            cityState: experienceData.location?.cityState || "",
            country: experienceData.location?.country || "",
          },
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item label="Company Name" name="companyName">
          <Input />
        </Form.Item>

        <Form.Item label="Location">
          <Input.Group>
            <Form.Item name={["location", "cityState"]} noStyle>
              <Input placeholder="City, State" style={{ width: "50%" }} />
            </Form.Item>
            <Form.Item name={["location", "country"]} noStyle>
              <Input placeholder="Country" style={{ width: "50%" }} />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item label="" labelCol={{ span: 3 }}>
          <label
            style={{
              marginBottom: "10px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            Responsibilities
          </label>
          <Form.List
            name={["responsibilitiesAndAccomplishments"]}
            style={{ width: "100%" }}
          >
            {(
              responsibilityFields,
              { add: addResponsibility, remove: removeResponsibility }
            ) => (
              <>
                {responsibilityFields.map((responsibilityField) => (
                  <div
                    key={responsibilityField.key}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "20px",
                    }}
                  >
                    <Form.Item
                      {...responsibilityField}
                      name={[responsibilityField.name]}
                      fieldKey={[responsibilityField.fieldKey]}
                      style={{
                        width: "90%",
                        display: "block",
                        marginBottom: "0px",
                      }}
                    >
                      <Input placeholder="Responsibility" />
                    </Form.Item>

                    <MinusCircleOutlined
                      onClick={() =>
                        removeResponsibility(responsibilityField.name)
                      }
                      style={{ width: "10%", display: "block" }}
                    />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => addResponsibility()}
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
        <Form.Item label="" labelCol={{ span: 3 }}>
          <label
            style={{
              marginBottom: "10px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            Positions
          </label>
          <Form.List name="positions">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Space
                      align="baseline"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "title"]}
                        fieldKey={[fieldKey, "title"]}
                        label="Title"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "employmentType"]}
                        fieldKey={[fieldKey, "employmentType"]}
                        label="Employment type"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "startDate"]}
                        fieldKey={[fieldKey, "startDate"]}
                        label="Start date"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "endDate"]}
                        fieldKey={[fieldKey, "endDate"]}
                        label="End date"
                      >
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Position
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label="" labelCol={{ span: 3 }}>
          <label
            style={{
              marginBottom: "10px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            Projects
          </label>
          <Form.List name="projects">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Space
                      align="baseline"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name, "projectName"]}
                        fieldKey={[fieldKey, "projectName"]}
                        label="Project Name"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "description"]}
                        fieldKey={[fieldKey, "description"]}
                        label="Description"
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "link"]}
                        fieldKey={[fieldKey, "link"]}
                        label="Link"
                      >
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>

                    <Form.List name={[name, "responsibilities"]}>
                      {(
                        responsibilityFields,
                        { add: addResponsibility, remove: removeResponsibility }
                      ) => (
                        <>
                          <label
                            style={{
                              marginBottom: "10px",
                              fontWeight: "bold",
                              display: "block",
                            }}
                          >
                            Project responsibilities
                          </label>
                          <Form.Item
                            label=""
                            style={{ marginTop: "0px", marginBottom: "0px" }}
                          >
                            {responsibilityFields.map((responsibilityField) => (
                              <div
                                key={responsibilityField.key}
                                align="baseline"
                                style={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  marginBottom: "20px",
                                  gap: "20px",
                                }}
                              >
                                <Form.Item
                                  {...responsibilityField}
                                  name={[responsibilityField.name]}
                                  fieldKey={[responsibilityField.fieldKey]}
                                  style={{ width: "90%", marginBottom: "0px" }}
                                >
                                  <Input />
                                </Form.Item>
                                <MinusCircleOutlined
                                  onClick={() =>
                                    removeResponsibility(
                                      responsibilityField.name
                                    )
                                  }
                                  style={{ width: "10%" }}
                                />
                              </div>
                            ))}
                            <Form.Item>
                              <Button
                                type="dashed"
                                onClick={() => addResponsibility()}
                                block
                                icon={<PlusOutlined />}
                              >
                                Add responsibility
                              </Button>
                            </Form.Item>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Project
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
        <Form.Item label="">
          <label
            style={{
              marginBottom: "10px",
              fontWeight: "bold",
              display: "block",
            }}
          >
            Tools and technologies
          </label>
          <Form.List name="toolsAndTechnologies">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <div key={key}>
                    <Space
                      key={key}
                      align="baseline"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "20px",
                        alignItems: "center",
                      }}
                    >
                      <Form.Item
                        {...restField}
                        name={[name]}
                        fieldKey={[fieldKey]}
                      >
                        <Input />
                      </Form.Item>
                      <MinusCircleOutlined onClick={() => remove(name)} />
                    </Space>
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Tool/Technology
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>

        <Form.Item label="Summary" name="summary">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const VolunteeringForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const volunteeringData = {
      path: "volunteering",
      updatedData: values.volunteering,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, volunteeringData);
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
      <h2 className="title">Volunteering activities</h2>
      <Form
        name="Edit Volunteering"
        onFinish={onFinish}
        initialValues={{ volunteering: data.volunteering }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.List name="volunteering">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key} style={{ marginBottom: 20 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "nameOfVolunteeringActivity"]}
                        fieldKey={[
                          field.fieldKey,
                          "nameOfVolunteeringActivity",
                        ]}
                        label="Activity name"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "type"]}
                        fieldKey={[field.fieldKey, "type"]}
                        label="Activity type"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "startDate"]}
                        fieldKey={[field.fieldKey, "startDate"]}
                        label="Start date"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "endDate"]}
                        fieldKey={[field.fieldKey, "endDate"]}
                        label="End date"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "location", "country"]}
                        fieldKey={[field.fieldKey, "location", "country"]}
                        label="Country"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "location", "cityState"]}
                        fieldKey={[field.fieldKey, "location", "cityState"]}
                        label="City state"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "description"]}
                        fieldKey={[field.fieldKey, "description"]}
                        label="Description"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Col>

                  <Button
                    type="dashed"
                    danger
                    onClick={() => remove(field.name)}
                    block
                    icon={<MinusCircleOutlined />}
                  >
                    Remove volunteering actiivty
                  </Button>
                </div>
              ))}
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add volunteering activity
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export const RecommendationsForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const onFinish = async (values) => {
    const { slug } = data;
    const recommendationsData = {
      path: "recommendations",
      updatedData: values.recommendations,
    };
    try {
      setLoading(true);
      await EditApiCall(slug, recommendationsData);
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
      <h2 className="title">Recommendations</h2>
      <Form
        name="Edit recommendations"
        onFinish={onFinish}
        initialValues={{ recommendations: data.recommendations }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.List name="recommendations">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <div key={field.key} style={{ marginBottom: 20 }}>
                  <Col span={24}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "recommenderName"]}
                        fieldKey={[field.fieldKey, "recommenderName"]}
                        label="Recommender name"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "recommenderRelation"]}
                        fieldKey={[field.fieldKey, "recommenderRelation"]}
                        label="Recommender relation"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "recommendationDate"]}
                        fieldKey={[field.fieldKey, "recommendationDate"]}
                        label="Recommendation date"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "recommendationText"]}
                        fieldKey={[field.fieldKey, "recommendationText"]}
                        label="Recommendation"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Col>
                  </Col>

                  <Button
                    type="dashed"
                    danger
                    onClick={() => remove(field.name)}
                    block
                    icon={<MinusCircleOutlined />}
                  >
                    Remove recommendation
                  </Button>
                </div>
              ))}
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add recommendation
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export const ExperiencesForm = ({ data, close }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    const { slug } = data;
    const experiencesData = {
      path: "experiences",
      updatedData: values.experiences,
    };
    try {
      console.log(experiencesData);
      setLoading(true);
      await EditApiCall(slug, experiencesData);
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
      <h2 className="title">Experiences</h2>
      <Form
        name="Edit experiences"
        onFinish={onFinish}
        initialValues={{
          experiences: data.experiences.map((exp) => ({
            ...exp,
            location: {
              cityState: exp.location?.cityState || "",
              country: exp.location?.country || "",
            },
          })),
        }}
        autoComplete="off"
        layout="vertical"
      >
        <Form.List name="experiences">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <div key={field.key} style={{ marginBottom: 20 }}>
                  <h3 style={{ marginBottom: 10, fontSize: 20 }}>
                    Experience {index + 1}
                  </h3>
                  <div className="w-100 h-px bg-Gray my-8"></div>
                  <Col span={24}>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "candidatesUniqueAchievement"]}
                        fieldKey={[
                          field.fieldKey,
                          "candidatesUniqueAchievement",
                        ]}
                        label="Unique Achievement"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "companyName"]}
                        fieldKey={[field.fieldKey, "companyName"]}
                        label="Company Name"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "companyDomain"]}
                        fieldKey={[field.fieldKey, "companyDomain"]}
                        label="Company Domain"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "companyIndustry"]}
                        fieldKey={[field.fieldKey, "companyIndustry"]}
                        label="Company Industry"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "companyBusinessActivity"]}
                        fieldKey={[field.fieldKey, "companyBusinessActivity"]}
                        label="Business Activity"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>

                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "location", "cityState"]}
                        fieldKey={[field.fieldKey, "location", "cityState"]}
                        label="City/State"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "location", "country"]}
                        fieldKey={[field.fieldKey, "location", "country"]}
                        label="Country"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        {...field}
                        name={[field.name, "summary"]}
                        fieldKey={[field.fieldKey, "summary"]}
                        label="Summary"
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                      >
                        <Input.TextArea rows={4} />
                      </Form.Item>
                    </Col>

                    <Form.List name={[field.name, "positions"]}>
                      {(
                        positionFields,
                        { add: addPosition, remove: removePosition }
                      ) => (
                        <>
                          {positionFields.map((positionField) => (
                            <div
                              key={positionField.key}
                              style={{ marginBottom: 20 }}
                            >
                              <Col span={24}>
                                <Col span={12}>
                                  <Form.Item
                                    {...positionField}
                                    name={[positionField.name, "title"]}
                                    fieldKey={[positionField.fieldKey, "title"]}
                                    label="Title"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    {...positionField}
                                    name={[
                                      positionField.name,
                                      "employmentType",
                                    ]}
                                    fieldKey={[
                                      positionField.fieldKey,
                                      "employmentType",
                                    ]}
                                    label="Employment Type"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    {...positionField}
                                    name={[positionField.name, "startDate"]}
                                    fieldKey={[
                                      positionField.fieldKey,
                                      "startDate",
                                    ]}
                                    label="Start Date"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={12}>
                                  <Form.Item
                                    {...positionField}
                                    name={[positionField.name, "endDate"]}
                                    fieldKey={[
                                      positionField.fieldKey,
                                      "endDate",
                                    ]}
                                    label="End Date"
                                    labelCol={{ span: 8 }}
                                    wrapperCol={{ span: 16 }}
                                  >
                                    <Input />
                                  </Form.Item>
                                </Col>
                                <Col span={24}>
                                  <Button
                                    type="dashed"
                                    danger
                                    onClick={() =>
                                      removePosition(positionField.name)
                                    }
                                    block
                                    icon={<MinusCircleOutlined />}
                                  >
                                    Remove Position
                                  </Button>
                                </Col>
                              </Col>
                            </div>
                          ))}
                          <Form.Item wrapperCol={{ span: 24 }}>
                            <Button
                              type="dashed"
                              onClick={() => addPosition()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Position
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Form.List
                      name={[field.name, "responsibilitiesAndAccomplishments"]}
                    >
                      {(
                        responsibilityFields,
                        { add: addResponsibility, remove: removeResponsibility }
                      ) => (
                        <>
                          {responsibilityFields.map((responsibilityField) => (
                            <Space
                              key={responsibilityField.key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...responsibilityField}
                                name={[responsibilityField.name]}
                                fieldKey={[responsibilityField.fieldKey]}
                              >
                                <Input placeholder="Responsibility" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() =>
                                  removeResponsibility(responsibilityField.name)
                                }
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addResponsibility()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Responsibility
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Form.List name={[field.name, "toolsAndTechnologies"]}>
                      {(
                        technologyFields,
                        { add: addTechnology, remove: removeTechnology }
                      ) => (
                        <>
                          {technologyFields.map((technologyField) => (
                            <Space
                              key={technologyField.key}
                              style={{ display: "flex", marginBottom: 8 }}
                              align="baseline"
                            >
                              <Form.Item
                                {...technologyField}
                                name={[technologyField.name]}
                                fieldKey={[technologyField.fieldKey]}
                              >
                                <Input placeholder="Technology" />
                              </Form.Item>
                              <MinusCircleOutlined
                                onClick={() =>
                                  removeTechnology(technologyField.name)
                                }
                              />
                            </Space>
                          ))}
                          <Form.Item>
                            <Button
                              type="dashed"
                              onClick={() => addTechnology()}
                              block
                              icon={<PlusOutlined />}
                            >
                              Add Technology
                            </Button>
                          </Form.Item>
                        </>
                      )}
                    </Form.List>

                    <Button
                      type="dashed"
                      danger
                      onClick={() => remove(field.name)}
                      block
                      icon={<MinusCircleOutlined />}
                      style={{ marginBottom: "40px" }}
                    >
                      Remove Experience
                    </Button>
                  </Col>
                </div>
              ))}
              <Form.Item wrapperCol={{ span: 24 }}>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add Experience
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>

        <Form.Item wrapperCol={{ span: 24 }}>
          <Button
            type="primary"
            htmlType="submit"
            className="re-generate-button"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
