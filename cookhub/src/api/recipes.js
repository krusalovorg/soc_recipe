import axios from "axios";
import { server_ip } from "./config";

export const getRecipies = async (sshkey, from_number = 0, to_number = 10) => {
    try {
        const response = await axios.post(server_ip + `/get_recomendations?f=${from_number}&t=${to_number}`, {sshkey});
        return response.data.recipes
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

export const remRecipe = async (sshkey, id) => {
    try {
        const response = await axios.post(server_ip + `/rem_recipes`, {
            "id_": id,
            sshkey
        });
        return response.status
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


export const searchRecipe = async (search_text, filters=[], categories=[]) => {
    try {
        const response = await axios.post(server_ip + `/search`, {search_text, filters, categories, only_categories: false});
        return response.data
    } catch (error) {
        console.log(error);
        return null
    }
};

export const searchRecipeOnlyCategorys = async (search_text, categories) => {
    try {
        const response = await axios.post(server_ip + `/search`, {search_text, categories, only_categories: true});
        return response.data
    } catch (error) {
        console.log(error);
        return null
    }
};