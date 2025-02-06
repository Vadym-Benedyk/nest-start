export interface PostInterface extends CreatePostInterface {
  id: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreatePostInterface {
  title: string;
  content: string;
  userId: string;
}