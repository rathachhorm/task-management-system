import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api'; // Assuming your backend runs on 8080

const CategoryService = {
    getAll: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/categories`);
            return response.data;
        } catch (error) {
            console.error('Error fetching categories:', error);
            throw error;
        }
    },

    create: async (category) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/categories`, category);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    }
};

export default CategoryService;

