import axios from "axios";

export const fetchProducts = async () => {
    try {
        const response = await axios.get("https://dummyjson.com/products");
        return response.data.products;
    } catch (error) {
        throw new Error("Failed to fetch products");
    }
};


const tableApi = {
    fetchProducts
}

export default tableApi;