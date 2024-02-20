import { proxy } from "valtio";
import axios from "axios";
import {
  Journal,
  JournalEntry,
  JournalSchema,
  JournalStore,
  downloadType,
  formType,
} from "@/types/journal";
import { API_URL } from "@/utils/url";

export const storeJournal = proxy<{
  journals: JournalStore;
  grouped: Record<string, JournalEntry[]>;
}>({
  journals: [],
  grouped: {},
});

const groupByDay = (entries: JournalStore) => {
  return entries.reduce(
    (acc, obj) => {
      const key = obj.day;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(obj);

      return acc;
    },
    {} as Record<string, JournalEntry[]>,
  );
};

export const fetchJournals = async (id: string) => {
  try {
    const { data } = await axios.get(`${API_URL}/journal/dev/${id}`);

    const journals = data.map((item: Journal) => JournalSchema.parse(item));

    storeJournal.journals = journals;
    storeJournal.grouped = groupByDay(journals);
  } catch (error) {
    console.error("Error fetching or validating journals:", error);
  }
};

export const createEntry = async (journal: formType) => {
  try {
    await axios.post(`${API_URL}/journal`, {
      dev_id: 1,
      title: journal.title,
      comment: journal.comment,
      day: journal.day.toISOString().split("T")[0],
      project_id: journal.project_id,
    });

    await fetchJournals("1");
  } catch (error) {
    console.error("Error creating journal:", error);
  }
};

const cleanUpDate = (date: Date) => date.toISOString().split("T")[0];

export const getJournalYaml = async (form: downloadType) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/journal/yaml/1?start_date=${cleanUpDate(form.startDate)}&end_date=${cleanUpDate(form.endDate)}`,
    );

    return data;
  } catch (error) {
    console.error("Error fetching journal yaml:", error);
  }
};
