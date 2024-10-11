import * as admin from "firebase-admin";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { Logger } from "winston";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class FirebaseService {
  constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {
    const serviceAccount = require(
      process.cwd() + "/config/firebase/credentials.json",
    );

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: "umrohin-27946.appspot.com",
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<string> {
    const bucket = admin.storage().bucket();
    const randomName = `${uuidv4()}${file.originalname.substring(file.originalname.lastIndexOf("."))}`;
    const fileUpload = bucket.file(randomName);
    await fileUpload.save(file.buffer);
    this.logger.info(`Uploaded file: ${randomName}`);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(randomName)}?alt=media`;
  }

  async deleteFile(publicUrl: string): Promise<void> {
    const bucket = admin.storage().bucket();

    const fileName = decodeURIComponent(
      publicUrl.split("/o/")[1].split("?")[0],
    );
    const file = bucket.file(fileName);

    try {
      await file.delete();
      this.logger.info(`Deleted file: ${fileName}`);
    } catch (error) {
      throw new NotFoundException(`File not found: ${fileName}`);
    }
  }

  async uploadMany(files: Express.Multer.File[]): Promise<string[]> {
    const uploadPromises = files.map((file) => this.uploadFile(file));
    const urls = await Promise.all(uploadPromises);
    this.logger.info(`Uploaded ${files.length} files`);
    return urls;
  }

  async deleteMany(fileNames: string[]): Promise<void> {
    const deletePromises = fileNames.map((fileName) =>
      this.deleteFile(fileName),
    );
    await Promise.all(deletePromises);
    this.logger.info(`Deleted ${fileNames.length} files`);
  }
}
