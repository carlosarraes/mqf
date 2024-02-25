import { Header } from "./components/header";
import { ShowJournal } from "./components/show-journal";

function App() {
  return (
    <main className="max-w-4xl mx-auto">
      <Header />
      <section className="flex flex-wrap p-2 gap-2 justify-center items-center">
        <ShowJournal />
      </section>
    </main>
  );
}

export default App;
