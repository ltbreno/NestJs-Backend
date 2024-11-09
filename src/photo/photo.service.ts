import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Photo } from './entities/photo/photo';
import { User } from '../user/entities/user';
import * as fs from 'fs';
import { promisify } from 'util';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>,
  ) {}

  async savePhoto(user: User, file: Express.Multer.File): Promise<Photo> {
    const photo = this.photoRepository.create({
      url: `/uploads/${file.filename}`,
      fileName: file.filename,
      user: user,
    });
    return await this.photoRepository.save(photo);
  }

  async getUserPhotos(user: User): Promise<Photo[]> {
    return await this.photoRepository.find({
      where: { user },
      order: { createdAt: 'DESC' },
    });
  }

  async deletePhoto(user: User, photoId: string): Promise<string> {
    const photo = await this.photoRepository.findOne({ where: { id: photoId }, relations: ['user'] });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.user.id !== user.id) {
      throw new UnauthorizedException('You do not have permission to delete this photo');
    }

    const unlinkAsync = promisify(fs.unlink);

    try {
      await unlinkAsync(`uploads/${photo.fileName}`);
      await this.photoRepository.delete(photoId);
      return 'Photo deleted successfully';
    } catch (error) {
      throw new Error('Error deleting file from server');
    }
  }
}
