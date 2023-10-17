import { v2 as cloudinary } from 'cloudinary';
import { ApiConfigService } from '../../api-config/api-config.service';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  inject: [ApiConfigService],
  useFactory: (apiConfigService: ApiConfigService) => {
    return cloudinary.config({
      cloud_name: apiConfigService.cloudinary.name,
      api_key: apiConfigService.cloudinary.apiKey,
      api_secret: apiConfigService.cloudinary.apiSecret,
    });
  },
};
