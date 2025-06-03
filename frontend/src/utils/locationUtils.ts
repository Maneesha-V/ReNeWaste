import locations from "../../src/data/locationData.json";

export const getTaluks = () => {
  return locations.taluks.map((t) => t.name);
};

export const getMunicipalityByTaluk = (talukName: string) => {
  return locations.taluks.find((t) => t.name === talukName)?.municipality || '';
};

export const getPanchayatsByTaluk = (talukName: string) => {
  return locations.taluks.find((t) => t.name === talukName)?.panchayats || [];
};