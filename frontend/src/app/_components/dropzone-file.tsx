import React, { useCallback, useEffect, useState } from "react";
import { X, FileIcon } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { Button } from "./ui/button";
import { beautifyObjectName } from "./ui/auto-form/utils";

export interface FileWithPreview {
  file: File;
  preview: string;
  size: number;
  name: string;
  type: string;
}

interface DropzoneFileProps {
  initialFiles?: string[];
  formField: string;
  acceptedFileTypes: Record<string, string[]>;
  maxFileSize?: number;
  multiple?: boolean;
}

const DropzoneFile: React.FC<DropzoneFileProps> = ({
  initialFiles = [],
  formField,
  acceptedFileTypes,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  multiple = true,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<FileWithPreview[]>([]);
  const {
    setError,
    clearErrors,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext();

  const watchedValue = watch(formField);
  const siblingValue = watch(
    formField === "photo_urls" ? "video_urls" : "photo_urls",
  );

  useEffect(() => {
    const loadInitialFiles = async () => {
      if (initialFiles.length > 0 && uploadedFiles.length === 0) {
        const filePromises = initialFiles.map(async (filePath) => {
          const response = await fetch(filePath);
          const blob = await response.blob();
          const fileName = filePath.split("/").pop()?.split("?")[0] || "file";
          const file = new File([blob], fileName, {
            type: blob.type,
            lastModified: Date.now(),
          });

          return {
            file,
            preview: file.type.startsWith("image/")
              ? URL.createObjectURL(blob)
              : fileName,
            size: file.size,
            name: fileName,
            type: file.type,
          };
        });

        const initialLoadedFiles = await Promise.all(filePromises);
        setUploadedFiles(initialLoadedFiles);
        setValue(
          formField,
          initialLoadedFiles.map((file) => {
            return file.file;
          }),
        );
      }
    };

    loadInitialFiles();
  }, [initialFiles, setValue, formField]);

  useEffect(() => {
    if (!watchedValue) {
      setUploadedFiles([]);
    }
  }, [watchedValue]);

  const handleFilesAccepted = useCallback(
    (acceptedFiles: File[]) => {
      const totalLength =
        acceptedFiles.length +
        uploadedFiles.length +
        (siblingValue?.length || 0);

      if (totalLength > 5) {
        setError(formField, { message: "You can only upload up to 5 files" });
        return;
      }

      if (acceptedFiles.length === 0) {
        setError(formField, { message: "File is required" });
        return;
      }

      const validFiles = acceptedFiles.filter(
        (file) => file.size <= maxFileSize,
      );
      const oversizedFiles = acceptedFiles.filter(
        (file) => file.size > maxFileSize,
      );

      if (oversizedFiles.length > 0) {
        setError(formField, {
          message: `${oversizedFiles.length} file(s) exceed the ${maxFileSize / 1024 / 1024}MB size limit and were not added.`,
        });
      }

      const newFiles = validFiles.map((file) => ({
        file,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : file.name,
        size: file.size,
        name: file.name,
        type: file.type,
      }));

      setUploadedFiles((prevFiles) => {
        const updatedFiles = multiple ? [...prevFiles, ...newFiles] : newFiles;

        setValue(
          formField,
          updatedFiles.map((fileObj) => fileObj.file),
          { shouldDirty: true, shouldValidate: true },
        );

        clearErrors(formField);
        return updatedFiles;
      });
    },
    [setError, setValue, clearErrors, formField, multiple, maxFileSize],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple,
    accept: acceptedFileTypes,
    onDrop: handleFilesAccepted,
    maxSize: maxFileSize,
  });

  const handleRemoveFile = useCallback(
    (index: number) => {
      setUploadedFiles((prevFiles) => {
        const updatedFiles = prevFiles.filter((_, i) => i !== index);
        setValue(formField, updatedFiles, {
          shouldDirty: true,
          shouldValidate: true,
          shouldTouch: true,
        });
        if (updatedFiles.length === 0) {
          setError(formField, { message: "File is required" });
        }
        return updatedFiles;
      });
    },
    [setError, setValue, formField],
  );

  return (
    <section className="container space-y-2">
      <label htmlFor="dropzone-file">
        {beautifyObjectName(formField).split("_")[0]}{" "}
        <span className="text-destructive">*</span>
      </label>
      <div
        {...getRootProps({ className: "dropzone" })}
        className={`rounded-lg border-2 border-dashed p-4 text-center ${
          isDragActive ? "border-green-400" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-green-400">Drop the files here...</p>
        ) : (
          <p>
            Drag 'n' drop some files here, or click to select files (max{" "}
            {maxFileSize / 1024 / 1024}MB each)
          </p>
        )}
      </div>
      {uploadedFiles.length > 0 && (
        <aside className="mt-4">
          <h4>Files</h4>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {uploadedFiles.map((file, index) => (
              <div
                className="relative flex flex-col justify-center"
                key={index}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={file.preview}
                    className="h-40 w-full max-w-full rounded-lg object-cover object-center"
                    alt="Preview"
                  />
                ) : (
                  <div className="flex h-40 w-full items-center justify-center rounded-lg bg-gray-100">
                    <FileIcon className="h-16 w-16 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">
                      {file.name}
                    </span>
                  </div>
                )}
                <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute right-2 top-2 size-6 rounded-md"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRemoveFile(index);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </aside>
      )}
      {errors?.[formField] && (
        <p className="text-[0.8rem] font-medium text-destructive">
          {errors?.[formField]?.message as string}
        </p>
      )}
    </section>
  );
};

export default DropzoneFile;
