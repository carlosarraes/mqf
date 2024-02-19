import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { fetchJournals, storeJournal } from "./api/journal";
import { ModeToggle } from "./components/mode-toggle";
import { ShowJournal } from "./components/show-journal";
import { EntryForm } from "./components/entry-form";

function App() {
  const { grouped } = useSnapshot(storeJournal);
  useEffect(() => void fetchJournals("1", "2024-02-13", "2024-02-18"), []);

  return (
    <main className="max-w-4xl mx-auto">
      <header className="flex justify-between p-2">
        <h1 className="text-4xl font-bold">Dev J</h1>
        <ModeToggle />
      </header>
      <section className="flex flex-col p-2">
        <EntryForm />
        <ShowJournal grouped={grouped} />
      </section>
    </main>
  );
}

export default App;
