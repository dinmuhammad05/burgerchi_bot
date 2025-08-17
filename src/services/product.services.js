import model from "../models/product.model.js";
import imageUtils from "../utils/Image.utils.js";

class ProductServices {
    async create(nomi, narxi, image_url) {
        try {
            console.log(nomi, narxi, image_url);

            await model.create({ nomi, narxi, image_url });

            return `yaratildi`;
        } catch (error) {
            await imageUtils.delete(image_url);
            console.error(`error in create product`, error.message);
        }
    }

    async getAll() {
        try {
            const products = await model.findAll({
                order: [["createdAt", "DESC"]],
            });
            return products;
        } catch (error) {
            console.error(`error in getAll product`, error.message);
        }
    }

    async getByName(nomi) {
        try {
            const product = await model.findOne({
                where: { nomi: nomi },
            });

            if (!product) {
                return `❌ "${nomi}" nomli mahsulot topilmadi`;
            }

            return product;
        } catch (error) {
            console.error(`❌ error in getByName product`, error.message);
            return "❌ Server xatosi yuz berdi";
        }
    }

    async updateproduct(id, product) {
        try {
            const updated = await module.update(product, {
                where: { id },
                returning: true,
            });

            if (!updated) return `${id}-dagi mahsulot totpilmadi`;
            return `o'zgartirildi: ${JSON.stringify(updated, null, 2)}`;
        } catch (error) {
            console.error(`error in updateProduct() product`, error.message);
        }
    }

    async deleteProduct(nomi) {
        try {
            const product = await this.getByName(nomi);

            if (!product) return `${nomi}-nomli mahsulot totpilmadi`;

            await imageUtils.delete(product.image_url);

            const deleted = await model.destroy({ where: { nomi: nomi } });

            if (!deleted) return `${nomi}-nomli mahsulot totpilmadi`;

            return `${nomi}-nomili mahsulot o'chirildi`;
        } catch (error) {
            console.error(`error in deleteProduct() product`, error.message);
        }
    }
}

export default new ProductServices();
