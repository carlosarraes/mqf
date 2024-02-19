import { useEffect } from "react";
import { Button } from "./components/ui/button";
import { fetchJournals, storeJournal } from "./api/journal";
import { useSnapshot } from "valtio";

function App() {
  const { journals, grouped } = useSnapshot(storeJournal);
  useEffect(() => void fetchJournals("1", "2024-02-13", "2024-02-18"), []);

  console.log(journals);
  console.log("grouped", grouped);
  return (
    <main>
      <h1 className="text-4xl font-bold">Hello</h1>
      <Button>Click Me</Button>
    </main>
  );
}

export default App;
