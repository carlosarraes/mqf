import { deleteEntry, storeJournal, updateEntry } from "@/api/journal";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { JournalEntry, formSchema, formType } from "@/types/journal";
import { zodResolver } from "@hookform/resolvers/zod";
import { SquarePen, XSquare } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";

const EditRow = ({
  journal,
  reset,
}: {
  journal: JournalEntry;
  reset: () => void;
}) => {
  const form = useForm<formType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: journal.id,
      dev_id: journal.dev_id,
      status: journal.status,
      comment: journal.comment,
      day: new Date(),
      project_id: journal.project_id,
    },
  });

  const onSubmit = async (values: formType) => {
    await updateEntry(values);

    reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-2 mx-auto"
      >
        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input placeholder="Comentário" {...field} className="w-full" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="flex justify-between gap-2">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pendente">Pendente</SelectItem>
                    <SelectItem value="Completo">Completo</SelectItem>
                    <SelectItem value="Congelado">Congelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            variant="outline"
            type="submit"
            disabled={!form.formState.isValid}
          >
            Enviar
          </Button>
        </section>
      </form>
    </Form>
  );
};

const ShowRow = ({ journal }: { journal: JournalEntry }) => {
  const [edit, setEdit] = useState(false);

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

  const resetEdit = () => setEdit(false);

  if (edit) return <EditRow journal={journal} reset={resetEdit} />;

  return (
    <>
      <span
        className={`flex h-2 w-2 translate-y-1 rounded-full ${getColorByStatus(journal.status)}`}
      />
      <section className="flex items-center justify-between">
        <p className="text-sm font-medium leading-snug">{journal.comment}</p>
        <section className="flex gap-2 px-1">
          <XSquare
            className="w-4 h-4 cursor-pointer active:scale-75 duration-200 hover:text-red-500"
            onClick={() => deleteEntry(journal.id)}
          />
          <SquarePen
            className="w-4 h-4 cursor-pointer active:scale-75 duration-200 hover:text-blue-500"
            onClick={() => setEdit(!edit)}
          />
        </section>
      </section>
    </>
  );
};

export const ShowJournal = () => {
  const { grouped } = useSnapshot(storeJournal);
  useEffect(() => void storeJournal.updateWeek(0), []);

  const formatName = (name: string) =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();

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

  console.log(grouped);
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
                      <ShowRow journal={journal} key={journal.id} />
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
