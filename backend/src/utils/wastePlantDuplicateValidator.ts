import { IWastePlantRepository } from "../repositories/wastePlant/interface/IWastePlantRepository";

export async function checkForDuplicateWastePlant(
  data: {
    email: string;
    licenseNumber: string;
    plantName: string;
  },
  repository: IWastePlantRepository,
): Promise<void> {
  const { email, licenseNumber, plantName } = data;

  const [byEmail, byLicense, byName] = await Promise.all([
    repository.findWastePlantByEmail(email),
    repository.findWastePlantByLicense(licenseNumber),
    repository.findWastePlantByName(plantName),
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
