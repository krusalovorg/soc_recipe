import axios from "axios";
import { server_ip } from "./config";

export const getRecipies = async (from_number = 0, to_number = 10) => {
    try {
        const response = await axios.get(server_ip + `/get_recipes?f=${from_number}&t=${to_number}`, {});
        return response.data.recipe
    } catch (error) {
        console.log(error);
        return []
    }
};

export const getRecipe = async (id) => {
    try {
        const response = await axios.get(server_ip + `/get_recipe?f=${from_number}&t=${to_number}`, {});
        return response.data.recipe
    } catch (error) {
        console.log(error);
        return []
    }
};