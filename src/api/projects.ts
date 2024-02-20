import { Project, projectFormType } from "@/types/project";
import { API_URL } from "@/utils/url";
import axios from "axios";
import { proxy } from "valtio";

export const storeProjects = proxy<{
  projects: Project[];
}>({
  projects: [],
});

export const fetchProjects = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/projects`);

    storeProjects.projects = data;
  } catch (error) {
    console.error("Error fetching or validating projects:", error);
  }
};

export const createProject = async (form: projectFormType) => {
  try {
    await axios.post(`${API_URL}/projects`, {
      name: form.name,
      emoji: form.emoji,
    });

    await fetchProjects();
  } catch (error) {
    console.error("Error creating project:", error);
  }
};
