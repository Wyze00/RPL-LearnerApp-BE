export interface GetCourseQuery {
    search?: string | undefined;
    orderBy?: string | undefined;
    skip?: number;
    take?: number;
}


export interface CreateCourseRequest {
  title: string;
  description: string;
  preview_video_link: string;
  price: number;
}

export interface UpdateCourseRequest {
  title: string;
  description: string;
  preview_video_link: string;
  price: number;
}

export interface CreateVideoRequest {
  title: string;
  link: string;
  duration: number;
  order: number;
}

export interface UpdateVideoRequest {
  title: string;
  link: string;
  order: number;
  duration: number;
}
