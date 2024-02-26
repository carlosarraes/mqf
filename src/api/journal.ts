import {
  Journal,
  JournalEntry,
  JournalSchema,
  JournalStore,
  formType,
} from "@/types/journal";
import { getPreviousWednesday } from "@/utils/date";
import { API_URL } from "@/utils/url";
import axios from "axios";
import { proxy } from "valtio";

export type GroupedJournal = Record<string, Record<string, JournalEntry[]>>;

export const storeJournal = proxy<{
  journals: JournalStore;
  grouped: GroupedJournal;
  weekOffset: number;
  weekStart: string;
  weekEnd: string;
  updateWeek: (offset: number) => void;
}>({
  journals: [],
  grouped: {},
  weekOffset: 0,
  weekStart: getPreviousWednesday(0),
  weekEnd: getPreviousWednesday(0, 6),
  async updateWeek(offset: number) {
    this.weekOffset += offset;
    this.weekStart = getPreviousWednesday(this.weekOffset);
    this.weekEnd = getPreviousWednesday(this.weekOffset, 6);

    await fetchJournalsByDate(this.weekStart, this.weekEnd);
  },
});

const groupByProjectAndStatus = (entries: JournalEntry[]): GroupedJournal => {
  return entries.reduce((acc: GroupedJournal, obj: JournalEntry) => {
    const projectKey = `${obj.project} ${obj.emoji}`;
    const statusKey = obj.status;

    if (!acc[projectKey]) {
      acc[projectKey] = {};
    }

    if (!acc[projectKey][statusKey]) {
      acc[projectKey][statusKey] = [];
    }

    acc[projectKey][statusKey].push(obj);

    return acc;
  }, {});
};

export const fetchJournalsByDevByDate = async (devId: string) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/journal/dev/${devId}?start_date=${storeJournal.weekStart}&end_date=${storeJournal.weekEnd}`,
    );

    const journals = data.map((item: Journal) => JournalSchema.parse(item));

    storeJournal.journals = journals;
    storeJournal.grouped = groupByProjectAndStatus(journals);
  } catch (error) {
    console.error("Error fetching or validating journals:", error);
  }
};

export const fetchJournalsByDate = async (
  dateStart: string = storeJournal.weekStart,
  dateEnd: string = storeJournal.weekEnd,
) => {
  const { data } = await axios.get(
    `${API_URL}/journal/date?start_date=${dateStart}&end_date=${dateEnd}`,
  );

  const journals = data.map((item: Journal) => JournalSchema.parse(item));

  storeJournal.journals = journals;
  storeJournal.grouped = groupByProjectAndStatus(journals);
};

export const createEntry = async (journal: formType) => {
  try {
    await axios.post(`${API_URL}/journal`, {
      dev_id: journal.dev_id,
      status: journal.status,
      comment: journal.comment,
      day: journal.day.toISOString().split("T")[0],
      project_id: journal.project_id,
    });

    await fetchJournalsByDate(storeJournal.weekStart, storeJournal.weekEnd);
  } catch (error) {
    console.error("Error creating journal:", error);
  }
};

export const updateEntry = async (journal: formType) => {
  try {
    await axios.put(`${API_URL}/journal/${journal.id}`, {
      dev_id: journal.dev_id,
      status: journal.status,
      comment: journal.comment,
      day: journal.day.toISOString().split("T")[0],
      project_id: journal.project_id,
    });

    await fetchJournalsByDate();
  } catch (error) {
    console.error("Error updating journal:", error);
  }
};

export const deleteEntry = async (id: number) => {
  try {
    await axios.delete(`${API_URL}/journal/${id}`);

    await fetchJournalsByDate();
  } catch (error) {
    console.error("Error deleting journal:", error);
  }
};

export const getJournalYaml = async (
  startDate: string = storeJournal.weekStart,
  endDate: string = storeJournal.weekEnd,
) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/journal/yaml?start_date=${startDate}&end_date=${endDate}`,
    );

    return data;
  } catch (error) {
    console.error("Error fetching journal yaml:", error);
  }
};

export const getJournalMd = async (
  startDate: string = storeJournal.weekStart,
  endDate: string = storeJournal.weekEnd,
) => {
  try {
    const { data } = await axios.get(
      `${API_URL}/journal/md?start_date=${startDate}&end_date=${endDate}`,
    );

    return data;
  } catch (error) {
    console.error("Error fetching journal yaml:", error);
  }
};
