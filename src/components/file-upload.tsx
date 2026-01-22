"use client";

import toast from "react-hot-toast";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";

interface FileUploadProps {
  onChange: (url?: string, originalFilename?: string) => void;
  endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({
  onChange,
  endpoint
}: FileUploadProps) => {

  return (
    <div className="w-full">
      <UploadDropzone
        endpoint={endpoint}
        onClientUploadComplete={(res) => {
          console.log("Upload complete:", res);
          if (res && res.length > 0) {
            onChange(res[0].url, res[0].name);
            toast.success("File uploaded successfully");
          }
        }}
        onUploadError={(error: Error) => {
          console.error("Upload error:", error);
          toast.error(`Upload failed: ${error?.message}`);
        }}
        onUploadBegin={() => {
          console.log("Upload starting...");
          toast.loading("Uploading file...");
        }}
      />
    </div>
  );
}
