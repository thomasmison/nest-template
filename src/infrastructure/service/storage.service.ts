import 'dotenv/config';

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import { CannotDeleteFileException } from '../../domain/exception/storage/cannot-delete-file-exception';
import { CannotDownloadFileException } from '../../domain/exception/storage/cannot-download-file-exception';
import { CannotUploadFileException } from '../../domain/exception/storage/cannot-upload-file.exception';

@Injectable()
export class StorageService {
  private s3: S3Client;
  private readonly bucketName: string;
  private readonly prefix: string;

  constructor() {
    this.s3 = new S3Client({
      endpoint: process.env.S3_ENDPOINT_URL as string,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
      },
      region: process.env.S3_REGION,
      // Depending on S3 Provider, you may need to change the forcePathStyle to true, Ex: Minio
      forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    });
    this.bucketName = process.env.S3_BUCKET_NAME as string;
    this.prefix = process.env.S3_PREFIX as string;
  }

  async uploadFile(fileBuffer: Buffer, key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: `${this.prefix}${key}`,
      Body: fileBuffer,
    };

    try {
      const command = new PutObjectCommand(params);
      await this.s3.send(command);
    } catch (error) {
      throw new CannotUploadFileException(error.message);
    }
  }

  async downloadFile(key: string): Promise<Buffer> {
    const params = {
      Bucket: this.bucketName,
      Key: `${this.prefix}${key}`,
    };

    try {
      const command = new GetObjectCommand(params);
      const response = await this.s3.send(command);
      const stream = response.Body;
      const byteArray = await stream.transformToByteArray();
      return Buffer.from(byteArray);
    } catch (error) {
      throw new CannotDownloadFileException(error.message);
    }
  }

  async deleteFile(key: string): Promise<void> {
    const params = {
      Bucket: this.bucketName,
      Key: `${this.prefix}${key}`,
    };

    try {
      const command = new DeleteObjectCommand(params);
      await this.s3.send(command);
    } catch (error) {
      throw new CannotDeleteFileException(error.message);
    }
  }

  async isFileExists(key: string): Promise<boolean> {
    const params = {
      Bucket: this.bucketName,
      Key: `${this.prefix}${key}`,
    };

    try {
      const command = new HeadObjectCommand(params);
      await this.s3.send(command);
      return true;
    } catch (error) {
      if (error.name === 'NotFound') {
        return false;
      }
      throw error;
    }
  }
}
