import { Trash } from "lucide-react";
import { toast } from "sonner";
import { deleteCatalogAction } from "~/_actions/catalog";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/app/_components/ui/dialog";
import { TUmrahPackage } from "~/types/umrah-package";

type DeleteCatalogButtonProps = {
  catalog: TUmrahPackage;
};
export default function DeleteCatalogButton({
  catalog,
}: DeleteCatalogButtonProps) {
  const handleSubmit = async () => {
    const res = await deleteCatalogAction(catalog.id);

    if (res.success) {
      toast.success("Delete catalog successfully");
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
          <DialogTitle>Delete Catalog {catalog.name}</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this catalog?</p>
        <DialogFooter>
          <Button variant={"destructive"} onClick={handleSubmit}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
