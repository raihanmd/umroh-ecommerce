import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { updateUstadzAction } from "~/_actions/ustadz";
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
import { TUstadz } from "~/types/ustadz";

type UpdateUstadzuttonProps = {
  ustadz: TUstadz;
};

export function UpdateUstadzButton({ ustadz }: UpdateUstadzuttonProps) {
  const handleSubmit = async (data: z.infer<typeof createUstadzSchema>) => {
    const res = await updateUstadzAction(data, ustadz.id);

    if (res.success) {
      toast.success("Create ustadz successfully");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"dataTable"}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Ustadz {ustadz.name}</DialogTitle>
          <DialogDescription>
            Fill in your details below to update ustadz.
          </DialogDescription>
        </DialogHeader>
        <AutoForm
          values={ustadz}
          onSubmit={handleSubmit}
          formSchema={createUstadzSchema}
        >
          <DialogFooter>
            <AutoFormSubmit />
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
