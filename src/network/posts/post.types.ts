export interface Post {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  author_id: number;
}

export interface SocialMediaPostProps {
  post: Post;
}
