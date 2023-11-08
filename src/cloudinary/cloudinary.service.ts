import { Injectable } from '@nestjs/common';
import { CloudinaryResponse } from './models/cloudinary-response.model';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  uploadFromRemote(url: string): Promise<UploadApiResponse> {
    return cloudinary.uploader.upload(url);
  }

  destroy(publicId: string): Promise<unknown> {
    return cloudinary.uploader.destroy(publicId);
  }
}
