import { Router } from 'express'
import { upload } from '../config/multer'
import { handlePdfUpload } from '../controller/uploadController'

const router = Router();

router.post('/', upload.single('file'), handlePdfUpload)

export default router;