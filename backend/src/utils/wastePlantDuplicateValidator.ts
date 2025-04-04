import WastePlantRepository from '../repositories/wastePlant/wastePlantRepository';

export async function checkForDuplicateWastePlant(data: {
  email: string;
  licenseNumber: string;
  plantName: string;
}) {
  const { email, licenseNumber, plantName } = data;

  const [byEmail, byLicense, byName] = await Promise.all([
    WastePlantRepository.findWastePlantByEmail(email),
    WastePlantRepository.findWastePlantByLicense(licenseNumber),
    WastePlantRepository.findWastePlantByName(plantName),
  ]);

  if (byEmail) {
    throw new Error("A waste plant with this email already exists.");
  }

  if (byLicense) {
    throw new Error("A waste plant with this license number already exists.");
  }

  if (byName) {
    throw new Error("A waste plant with this plant name already exists.");
  }
}
