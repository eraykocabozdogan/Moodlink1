export interface PageResponseDto<T> {
  items: T[];
  index: number;
  size: number;
  count: number;
  pages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface BaseResponseDto {
  isSuccess: boolean;
  message?: string;
}

export interface FileInfoDto {
  id: string;
  name: string;
  path: string;
  extension: string;
  size: number;
  mimeType: string;
  storageType: number;
  fileType: number;
  url: string;
  uploadedAt: Date;
}
