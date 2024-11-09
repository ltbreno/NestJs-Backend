import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { getDistance } from 'geolib';  // Corrigido: Importar função diretamente
import { LocationEntity } from './entities/location.entity';
import { GeocodingService } from '../geocoding/geocoding.service';
import { User } from '../user/entities/user';

@Injectable()
export class LocationService {
    constructor(
        @InjectRepository(LocationEntity)
        private locationRepository: Repository<LocationEntity>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private geocodingService: GeocodingService,
    ) {}

    async createLocationForUser(userId: string, name: string): Promise<LocationEntity> {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error('User not found'); 
        }

        const { latitude, longitude } = await this.geocodingService.geocodeAddress(user.address);

        const location = this.locationRepository.create({ latitude, longitude, name, user });
        return this.locationRepository.save(location);
    }

    // Filtra localizações por distância
    async filterByDistance(userLatitude: number, userLongitude: number, radius: number): Promise<LocationEntity[]> {
        const allLocations = await this.locationRepository.find();

        // Filtra as localizações com base na distância
        const filteredLocations = allLocations.filter((location) => {
            const distance = getDistance(
                { latitude: userLatitude, longitude: userLongitude },
                { latitude: location.latitude, longitude: location.longitude }
            );

            return distance <= radius;
        });

        return filteredLocations;
    }    
}
