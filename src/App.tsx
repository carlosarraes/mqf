import { useEffect, useState } from "react";
import { useSnapshot } from "valtio";
import { fetchJournals, storeJournal } from "./api/journal";
import { ModeToggle } from "./components/mode-toggle";
import { ShowJournal } from "./components/show-journal";
import { Download, PackagePlus, Plus, UserPlus } from "lucide-react";
import { EntryForm } from "./components/entry-form";
import { UserForm } from "./components/user-form";
import { ProjectForm } from "./components/project-form";
import { DownloadForm } from "./components/download-form";

function App() {
  const [openForm, setOpenForm] = useState(false);
  const [openUser, setOpenUser] = useState(false);
  const [openProject, setOpenProject] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);
  const { grouped } = useSnapshot(storeJournal);
  useEffect(() => void fetchJournals("1"), [grouped]);

  return (
    <main className="max-w-4xl mx-auto">
      <header className="flex justify-between p-2">
        <h1 className="text-4xl font-bold">El Periódico</h1>
        <section className="flex gap-4">
          <Download
            className="self-center cursor-pointer"
            onClick={() => setOpenDownload(!openDownload)}
          />
          <PackagePlus
            className="self-center cursor-pointer"
            onClick={() => setOpenProject(!openProject)}
          />
          <UserPlus
            className="self-center cursor-pointer"
            onClick={() => setOpenUser(!openUser)}
          />
          <Plus
            className="self-center cursor-pointer"
            onClick={() => setOpenForm(!openForm)}
          />
          <ModeToggle />
        </section>
      </header>
      <section className="flex flex-col p-2">
        {openDownload && <DownloadForm />}
        {openUser && <UserForm />}
        {openProject && <ProjectForm />}
        {openForm && <EntryForm />}
        <ShowJournal grouped={grouped} />
      </section>
    </main>
  );
}

export default App;
