import { diskStorage } from 'multer';
import { extname } from 'path';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

export const arrayFiles = [{ name: 'file', maxCount: 10 }];

export const localOptions: MulterOptions = {
  storage: diskStorage({
    destination: './uploads/uploads',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
      if (file.fieldname === 'file') {
        req.body.file = `${randomName}${extname(file.originalname)}`;
      }
      cb(null, `${randomName}${extname(file.originalname)}`);
    },
  }),
};
