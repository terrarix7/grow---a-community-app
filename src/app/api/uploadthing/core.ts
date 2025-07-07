import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth as authServer } from "~/server/auth";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

const f = createUploadthing();

const auth = async (req: Request) => {
  const session = await authServer();
  if (!session?.user) throw new UploadThingError("Unauthorized");
  return { id: session.user.id, email: session.user.email };
};

export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 2,
    },
  })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      return { userId: user.id, email: user.email };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      try {
        await redis.lpush(`images:${metadata.email}`, file.ufsUrl);

        console.log("Upload complete for userId:", metadata.userId);

        return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
      } catch (error) {
        console.error("Failed to store image in Redis:", error);
        throw new UploadThingError("Failed to store image");
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
