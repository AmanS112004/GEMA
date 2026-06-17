import { Router } from 'express';
import { submitEnquiry } from '../controllers/enquiryController';
import { validateEnquiry } from '../validators/enquiryValidator';

const router = Router();

router.post('/enquiry', validateEnquiry, submitEnquiry);

export default router;
