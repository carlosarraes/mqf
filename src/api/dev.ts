import { proxy } from "valtio";
import axios from "axios";
import { Dev, devFormType } from "@/types/user";
import { API_URL } from "@/utils/url";

export const storeDevs = proxy<{
  devs: Dev[];
}>({
  devs: [],
});

export const fetchDevs = async () => {
  try {
    const response = await axios.get(`${API_URL}/dev`);

    storeDevs.devs = response.data;
  } catch (error) {
    console.error(error);
  }
};

export const createUser = async (form: devFormType) => {
  console.log(form);
  try {
    await axios.post(`${API_URL}/dev`, {
      name: form.name,
    });

    await fetchDevs();
  } catch (error) {
    console.error(error);
  }
};
