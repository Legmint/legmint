import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);
  private readonly s3Client: S3Client;
  private readonly bucket: string;
  private readonly previewBucket: string;
  private readonly region: string;

  constructor(private configService: ConfigService) {
    this.region = this.configService.get('AWS_REGION', 'eu-west-1');
    this.bucket = this.configService.get('S3_BUCKET', 'legmint-documents');
    this.previewBucket = this.configService.get(
      'S3_PREVIEW_BUCKET',
      'legmint-previews',
    );

    this.s3Client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  /**
   * Upload a document to S3
   */
  async uploadDocument(
    key: string,
    buffer: Buffer,
    contentType: string,
    isPreview = false,
  ): Promise<string> {
    const bucketName = isPreview ? this.previewBucket : this.bucket;

    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ContentType: contentType,
      });

      await this.s3Client.send(command);

      this.logger.log(`Uploaded document to S3: ${bucketName}/${key}`);

      return `https://${bucketName}.s3.${this.region}.amazonaws.com/${key}`;
    } catch (error) {
      this.logger.error(`Failed to upload document to S3: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate a signed URL for document access
   */
  async getSignedUrl(
    key: string,
    expiresIn: number = 86400,
    isPreview = false,
  ): Promise<string> {
    const bucketName = isPreview ? this.previewBucket : this.bucket;

    try {
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
      });

      const url = await getSignedUrl(this.s3Client, command, { expiresIn });

      this.logger.log(`Generated signed URL for: ${bucketName}/${key}`);

      return url;
    } catch (error) {
      this.logger.error(`Failed to generate signed URL: ${error.message}`);
      throw error;
    }
  }

  /**
   * Upload and get signed URL in one operation
   */
  async uploadAndGetSignedUrl(
    key: string,
    buffer: Buffer,
    contentType: string,
    expiresIn: number = 86400,
    isPreview = false,
  ): Promise<string> {
    await this.uploadDocument(key, buffer, contentType, isPreview);
    return this.getSignedUrl(key, expiresIn, isPreview);
  }

  /**
   * Generate standard S3 key for user document
   */
  generateUserDocKey(userId: string, templateCode: string, extension = 'pdf'): string {
    const timestamp = Date.now();
    return `users/${userId}/docs/${templateCode}/${timestamp}.${extension}`;
  }

  /**
   * Generate standard S3 key for lawyer review
   */
  generateLawyerReviewKey(lawyerId: string, referralId: string, extension = 'pdf'): string {
    const timestamp = Date.now();
    return `lawyers/${lawyerId}/reviews/${referralId}_${timestamp}.${extension}`;
  }

  /**
   * Generate standard S3 key for lawyer application documents
   */
  generateApplicationDocKey(
    applicationId: string,
    documentType: string,
    extension: string,
  ): string {
    const timestamp = Date.now();
    return `lawyer-applications/${applicationId}/${documentType}_${timestamp}.${extension}`;
  }
}
