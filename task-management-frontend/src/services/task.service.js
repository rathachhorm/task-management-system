import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const getAuthHeaders = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return {
        headers: {
            Authorization: user ? `Bearer ${user.token}` : ''
        }
    };
};

const TaskService = {
    getTasks: async (status = '') => {
        try {
            const response = await axios.get(`${API_BASE_URL}/tasks${status ? `?status=${status}` : ''}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    },

    createTask: async (task) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/tasks`, task, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    },

    updateTask: async (id, task) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/tasks/${id}`, task, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error(`Error updating task with id ${id}:`, error);
            throw error;
        }
    },

    deleteTask: async (id) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/tasks/${id}`, getAuthHeaders());
            return response.data;
        } catch (error) {
            console.error(`Error deleting task with id ${id}:`, error);
            throw error;
        }
    }
};

export default TaskService;
