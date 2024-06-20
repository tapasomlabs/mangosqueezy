"use client";
import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { BusinessContext } from "../providers";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database } from "lucide-react";
import { IconBrandYoutube } from "@tabler/icons-react";

export default function AffiliatePage() {
  const context = useContext(BusinessContext);
  const { youtuberList, setYoutuberList, mangoSqueezyList, setMangosqueezyList } = context;
  const [searchQuery, setSearchQuery] = useState<string>("");

  const callAffiliatesBySearchQuery = async () => {
    const formData = new FormData();
    formData.append("search-query", searchQuery);

    const response = await fetch("https://mangosqueezy.com/api/affiliates", {
      method: "POST",
      body: formData,
    });
    const result = await response.json();

    setMangosqueezyList(result);
  };

  const searchYoutuberAPI = async () => {
    const parameters = {
      part: "snippet",
      q: searchQuery,
      key: process.env.NEXT_PUBLIC_YOUTUBE_API_KEY!,
      type: "channel,video,playlist",
      maxResults: "20",
    };
    const queryParameter = new URLSearchParams(parameters);
    const response = await fetch(
      `https://youtube.googleapis.com/youtube/v3/search?${queryParameter.toString()}`,
      {
        method: "GET",
      }
    );

    const result = await response.json();

    callAffiliatesBySearchQuery();

    setYoutuberList(result.items);
  };

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="email"
          placeholder="search a youtuber..."
          value={searchQuery}
          onChange={event => setSearchQuery(event?.target.value)}
        />
        <Button onClick={searchYoutuberAPI}>Search</Button>
      </div>

      <Tabs defaultValue="youtube" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="youtube" className="group">
            YouTube Affiliates
            <IconBrandYoutube className="size-5 ml-2 text-red-500 group-hover:animate-tilt" />
          </TabsTrigger>
          <TabsTrigger value="mangosqueezy" className="group">
            Mangosqueezy Affiliates
            <Database className="ml-2 size-5 text-blue-500 group-hover:animate-tilt" />
          </TabsTrigger>
        </TabsList>
        <TabsContent value="youtube">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto mt-10">
            {youtuberList &&
              youtuberList.map((youtuber, index) => (
                <div
                  key={`${youtuber.snippet.channelId}-${index}`}
                  className="row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4"
                >
                  <div className="group-hover/bento:translate-x-2 transition duration-200">
                    <Image
                      className="w-full h-auto flex-none rounded-xl bg-gray-50"
                      src={youtuber.snippet.thumbnails.high.url}
                      width={200}
                      height={200}
                      alt=""
                    />
                    <Link href={`/affiliates/${youtuber.snippet.channelId}/${youtuber.id.videoId}`}>
                      <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                        {youtuber.snippet.channelTitle}
                      </div>
                      <div className="font-sans font-normal text-neutral-600 text-sm dark:text-neutral-300">
                        {youtuber.snippet.description}
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="mangosqueezy">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto mt-10">
            {mangoSqueezyList &&
              mangoSqueezyList.map((mangosqueezy, index) => (
                <div
                  key={`${mangosqueezy.metadata.email}-${index}`}
                  className="row-span-1 rounded-xl group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none p-4 dark:bg-black dark:border-white/[0.2] bg-white border border-transparent justify-between flex flex-col space-y-4"
                >
                  <div className="group-hover/bento:translate-x-2 transition duration-200">
                    <Image
                      className="w-full h-auto flex-none rounded-xl bg-gray-50"
                      src={
                        mangosqueezy.metadata.metadata.ytChannelStats[0].snippet.thumbnails.high.url
                      }
                      width={200}
                      height={200}
                      alt=""
                    />
                    <Link
                      href={`/affiliates/${mangosqueezy.metadata.social_media_profiles.youtube}/${mangosqueezy.metadata.metadata.ytChannelStats[0].id.videoId}`}
                    >
                      <div className="font-sans font-bold text-neutral-600 dark:text-neutral-200 mb-2 mt-2">
                        {mangosqueezy.metadata.first_name}
                      </div>
                      <div className="font-sans font-normal text-neutral-600 text-sm dark:text-neutral-300">
                        {mangosqueezy.metadata.description}
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
