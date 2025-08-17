import fs from "fs";
import path from "path";

const cartFile = path.join(process.cwd(), "cart.json");

export const getCart = () => {
    if (fs.existsSync(cartFile)) {
        return JSON.parse(fs.readFileSync(cartFile, "utf8"));
    }
    return [];
};

export const saveCart = (cart) => {
    fs.writeFileSync(cartFile, JSON.stringify(cart, null, 2));
};

export const getUserCart = (userId) => {
    const cart = getCart();
    return cart.find((u) => u.userId === userId);
};

export const createUserCart = (userId) => {
    const cart = getCart();
    const userCart = { userId, items: [] };
    cart.push(userCart);
    saveCart(cart);
    return userCart;
};

export const addToCart = (userId, type, price) => {
    const cart = getCart();
    let userCart = getUserCart(userId);

    if (!userCart) {
        userCart = createUserCart(userId);
        const updatedCart = getCart();
        userCart = getUserCart(userId);
    }

    userCart.items.push({ type, price });
    saveCart(cart);
};

export const clearCart = (userId) => {
    const cart = getCart();
    const userCart = getUserCart(userId);
    if (userCart) {
        userCart.items.splice(0);
        saveCart(cart);
    }
};
