const { validateResponse } = require('../../helpers/validator');

describe('validateResponse', () => {
    it('should return true for valid input with all required properties', () => {
        const inputString = `
            specialization
            yearsExperience
            domainExperience
            keyStrengths
            uniqueness
            summary
            bases
            languages
            technicalSkills
            experiences
            educations
            additionalProjects
            volunteering
            awardsCertificates
            recommendations
            courses
        `;

        const isValid = validateResponse(inputString.trim()); // trim to remove leading/trailing whitespace

        expect(isValid).toBe(true);
    });

    it('should return false for input missing some required properties', () => {
        const inputString = `
            specialization
            yearsExperience
            domainExperience
            keyStrengths
            uniqueness
            summary
            bases
            languages
            technicalSkills
            experiences
            educations
            additionalProjects
            volunteering
            awardsCertificates
            recommendations
        `;

        const isValid = validateResponse(inputString.trim()); // trim to remove leading/trailing whitespace

        expect(isValid).toBe(false);
    });

    it('should return false for empty input', () => {
        const inputString = '';

        const isValid = validateResponse(inputString.trim()); // trim to remove leading/trailing whitespace

        expect(isValid).toBe(false);
    });

    it('should return true for input with all required properties plus extra content', () => {
        const inputString = `
            specialization
            yearsExperience
            domainExperience
            keyStrengths
            uniqueness
            summary
            bases
            languages
            technicalSkills
            experiences
            educations
            additionalProjects
            volunteering
            awardsCertificates
            recommendations
            courses
            additionalContent
        `;

        const isValid = validateResponse(inputString.trim()); // trim to remove leading/trailing whitespace

        expect(isValid).toBe(true);
    });

    it('should return true for comma-separated input with all required properties', () => {
        const inputString =
        `specialization,
        yearsExperience,
        domainExperience,
        keyStrengths,
        uniqueness,
        summary,
        bases,
        languages,
        technicalSkills,
        experiences,
        educations,
        additionalProjects,
        volunteering,
        awardsCertificates,
        recommendations,
        courses,`;

        const isValid = validateResponse(inputString);

        expect(isValid).toBe(true);
    });
});
