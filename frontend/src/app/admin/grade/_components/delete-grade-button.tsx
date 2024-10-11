import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteGradeAction } from "~/_actions/grade";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { TGrade } from "~/types/grade";

type DeleteGradeButtonProps = {
  grade: TGrade;
};
export default function DeleteGradeButton({ grade }: DeleteGradeButtonProps) {
  const handleSubmit = async () => {
    const res = await deleteGradeAction(grade.id);

    if (res.success) {
      toast.success("Delete grade successfully");
    } else {
      toast.error(res.message);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"destructive"} size={"dataTable"}>
          <Trash className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Grade {grade.name}</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this grade?</p>
        <DialogFooter>
          <Button variant={"destructive"} onClick={handleSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
