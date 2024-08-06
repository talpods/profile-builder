import slugRepository from "../infrastructure/slugRepository.js";
class slugService {
     async getProfilesBySlug(firstName, lastName) {
        return await slugRepository.getProfilesBySlug(firstName, lastName);
    }

    
}

export default new slugService();