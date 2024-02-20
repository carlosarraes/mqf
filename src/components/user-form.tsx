import { createUser, fetchUsers, storeUsers } from "@/api/user";
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
import { userFormSchema, userFormType } from "@/types/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSnapshot } from "valtio";

export const UserForm = () => {
  const { users } = useSnapshot(storeUsers);
  const form = useForm<userFormType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(values: userFormType) {
    await createUser(values);

    form.reset();
  }

  useEffect(() => void fetchUsers(), []);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-2 mb-8 mx-auto"
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Info className="self-center mr-2 cursor-help" />
            </TooltipTrigger>
            <TooltipContent>
              {users.map((user) => (
                <div key={user.id}>
                  <p>
                    {user.id} - {user.name}
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
          Enviar
        </Button>
      </form>
    </Form>
  );
};
