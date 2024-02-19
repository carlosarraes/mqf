import { proxy } from "valtio";
import axios from "axios";
import {
  Journal,
  JournalEntry,
  JournalSchema,
  JournalStore,
} from "@/types/journal";

const API_URL = "http://localhost:3000";

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

export const fetchJournals = async (
  id: string,
  startDate: string,
  endDate: string,
) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/journal/dev/${id}?start_date=${startDate}&end_date=${endDate}`,
    );

    const journals = data.map((item: Journal) => JournalSchema.parse(item));

    storeJournal.journals = journals;
    storeJournal.grouped = groupByDay(journals);
  } catch (error) {
    console.error("Error fetching or validating journals:", error);
  }
};
