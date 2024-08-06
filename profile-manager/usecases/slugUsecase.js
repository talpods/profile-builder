import slugService from "../services/slugService.js";
import createSlug from "../helpers/createSlug.js";

class slugUsecase {
 async slugHandler(firstName, lastName) {
     const data = await slugService.getProfilesBySlug(firstName, lastName);
     if(data.length === 0) {
         return createSlug(firstName, lastName);
     }
     let slugs = data.map(item => item.slug); 
      slugs = slugs.sort(); 
       let lastSlug = slugs[slugs.length - 1];
       const number = lastSlug.replace(/^[^-]*-./, "");
       if(!number) {
           return `${lastSlug}1`;
       } else {
           const match = lastSlug.match(/\d/);
           lastSlug = lastSlug.substring(0, match.index);
           return `${lastSlug}${parseInt(number) + 1}`;
       }
 }
}

export default new slugUsecase();
