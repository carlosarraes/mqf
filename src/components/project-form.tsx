import { createProject } from "@/api/projects";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { projectFormSchema, projectFormType } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

export const ProjectForm = () => {
  const form = useForm<projectFormType>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      emoji: "",
    },
  });

  async function onSubmit(values: projectFormType) {
    await createProject(values);

    form.reset();
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 mx-auto"
      >
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
        <FormField
          control={form.control}
          name="emoji"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Emoji" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button variant="outline" type="submit">
          Enviar
        </Button>
      </form>
    </Form>
  );
};
