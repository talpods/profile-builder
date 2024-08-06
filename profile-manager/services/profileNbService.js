import profileNbRepositry from "../infrastructure/profileNbRepository.js";
class profileNbService {
     async getProfileNumber() {
        return await profileNbRepositry.getProfileNumber();
    }

    
}

export default new profileNbService();