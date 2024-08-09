export type Book = {
  title: string;
  authors: string;
  description: string;
  etag: string;
  category: string[];
};

export type Review = {
  title: string;
  content: string;
  meta: {
    title: string;
    authors: string;
    etag: string;
  };
  username: string;
  uuid: string;
  liked: string[];
};

export type ImagePropItem = {
  url: string;
  style: object;
};

export type ReviewPropItem = {
  review: Review;
  key: number;
  uuid: string;
};
