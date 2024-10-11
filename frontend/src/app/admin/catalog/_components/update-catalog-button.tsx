import { toast } from "sonner";
import { z } from "zod";
import Cookies from "js-cookie";
import DropzoneFile from "~/app/_components/dropzone-file";
import AutoForm, { AutoFormSubmit } from "~/app/_components/ui/auto-form";
import { DependencyType } from "~/app/_components/ui/auto-form/types";
import { Button } from "~/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/app/_components/ui/dialog";
import { createCatalogSchema } from "~/schema/catalog.schema";
import { env } from "~/env";
import { revalidateTags } from "~/_actions/revalidate-tag";
import { useCatalogStore } from "~/stores/use-catalog-store";
import { TUmrahPackage } from "~/types/umrah-package";
import { Pencil } from "lucide-react";
import { DialogTrigger } from "@radix-ui/react-dialog";

type UpdateCatalogButtonProps = {
  catalog: TUmrahPackage;
};

export function UpdateCatalogButton({ catalog }: UpdateCatalogButtonProps) {
  const { grades, ustadzs } = useCatalogStore();

  const handleSubmit = async (data: z.infer<typeof createCatalogSchema>) => {
    try {
      const accessToken = Cookies.get("access_token");

      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key !== "photo_urls" && key !== "video_urls") {
          // @ts-ignore
          formData.append(key, data[key]);
        }
      });

      if (data.photo_urls) {
        data.photo_urls.forEach((file, index) => {
          formData.append(`photo_urls`, file);
        });
      }

      if (data.video_urls) {
        data.video_urls.forEach((file, index) => {
          formData.append(`video_urls`, file);
        });
      }

      const response = await fetch(
        `${env.NEXT_PUBLIC_API_URL}/umrah-packages/${catalog.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData,
        },
      );

      const res = await response.json();

      revalidateTags("catalogs");

      if (response.ok) {
        toast.success("Create catalog successfully");
      } else {
        toast.error(res.message || "Failed to create catalog");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={"dataTable"}>
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create catalog</DialogTitle>
          <DialogDescription>
            Fill in your details below to create catalog.
          </DialogDescription>
        </DialogHeader>
        <AutoForm
          values={{
            name: catalog.name,
            description: catalog.description,
            grade_id: catalog.grade_id,
            ustadz_id: catalog.ustadz_id,
            price: catalog.price,
          }}
          className="grid space-y-0 lg:grid-cols-2"
          onSubmit={handleSubmit}
          formSchema={createCatalogSchema}
          fieldConfig={{
            ustadz_id: {
              fieldType: "select",
              options: ustadzs.map((ustadz) => ({
                value: ustadz.id,
                label: ustadz.name,
              })),
              inputProps: {
                placeholder: "Select Ustadz",
              },
            },
            grade_id: {
              fieldType: "select",
              options: grades.map((grade) => ({
                value: grade.id,
                label: grade.name,
              })),
              inputProps: {
                placeholder: "Select Grade",
              },
            },
            description: {
              fieldType: "textarea",
              inputProps: {
                placeholder: "The description of the product",
              },
            },
            name: {
              inputProps: {
                placeholder: "The name of the product",
              },
            },
            price: {
              isRupiah: true,
              inputProps: {
                placeholder: "The price of the product",
              },
            },
          }}
          dependencies={[
            {
              sourceField: "photo_urls",
              type: DependencyType.HIDES,
              targetField: "photo_urls",
              when: () => true,
            },
            {
              sourceField: "video_urls",
              type: DependencyType.HIDES,
              targetField: "video_urls",
              when: () => true,
            },
          ]}
        >
          <DropzoneFile
            formField="photo_urls"
            acceptedFileTypes={{
              "image/*": [".png", ".jpg", ".jpeg"],
            }}
            initialFiles={JSON.parse(catalog.photo_urls)}
          />
          <DropzoneFile
            formField="video_urls"
            acceptedFileTypes={{
              "video/*": [".mp4", ".mov", ".avi"],
            }}
            maxFileSize={10 * 1024 * 1024}
            initialFiles={JSON.parse(catalog.video_urls)}
          />
          <DialogFooter>
            <AutoFormSubmit />
          </DialogFooter>
        </AutoForm>
      </DialogContent>
    </Dialog>
  );
}
