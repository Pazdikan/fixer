export interface Post {
  id: string;
  content: string;
  timestamp: string;
  author_id: number;
}

export interface SocialMediaPostProps {
  post: Post;
}
