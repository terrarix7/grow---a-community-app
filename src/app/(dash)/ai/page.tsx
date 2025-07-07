import React from "react";
import UploadComp from "./client";
import { Redis } from "@upstash/redis";
import { auth } from "~/server/auth";

const redis = Redis.fromEnv();

async function page() {
  const session = await auth();
  const images = (await redis.lrange(
    `images:${session?.user?.email}`,
    0,
    -1,
  )) as string[];

  return (
    <main className="flex flex-col items-center justify-center">
      <UploadComp />
      {images &&
        images.map((image: string, index: number) => (
          <img key={index} src={image} alt="image" className="h-10 w-10" />
        ))}
    </main>
  );
}

export default page;
