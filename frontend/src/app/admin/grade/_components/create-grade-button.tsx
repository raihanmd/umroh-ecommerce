import { toast } from "sonner";
import { z } from "zod";
import { createGradeAction } from "~/_actions/grade";
import AutoForm, { AutoFormSubmit } from "~/app/_components/ui/auto-form";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { createGradeSchema } from "~/schema/grade.schema";

export function CreateGradeButton() {
  const handleSubmit = async (data: z.infer<typeof createGradeSchema>) => {
    const res = await createGradeAction(data);

    if (res.success) {
      toast.success("Create grade successfully");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create grade</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create grade</DialogTitle>
          <DialogDescription>
            Fill in your details below to create grade.
          </DialogDescription>
        </DialogHeader>
        <AutoForm onSubmit={handleSubmit} formSchema={createGradeSchema}>
          <DialogFooter>
            <AutoFormSubmit />
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
