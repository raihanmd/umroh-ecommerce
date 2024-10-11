import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteUstadzAction } from "~/_actions/ustadz";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { TUstadz } from "~/types/ustadz";

type DeleteUstadzButtonProps = {
  ustadz: TUstadz;
};
export default function DeleteUstadzButton({
  ustadz,
}: DeleteUstadzButtonProps) {
  const handleSubmit = async () => {
    const res = await deleteUstadzAction(ustadz.id);

    if (res.success) {
      toast.success("Delete ustadz successfully");
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
          <DialogTitle>Delete Ustadz {ustadz.name}</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this ustadz?</p>
        <DialogFooter>
          <Button variant={"destructive"} onClick={handleSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
