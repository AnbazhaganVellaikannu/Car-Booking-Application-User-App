import { Router } from 'express';
import { VEHICLE_TYPES } from '../lib/vehicleTypes.js';

export const vehicleTypesRouter = Router();

vehicleTypesRouter.get('/', (req, res) => {
  res.json(VEHICLE_TYPES);
});
