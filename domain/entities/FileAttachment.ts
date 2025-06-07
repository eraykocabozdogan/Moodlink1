export interface FileAttachment {
  id: string;
  name: string;
  path: string;
  extension: string;
  size: number;
  mimeType: string;
  storageType: StorageType;
  fileType: FileType;
  uploaderId?: string;
  url: string;
  uploadedAt: Date;
}

export enum StorageType {
  Local = 0,
  Azure = 1,
  AWS = 2,
}

export enum FileType {
  Image = 0,
  Video = 1,
  Document = 2,
  Audio = 3,
}
