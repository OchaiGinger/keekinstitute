import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Course image uploaded:", file.ufsUrl);
            return { url: file.ufsUrl };
        }),

    profileImage: f({ image: { maxFileSize: "4MB" } })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Profile image uploaded:", file.ufsUrl);
            return { url: file.ufsUrl };
        }),

    courseAttachment: f(["pdf", "text", "video", "image", "audio"])
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Course attachment uploaded:", file.ufsUrl, file.name);
            return { url: file.ufsUrl, name: file.name };
        }),

    chapterVideo: f({ video: { maxFileSize: "512GB" } })
        .middleware(async () => {
            const { userId } = await auth();
            if (!userId) throw new Error("Unauthorized");
            return { userId };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            console.log("Chapter video uploaded:", file.ufsUrl);
            return { url: file.ufsUrl };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
