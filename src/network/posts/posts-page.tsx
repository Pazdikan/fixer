import { useEffect, useState } from "preact/compat";
import { SocialMediaPost } from "./post";
import { Post } from "./post.types";
import { eventEmitter } from "@/common/lib/event-emitter";

export function SocialMediaNetworkPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleNewPost = (post: Post) => {
    setPosts((prevPosts) => [...prevPosts, post]);
  };

  useEffect(() => {
    eventEmitter.on("newPost", handleNewPost);

    return () => {
      eventEmitter.off("newPost", handleNewPost);
    };
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Social Media Feed</h1>
      <div className="max-w-2xl mx-auto">
        {posts.reverse().map((post) => (
          <SocialMediaPost key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
