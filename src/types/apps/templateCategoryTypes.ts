export interface ICategoryItem {
  _id: string;
  name: string;
  // description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryResponse {
  success: boolean;
  result: ICategoryItem[];
}

export interface IAddCategory {
  name: string;
  // description: string;
}

export interface CategoryRes {
  result: any;
  _id: string;
  name: string;
  // description: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddCategoryResponse {
  status: string;
  message: string;
  data: CategoryRes;
}

export interface ICategoryDeleteRes {
  success?: boolean;
  message?: string;
}
