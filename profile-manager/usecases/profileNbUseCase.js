import profileNbService from "../services/profileNbService.js";

class profileNbUsecase {
    async createProfileNumber() {
        const data = await profileNbService.getProfileNumber();
        if (data.length === 0) {
            return 1;
        }

        let number = data.map(item => parseInt(item.profileNumber)); 
        number = number.sort((a, b) => a - b); 

        let lastNumber = number[number.length - 1];
        return lastNumber + 1;
    }
}

export default new profileNbUsecase();
