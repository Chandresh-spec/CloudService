export interface User {
  id?: string;
  name: string;
  email: string;
  is_verified: boolean;
  status?: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  otp?: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  message: string;
}

export interface StorageFolder {
  id: string;
  name: string;
  itemCount: number;
  color: string;
  icon?: string;
}

export type FileCategory = 'all' | 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'other';

export interface StorageFile {
  id: string;
  name: string;
  size: number; // in bytes
  type: FileCategory;
  extension: string;
  mime: string;
  updatedAt: string;
  starred: boolean;
  shared: boolean;
  folderId?: string;
  url?: string;
  checksum?: string;
}

export interface UploadProgressItem {
  id: string;
  name: string;
  size: number;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  speed?: string;
}
