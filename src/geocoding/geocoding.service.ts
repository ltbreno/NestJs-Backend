import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';  
import { map } from 'rxjs/operators';

@Injectable()
export class GeocodingService {
  private readonly apiKey = 'SUA_GOOGLE_MAPS_API_KEY';

  constructor(private readonly httpService: HttpService) {}  // Injeção correta do HttpService

  async geocodeAddress(address: string): Promise<{ latitude: number; longitude: number }> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${this.apiKey}`;
    
    // Faz a requisição usando HttpService
    const response = await this.httpService.get(url).pipe(map(response => response.data)).toPromise();
    const data = response;

    if (data.status === 'OK') {
      const location = data.results[0].geometry.location;
      return {
        latitude: location.lat,
        longitude: location.lng,
      };
    } else {
      throw new Error('Geocoding failed');
    }
  }
}
