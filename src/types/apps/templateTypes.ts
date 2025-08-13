export interface ITemplateItem {
  _id: string;
  img: string;
  parent: string;
  children: string[];
  description: string;
  products?: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TemplateResponse {
  data: any;
  success: boolean;
  result: ITemplateItem[];
}

export interface IAddTemplate {
  img?: string;
  json_file: string;
  name: string;
  category: string;
  tags: any;
}

export interface TemplateRes {
  data: any;
  templateJson: string | undefined;
  templateThumbnail: string | undefined;
  templateName: string | undefined;
  templateCategory: string | undefined;
  templateTags: string[] | undefined;
  _id: string;
  img: string;
  json_file: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddTemplateResponse {
  status: string;
  message: string;
  data: TemplateRes;
  tags: any[];
}

export interface ITemplateDeleteRes {
  success?: boolean;
  message?: string;
}
