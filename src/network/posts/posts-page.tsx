import { useEffect, useState } from "preact/compat";
import { SocialMediaPost } from "./post";
import { Post } from "./post.types";
import { eventEmitter } from "@/common/lib/event-emitter";
import { NewSocialMediaPostEvent } from "@/event/network/new-socialmedia-post-event";

export function SocialMediaNetworkPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const handleNewPost = (post: Post) => {
    setPosts((prevPosts) => [...prevPosts, post]);

    console.log(`Posts: ${posts.length}`)
  };

  useEffect(() => {
    eventEmitter.on(new NewSocialMediaPostEvent().getID(), handleNewPost);

    return () => {
      eventEmitter.off(new NewSocialMediaPostEvent().getID(), handleNewPost);
    };
  });

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
