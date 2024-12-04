import axios from "axios";

class UserService {
  constructor() {
    this.baseURL = 'http://localhost:3000/users';
    this.token = localStorage.getItem('token') || '';
    this.header = {
      headers: {
        'authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json', 
      },
    };
  }
  async list() {
    try {
      const response = await axios.get(this.baseURL, this.header); 
      return response.data.data;  
    } catch (error) {
      console.error(error);
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        this.expirado();
      }
      throw error; 
    }
  }
  async get(id) {
    try {
      const { data } = await axios.get(`${this.baseURL}/${id}`, this.header);
      return data; 
    } catch (error) {
      console.error(error);
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        this.expirado();
      }
      throw error; 
    }
  }
  async create(userData) {
    try {
      const { data } = await axios.post(`${this.baseURL}/store`, userData, this.header);
      return data;
    } catch (error) {
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        this.expirado();
      }
      throw error;
    }
  }
  async delete(email) {
    try {
      const {  data: deleteData } = await axios.delete(`${this.baseURL}/delete/${email}`, this.header);
      return deleteData; 
    } catch (error) {
      console.error(error);
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        this.expirado();
      }
      throw error; 
    }
  }
  async update(email, data) {
    if (!email) {
      console.error("Usuario no definido");
      return;
    }
   try {
      const { data: updatedData } = await axios.put(`${this.baseURL}/update/${email}`, data, this.header);
      return updatedData; 
    } catch (error) {
      console.error(error);
      if (error.response && (error.response.status === 403 || error.response.status === 401)) {
        this.expirado();
      }
      throw error; 
    }
  }
}

const userServiceInstance = new UserService();
export default userServiceInstance;
