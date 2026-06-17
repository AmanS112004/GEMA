import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Enquiry } from '../models/Enquiry';

export const submitEnquiry = async (req: Request, res: Response): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : '',
        message: err.msg,
      })),
    });
    return;
  }

  const { name, email, phone } = req.body;

  try {
    // Check if duplicate enquiry exists with the same email
    const existingEnquiry = await Enquiry.findOne({ email: email.toLowerCase() });
    if (existingEnquiry) {
      res.status(409).json({
        success: false,
        errors: [{ field: 'email', message: 'This email is already registered for the workshop.' }],
      });
      return;
    }

    const newEnquiry = new Enquiry({
      name,
      email: email.toLowerCase(),
      phone,
    });

    await newEnquiry.save();

    res.status(201).json({
      success: true,
      message: 'Registration submitted',
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    res.status(500).json({
      success: false,
      errors: [{ field: 'server', message: 'An internal server error occurred. Please try again later.' }],
    });
  }
};
