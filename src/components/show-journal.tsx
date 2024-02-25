import { storeJournal } from "@/api/journal";
import { JournalEntry } from "@/types/journal";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Separator } from "./ui/separator";

export const ShowJournal = () => {
  const { grouped } = useSnapshot(storeJournal);
  useEffect(() => void storeJournal.updateWeek(0), []);

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  const getColorByStatus = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-500";
      case "Completo":
        return "bg-green-500";
      case "Congelado":
        return "bg-sky-500";
      default:
        return "bg-gray-500";
    }
  };

  const statusOrder: { [key: string]: number } = {
    Completo: 1,
    Pendente: 2,
    Congelado: 3,
  } as const;

  const sortStatuses = (
    a: [string, readonly JournalEntry[]],
    b: [string, readonly JournalEntry[]],
  ): number => {
    return (statusOrder[a[0]] || Infinity) - (statusOrder[b[0]] || Infinity);
  };

  return (
    <section className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-4">
      {Object.entries(grouped).map(([project, data]) => (
        <Card key={project} className="min-w-96">
          <CardHeader>{formatName(project)}</CardHeader>
          <Separator className="mb-6" />
          <CardContent className="flex flex-col gap-4">
            {Object.entries(data)
              .sort(sortStatuses)
              .map(([projectStatus, journals]) => (
                <div className="flex flex-col" key={projectStatus}>
                  <h3 className="text-sm font-semibold mb-2">
                    {formatName(projectStatus)}
                  </h3>
                  <div className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                    {journals.map((journal) => (
                      <>
                        <span
                          className={`flex h-2 w-2 translate-y-1 rounded-full ${getColorByStatus(projectStatus)}`}
                        />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {journal.comment}
                          </p>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      ))}
    </section>
  );
};
