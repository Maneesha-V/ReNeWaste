"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkForDuplicateWastePlant = checkForDuplicateWastePlant;
async function checkForDuplicateWastePlant(data, repository) {
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
