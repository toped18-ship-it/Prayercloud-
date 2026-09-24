import { Country, UPG } from "../types";
import { ALL_COUNTRIES } from "./fullCountryList";

export const COUNTRIES_SEED: Country[] = ALL_COUNTRIES;

export const MOCK_UPGS: UPG[] = [
  {
    id: "pashtun",
    countryId: "af",
    name: "Pashtun",
    population: 15400000,
    language: "Pashto",
    religion: "Islam",
    status: "Unreached"
  },
  {
    id: "brahmin",
    countryId: "in",
    name: "Brahmin",
    population: 60000000,
    language: "Hindi",
    religion: "Hinduism",
    status: "Unreached"
  }
];
