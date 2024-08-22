import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { HttpException, HttpStatus } from '@nestjs/common';

export const multerOptions: MulterOptions = {
  storage: diskStorage({
    destination: '../../public/images',
    filename: (req, file, cb) => {
      const fileExtName = extname(file.originalname);
      const mimetype = file.mimetype
      const randomName = uuidv4();
      console.log(fileExtName);
      console.log(mimetype);

      console.log(!fileExtName.includes('.png'));
      console.log(!mimetype.includes('image/png'));

      if ((
        !fileExtName.includes('.jpg') ||
        !mimetype.includes('image/jpg')) &&
        (
          !fileExtName.includes('.jpg') ||
          !mimetype.includes('image/jpeg')) &&
        (
          !fileExtName.includes('.png') ||
          !mimetype.includes('image/png')
        )) {
        cb(new HttpException('Only images are allowed', HttpStatus.NOT_ACCEPTABLE), file.filename);
      }
      cb(null, `${randomName}${fileExtName}`);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB
  },
};
