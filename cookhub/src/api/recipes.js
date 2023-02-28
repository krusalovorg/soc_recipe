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
        const response = await axios.get(server_ip + `/get_recipe?id=${id}`, {});
        return response.data.recipe
    } catch (error) {
        console.log(error);
        return null
    }
};

export const likeRecipe = async (id, sshkey) => {
    try {
        const response = await axios.post(server_ip + `/add_like`, {sshkey, recipe_id: id});
        return response.data.status
    } catch (error) {
        console.log(error);
        return null
    }
};


export const addComment = async (id, sshkey, text) => {
    try {
        const response = await axios.post(server_ip + `/add_comment`, {sshkey, recipe_id: id, text});
        return response.data.status
    } catch (error) {
        console.log(error);
        return null
    }
};


export const searchRecipe = async (search_text, filters=[]) => {
    try {
        const response = await axios.post(server_ip + `/search`, {search_text, filters});
        return response.data.recipes
    } catch (error) {
        console.log(error);
        return null
    }
};