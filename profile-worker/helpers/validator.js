exports.validateResponse = (inputString) => {
  const requiredProperties = [
    "specialization",
    "yearsExperience",
    "domainExperience",
    "keyStrengths",
    "uniqueness",
    "summary",
    "bases",
    "languages",
    "technicalSkills",
    "experiences",
    "educations",
    "additionalProjects",
    "volunteering",
    "awardsCertificates",
    "recommendations",
    "courses",
  ];

  const missingProperties = requiredProperties.filter(
    (prop) => !inputString.includes(prop)
  );

  if (missingProperties.length === 0) {
    console.log("Validation successful. All required properties are present.");
    return true;
  } else {
    console.error("Validation failed. Missing properties:", missingProperties);
    return false;
  }
};
