import { useState, useEffect } from "react";
import { SocialMediaPost } from "./post";
import { Post } from "./post.types";
import { api } from "@/api/api";

export function SocialMediaNetworkPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleNewPost = (post: Post) => {
    setPosts([...posts, post]);
  };

  api.event.on("networkPost", (event) => handleNewPost(event.post));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Social Media Feed</h1>
      <div className="max-w-2xl mx-auto">
        {posts.map((post) => (
          <SocialMediaPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
