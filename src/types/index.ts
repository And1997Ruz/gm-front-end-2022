export type User = {
  _id: string;
  name: string;
  phone: string;
  email: string;
  userPicture?: string;
};

export type Item = {
  _id: string;
  name: string;
  description: string;
  price: string;
  seller: User;
  category: Category;
  itemPicture?: string[];
  dateOfPost: string;
};

export type Category = {
  _id: string;
  name: string;
  iconPath: string;
};

export type Token = {
  iat: number;
  _id: string;
};
