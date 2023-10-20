import { createHash } from 'crypto';

import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { CannotDownloadFileException } from '../../src/domain/exception/storage/cannot-download-file-exception';
import { StorageService } from '../../src/infrastructure/service/storage.service';

const hashBuffer = (buffer: Buffer): string => {
  return createHash('sha256').update(buffer).digest('hex');
};

const scopedString = (str: string): string => {
  const randomString = Math.random().toString(36).substring(7);
  return `${randomString}-${str}`;
};

const generateRandomBuffer = (
  size: number,
): { buffer: Buffer; hash: string } => {
  const buffer = Buffer.alloc(size);
  for (let i = 0; i < size; i++) {
    buffer[i] = Math.floor(Math.random() * 256);
  }
  const hash = hashBuffer(buffer);
  return { buffer, hash };
};

describe('StorageService (e2e)', () => {
  let app: INestApplication;
  let buffer: Buffer;
  let hash: string;
  let storageService: StorageService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { buffer: _buffer, hash: _hash } = generateRandomBuffer(1024 * 4);
    buffer = _buffer;
    hash = _hash;

    storageService = moduleFixture.get<StorageService>(StorageService);
  });

  it('should upload file', async () => {
    const key = scopedString(`${hash}.txt`);
    await storageService.uploadFile(buffer, key);
  });

  it('should download file', async () => {
    const key = scopedString(`${hash}.txt`);
    await storageService.uploadFile(buffer, key);
    const downloadedBuffer = await storageService.downloadFile(key);
    expect(hashBuffer(downloadedBuffer)).toEqual(hash);
  });

  it('should delete file', async () => {
    const key = scopedString(`${hash}.txt`);
    await storageService.uploadFile(buffer, key);
    await storageService.deleteFile(key);
    try {
      await storageService.downloadFile(key);
    } catch (error) {
      expect(error.constructor.name).toEqual(CannotDownloadFileException.name);
    }
  });

  it('should check if file exists', async () => {
    const key = scopedString(`${hash}.txt`);
    await storageService.uploadFile(buffer, key);
    const exists = await storageService.isFileExists(key);
    expect(exists).toBeTruthy();

    const nonExistsKey = key + 'non-exists';
    const nonExists = await storageService.isFileExists(nonExistsKey);
    expect(nonExists).toBeFalsy();
  });

  afterAll(async () => {
    await app.close();
  });
});
