import { Post } from "@/network/posts/post.types";
import { BaseEvent } from "../event";

export interface NetworkPostEvent extends BaseEvent {
  type: "networkPost";
  post: Post
}
