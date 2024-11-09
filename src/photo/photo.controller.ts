import { Controller, Post, UseInterceptors, UploadedFile, Body, Get, Delete, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotoService } from './photo.service';
import { diskStorage } from 'multer';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { User } from '../user/entities/user';
import { JwtAuthGuard } from 'src/auth/jwt-auth/jwt-auth.guard';


@ApiTags('photos')
@ApiBearerAuth()
@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotoController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload a photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueSuffix + '-' + file.originalname);
        },
      }),
      limits: { fileSize: 1024 * 1024 * 1024 },
      fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
          cb(null, true);
        } else {
          cb(new Error('Only JPEG or PNG files are allowed!'), false);
        }
      },
    }),
  )
  async uploadPhoto(@Req() req, @UploadedFile() file: Express.Multer.File) {
    const user: User = req.user; 
    return await this.photoService.savePhoto(user, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all photos of the logged-in user' })
  async getPhotos(@Req() req) {
    const user: User = req.user;
    return await this.photoService.getUserPhotos(user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a photo by id' })
  @ApiParam({ name: 'id', type: 'string' })
  async deletePhoto(@Req() req, @Param('id', ParseIntPipe) id: string) {
    const user: User = req.user;
    return await this.photoService.deletePhoto(user, id);
  }
}
