import { proxy } from "valtio";
import axios from "axios";
import { User, userFormType } from "@/types/user";
import { API_URL } from "@/utils/url";

export const storeUsers = proxy<{
  users: User[];
}>({
  users: [],
});

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/dev`);

    storeUsers.users = response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (form: userFormType) => {
  try {
    await axios.post(`${API_URL}/dev`, {
      dev_name: form.name,
    });

    await fetchUsers();
  } catch (error) {
    console.error(error);
  }
};
