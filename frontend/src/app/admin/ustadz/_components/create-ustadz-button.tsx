import { toast } from "sonner";
import { z } from "zod";
import { createUstadzAction } from "~/_actions/ustadz";
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
import { createUstadzSchema } from "~/schema/ustadz.schema";

export function CreateUstadzButton() {
  const handleSubmit = async (data: z.infer<typeof createUstadzSchema>) => {
    const res = await createUstadzAction(data);

    if (res.success) {
      toast.success("Create ustadz successfully");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Create ustadz</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create ustadz</DialogTitle>
          <DialogDescription>
            Fill in your details below to create grade.
          </DialogDescription>
        </DialogHeader>
        <AutoForm onSubmit={handleSubmit} formSchema={createUstadzSchema}>
          <DialogFooter>
            <AutoFormSubmit />
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
