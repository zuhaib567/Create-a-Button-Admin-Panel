export interface IImageItem {
  _id: string;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ImageResponse {
  success: boolean;
  result: IImageItem[];
}

export interface IAddImage {
  url: string;
  name: string;
}

export interface ImageRes {
  _id: string;
  url: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface IAddImageResponse {
  status: string;
  message: string;
  data: ImageRes;
}

export interface IImageDeleteRes {
  success?: boolean;
  message?: string;
}
