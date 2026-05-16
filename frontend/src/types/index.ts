export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
}

export interface Comment {
  _id: string;
  user: { _id: string; name: string };
  text: string;
  date: string;
}

export interface Post {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  content: string;
  likes: string[];
  comments: Comment[];
  createdAt: string;
}
