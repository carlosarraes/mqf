import { createUser, fetchDevs, storeDevs } from "@/api/dev";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { devFormSchema, devFormType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { formatName } from "@/utils/formatter";
import { fetchJournalsByDate, fetchJournalsByDevByDate } from "@/api/journal";

export const UserForm = () => {
  const { devs } = useSnapshot(storeDevs);

  const form = useForm<devFormType>({
    resolver: zodResolver(devFormSchema),
    defaultValues: {
      name: "",
    },
  });

  const formFilter = useForm<devFormType>({
    resolver: zodResolver(devFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: devFormType) {
    await createUser(values);

    form.reset();
  }

  const handleFilter = async (values: devFormType) => {
    if (values.name === "0") {
      await fetchJournalsByDate();
      return;
    }
    await fetchJournalsByDevByDate(values.name);

    formFilter.reset();
  };

  useEffect(() => void fetchDevs(), []);

  return (
    <section className="flex justify-between gap-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex gap-2 mx-auto"
        >
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="self-center mr-2 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                {devs.map((dev) => (
                  <div key={dev.id}>
                    <p>
                      {dev.id} - {dev.name}
                    </p>
                  </div>
                ))}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" type="submit">
            Cadastrar
          </Button>
        </form>
      </Form>
      <Form {...formFilter}>
        <form
          onSubmit={formFilter.handleSubmit(handleFilter)}
          className="flex gap-2 mx-auto"
        >
          <FormField
            control={formFilter.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Por pessoa" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="0">Todos</SelectItem>
                    {devs.map((dev) => (
                      <SelectItem key={dev.id} value={String(dev.id)}>
                        {formatName(dev.name)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button variant="outline" type="submit">
            Filtrar
          </Button>
        </form>
      </Form>
    </section>
  );
};
