import axios from "axios";
import { server_ip } from "./config";

export const getRecipies = async (sshkey) => {
    try {
        console.log(sshkey)
        // const response = await axios.post(await server_ip() + `/get_recomendations`, {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({ sshkey })
        // });
        // const data = await response.json();
        // return data.recipes;

        const response = await axios.get(await server_ip() + `/get_recomendations`, {
            sshkey,
            maxContentLength: 100000000,
            maxBodyLength: 1000000000
        });
        // const response = await axios({
        //     method: 'post',
        //     url: await server_ip() + `/get_recomendations`,
        //     data: JSON.stringify({ sshkey }),
        //     headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        //     maxContentLength: 100000000,
        //     maxBodyLength: 1000000000
        // })
        return response.data.recipes
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getRecipe = async (id) => {
    try {
        const response = await axios.get(await server_ip() + `/get_recipe?id=${id}`, {});
        return response.data.recipe
    } catch (error) {
        console.log(error);
        return null
    }
};

export const remRecipe = async (sshkey, id) => {
    try {
        const response = await axios.post(await server_ip() + `/rem_recipes`, {
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
        const response = await axios.post(await server_ip() + `/add_like`, { sshkey, recipe_id: id });
        return response.data.status
    } catch (error) {
        console.log(error);
        return null
    }
};


export const addComment = async (id, sshkey, text) => {
    try {
        const response = await axios.post(await server_ip() + `/add_comment`, { sshkey, recipe_id: id, text });
        return response.data.status
    } catch (error) {
        console.log(error);
        return null
    }
};


// export const searchRecipe = async (search_text, filters=[], categories=[]) => {
//     try {
//         const response = await axios.post(server_ip + `/search`, {search_text, filters, categories, only_categories: false});
//         return response.data
//     } catch (error) {
//         console.log(error);
//         return null
//     }
// };

export const searchRecipe = async (search_text, filters = [], categories = []) => {
    try {
        const response = await fetch(await server_ip() + `/search`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ search_text, filters, categories, only_categories: false })
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.log('err', error);
        return null;
    }
};

export const searchRecipeOnlyCategorys = async (search_text, categories) => {
    try {
        const response = await axios.post(await server_ip() + `/search`, { search_text, categories, only_categories: true });
        return response.data
    } catch (error) {
        console.log(error);
        return null
    }
};