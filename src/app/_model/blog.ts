import { BlogCategory } from "./blog-category";
import { Id } from "./id";


export class Blog {
  bId: string;
  _id: Id;
  slug?: string;
  title: string;
  blogCategory: BlogCategory;
  subTitle: string;
  content: string;
  tags: string[];
  date: string;
  dateFormat?: string;
  view: number;
  pictureUrl: string;
  status: boolean;
}
