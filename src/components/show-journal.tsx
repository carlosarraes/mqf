import { JournalEntry } from "@/types/journal";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface ShowJournalProps {
  grouped: Record<string, ReadonlyArray<Readonly<JournalEntry>>>;
}

export const ShowJournal = ({ grouped }: ShowJournalProps) => {
  const formatDate = (date: string) => {
    const d = date.split("-");

    return `${d[2]}/${d[1]}/${d[0]}`;
  };

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

  return (
    <>
      {Object.entries(grouped).map(([date, entries]) => (
        <Table>
          <TableCaption>{formatDate(date)}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Comment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <>
                <TableRow key={entry.id}>
                  <TableCell>
                    {entry.emoji} {formatName(entry.project)}
                  </TableCell>
                  <TableCell>{entry.title}</TableCell>
                  <TableCell>{entry.comment}</TableCell>
                </TableRow>
              </>
            ))}
          </TableBody>
        </Table>
      ))}
    </>
  );
};
