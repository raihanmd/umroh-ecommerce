import { Pencil } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { updateGradeAction } from "~/_actions/grade";
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
import { TGrade } from "~/types/grade";

type UpdateGradeButtonProps = {
  grade: TGrade;
};

export function UpdateGradeButton({ grade }: UpdateGradeButtonProps) {
  const handleSubmit = async (data: z.infer<typeof createGradeSchema>) => {
    const res = await updateGradeAction(data, grade.id);

    if (res.success) {
      toast.success("Create grade successfully");
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
          <DialogTitle>Update grade {grade.name}</DialogTitle>
          <DialogDescription>
            Fill in your details below to update grade.
          </DialogDescription>
        </DialogHeader>
        <AutoForm
          values={{ ...grade }}
          onSubmit={handleSubmit}
          formSchema={createGradeSchema}
        >
          <DialogFooter>
            <AutoFormSubmit />
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
