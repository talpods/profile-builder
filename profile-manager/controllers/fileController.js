import ProfileService from "../services/profile.service.js";

class fileController {

    static async deleteFile(req, res){

        try{
            const slug = req.query.slug;
            const fileType = req.query.fileType;
            const fileName = req.query.fileName;
            const result = await ProfileService.deleteFile(slug, fileType, fileName);
            res.send("File deleted successfully");
        }catch(error){
            res.status(500).json({ error: error.message });
        }

    }
}

export default fileController;