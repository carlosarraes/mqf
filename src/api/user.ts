import { proxy } from "valtio";
import axios from "axios";
import { Dev, devFormType } from "@/types/user";
import { API_URL } from "@/utils/url";

export const storeDevs = proxy<{
  devs: Dev[];
}>({
  devs: [],
});

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/dev`);

    storeDevs.devs = response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (form: devFormType) => {
  try {
    await axios.post(`${API_URL}/dev`, {
      dev_name: form.name,
    });

    await fetchUsers();
  } catch (error) {
    console.error(error);
  }
};
