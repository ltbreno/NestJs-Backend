import { Controller, Post, Get, Param, Body, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LocationService } from './location.service';
import { LocationEntity } from './entities/location.entity';

@ApiTags('locations') // Tag do Swagger para documentar a rota
@Controller('locations')
export class LocationController {
    constructor(private readonly locationService: LocationService) {}

    @Post('create/:userId')
    @ApiOperation({ summary: 'Cria uma nova localização para o usuário' }) 
    async createLocationForUser(
        @Param('userId') userId: string,
        @Body('name') name: string,
    ): Promise<LocationEntity> {
        return this.locationService.createLocationForUser(userId, name);
    }

    @Get('filter')
    @ApiOperation({ summary: 'Filtra localizações por distância a partir de uma localização' })  // Descrição no Swagger
    async filterLocationsByDistance(
        @Query('latitude') latitude: number, 
        @Query('longitude') longitude: number, 
        @Query('radius') radius: number, 
    ): Promise<LocationEntity[]> {
        return this.locationService.filterByDistance(latitude, longitude, radius);
    }
}
