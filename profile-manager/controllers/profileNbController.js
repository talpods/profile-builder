import profileNbUseCase from "../usecases/profileNbUseCase.js";
class profileNbController {

    static async getProfileNumber(req, res) {
        try {
            const profiles = await profileNbUseCase.createProfileNumber();
            res.status(200).json(profiles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

export default profileNbController;