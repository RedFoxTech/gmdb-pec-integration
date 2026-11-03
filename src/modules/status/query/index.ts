import {
  queryPatient,
  queryVaccination,
  queryImmunobiological,
  queryDose,
} from "../../../query";

export const queryPatientLength = `
  with patients as (${queryPatient})
  SELECT COUNT(*) FROM patients; 
`;

export const queryVaccinationLength = `
  with vaccinations as (${queryVaccination})
  SELECT COUNT(*) FROM vaccinations; 
`;

export const queryImmunobiologicalLength = `
  with immunobiologicals as (${queryImmunobiological})
  SELECT COUNT(*) FROM immunobiologicals; 
`;

export const queryDoseLength = `
  with doses as (${queryDose})
  SELECT COUNT(*) FROM doses; 
`;
