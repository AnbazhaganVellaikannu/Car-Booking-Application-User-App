export const VEHICLE_TYPES = [
  {
    id: 'bike',
    name: 'Bike',
    description: 'Quick and affordable for one',
    capacity: 1,
    baseFare: 15,
    perKmRate: 6,
    etaMin: 2,
    image: '/vehicles/bike.svg',
  },
  {
    id: 'economy',
    name: 'Economy',
    description: 'Everyday rides, up to 4 seats',
    capacity: 4,
    baseFare: 35,
    perKmRate: 11,
    etaMin: 3,
    image: '/vehicles/economy.svg',
  },
  {
    id: 'comfort',
    name: 'Comfort',
    description: 'Newer cars, extra legroom',
    capacity: 4,
    baseFare: 55,
    perKmRate: 15,
    etaMin: 4,
    image: '/vehicles/comfort.svg',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Top-rated drivers, luxury cars',
    capacity: 4,
    baseFare: 95,
    perKmRate: 21,
    etaMin: 5,
    image: '/vehicles/premium.svg',
  },
];

export function getVehicleType(id) {
  return VEHICLE_TYPES.find((v) => v.id === id);
}
