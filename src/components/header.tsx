import { getJournalMd, getJournalYaml, storeJournal } from "@/api/journal";
import {
  ChevronLeft,
  ChevronRight,
  PackagePlus,
  Plus,
  UserPlus,
} from "lucide-react";
import { useState } from "react";
import { SiYaml } from "react-icons/si";
import { useSnapshot } from "valtio";
import { EntryForm } from "./entry-form";
import { ModeToggle } from "./mode-toggle";
import { ProjectForm } from "./project-form";
import { Separator } from "./ui/separator";
import { UserForm } from "./user-form";
import { FaMarkdown } from "react-icons/fa";

export const Header = () => {
  const { weekStart, weekEnd } = useSnapshot(storeJournal);
  const [openForm, setOpenForm] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openProject, setOpenProject] = useState(false);

  const handleWeekChange = (days: number) => storeJournal.updateWeek(days);
  const cleanUpWeek = (day: string) => {
    const splitDate = day.split("-");
    return `${splitDate[2]}/${splitDate[1]}`;
  };

  const blobHelper = (data: string, kind: string, ext: string) => {
    const blob = new Blob([data], { type: kind });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    const today = new Date().toISOString().slice(0, 10);
    link.download = `journal-${today}.${ext}`;

    document.body.appendChild(link);

    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  };

  const handleDownload = async () => {
    const yamlData = await getJournalYaml();
    if (yamlData) blobHelper(yamlData, "text/yaml", "yaml");
  };

  const handleMarkdown = async () => {
    const mdData = await getJournalMd();
    if (mdData) blobHelper(mdData, "text/markdown", "md");
  };

  return (
    <header className="flex flex-col justify-between p-2">
      <section className="flex justify-between p-2 w-full">
        <h1 className="text-4xl font-bold">El Periódico</h1>
        <section className="flex gap-4">
          <ChevronLeft
            onClick={() => handleWeekChange(7)}
            className="self-center cursor-pointer active:scale-75 duration-150"
          />
          <span className="self-center text-xs font-bold">
            {cleanUpWeek(weekStart)}
          </span>
          <Separator orientation="vertical" />
          <span className="self-center text-xs font-bold">
            {cleanUpWeek(weekEnd)}
          </span>
          <ChevronRight
            onClick={() => handleWeekChange(-7)}
            className="self-center cursor-pointer active:scale-75 duration-150"
          />
        </section>
        <section className="flex gap-4">
          <FaMarkdown
            className="self-center cursor-pointer text-2xl active:scale-75 duration-150"
            onClick={() => handleMarkdown()}
          />
          <SiYaml
            className="self-center cursor-pointer text-2xl active:scale-75 duration-150"
            onClick={() => handleDownload()}
          />
          <PackagePlus
            className={`self-center cursor-pointer ${openProject ? "border-2 p-0.5 rounded-md border-black" : ""}`}
            onClick={() => setOpenProject(!openProject)}
          />
          <UserPlus
            className={`self-center cursor-pointer ${openUser ? "border-2 p-0.5 rounded-md border-black" : ""}`}
            onClick={() => setOpenUser(!openUser)}
          />
          <Plus
            className={`self-center cursor-pointer ${openForm ? "border-2 p-0.5 rounded-md border-black" : ""}`}
            onClick={() => setOpenForm(!openForm)}
          />
          <ModeToggle />
        </section>
      </section>
      <section className="flex flex-col gap-2">
        {openUser && <UserForm />}
        {openProject && <ProjectForm />}
        {openForm && <EntryForm />}
      </section>
    </header>
  );
};
