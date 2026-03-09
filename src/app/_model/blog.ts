import { BlogCategory } from "./blog-category";
import { Id } from "./id";


export class Blog {
  bId: string;
  _id: Id;
  title: string;
  blogCategory: BlogCategory;
  subTitle: string;
  content: string;
  tags: string[];
  date: string;
  view: number;
  pictureUrl: string;
  status: boolean;
}
