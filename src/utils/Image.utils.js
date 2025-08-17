import fs from "node:fs";
import { join } from "node:path";
import axios from "axios";

class ImageUtils {
    async save(ctx) {
        let fileName;
        try {
            const photoArray = ctx.message.photo;
            const fileId = photoArray[photoArray.length - 1].file_id; // eng sifatli rasm
            const fileUrl = await ctx.telegram.getFileLink(fileId);

            // Fayl nomini vaqt bilan beramiz
            fileName = `${Date.now()}.jpg`;
            const folderPath = join(process.cwd(), "uploads");
            const fullPath = join(folderPath, fileName);

            // Papkani yaratib qo‘yish (agar bo‘lmasa)
            if (!fs.existsSync(folderPath)) {
                fs.mkdirSync(folderPath, { recursive: true });
            }

            // Yuklab olish va saqlash
            const response = await axios.get(fileUrl.href, {
                responseType: "arraybuffer",
            });
            fs.writeFileSync(fullPath, response.data);

            return fileName; // to‘liq manzilni qaytarish
        } catch (error) {
            await this.delete(fileName);
            console.error(`error in saveImage utils`, error.message);
        }
    }

    async delete(fileName) {
        try {
            const filePath = join(process.cwd(), "/uploads", fileName);
            
            fs.unlinkSync(filePath, fileName);
            console.log(`image o'chirildi`);
        } catch (error) {
            console.log(`imageni o'chirishda xatolik`, error);
        }
    }
}

export default new ImageUtils();
