import slugUsecase from "../usecases/slugUsecase.js";

class slugController {

    static async getProfilesBySlug(req, res) {
        const { firstName, lastName } = req.params;
        try {
            const profiles = await slugUsecase.slugHandler(firstName, lastName);
            res.status(200).json(profiles);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
}

export default slugController;