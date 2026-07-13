// Free, keyless World Bank Open Data API integration for Geographic Analysis.
// https://api.worldbank.org/v2/

export interface CountryGeo {
  name: string;
  iso2Code: string;
  latitude: number;
  longitude: number;
  region: string;
  incomeLevel: string;
}

export interface WorldBankIndicator {
  indicator: string;
  year: number | null;
  value: number | null;
}

export interface WorldBankSnapshot {
  country: CountryGeo | null;
  population: WorldBankIndicator;
  gdpUsd: WorldBankIndicator;
  gdpPerCapitaUsd: WorldBankIndicator;
  gdpGrowthPct: WorldBankIndicator;
}

const WB_BASE = "https://api.worldbank.org/v2";

async function fetchJson(url: string) {
  const res = await fetch(url, { next: { revalidate: 60 * 60 * 24 } });
  if (!res.ok) throw new Error(`World Bank API error: ${res.status}`);
  return res.json();
}

interface RawCountry {
  id: string;
  iso2Code: string;
  name: string;
  region: { id: string; value: string };
  incomeLevel: { value: string };
  longitude: string;
  latitude: string;
}

let countryListCache: RawCountry[] | null = null;

async function getAllCountries(): Promise<RawCountry[]> {
  if (countryListCache) return countryListCache;
  const data = await fetchJson(`${WB_BASE}/country?format=json&per_page=400`);
  const list: RawCountry[] = (data?.[1] ?? []).filter((c: RawCountry) => c.region.id !== "NA");
  countryListCache = list;
  return list;
}

export async function lookupCountry(query: string): Promise<CountryGeo | null> {
  try {
    const normalized = query.trim().toLowerCase();
    const countries = await getAllCountries();

    const entry =
      countries.find((c) => c.iso2Code.toLowerCase() === normalized || c.id.toLowerCase() === normalized) ??
      countries.find((c) => c.name.toLowerCase() === normalized) ??
      countries.find((c) => c.name.toLowerCase().includes(normalized) || normalized.includes(c.name.toLowerCase()));

    if (!entry) return null;
    return {
      name: entry.name,
      iso2Code: entry.iso2Code,
      latitude: parseFloat(entry.latitude) || 0,
      longitude: parseFloat(entry.longitude) || 0,
      region: entry.region?.value ?? "Unknown",
      incomeLevel: entry.incomeLevel?.value ?? "Unknown",
    };
  } catch {
    return null;
  }
}

async function latestIndicator(iso2: string, code: string, label: string): Promise<WorldBankIndicator> {
  try {
    const data = await fetchJson(
      `${WB_BASE}/country/${iso2}/indicator/${code}?format=json&per_page=20`
    );
    const points: { date: string; value: number | null }[] = data?.[1] ?? [];
    const latest = points.find((p) => p.value !== null);
    return {
      indicator: label,
      year: latest ? parseInt(latest.date, 10) : null,
      value: latest ? latest.value : null,
    };
  } catch {
    return { indicator: label, year: null, value: null };
  }
}

export async function getCountrySnapshot(countryQuery: string): Promise<WorldBankSnapshot> {
  const country = await lookupCountry(countryQuery);
  if (!country) {
    return {
      country: null,
      population: { indicator: "Population", year: null, value: null },
      gdpUsd: { indicator: "GDP (current US$)", year: null, value: null },
      gdpPerCapitaUsd: { indicator: "GDP per capita (current US$)", year: null, value: null },
      gdpGrowthPct: { indicator: "GDP growth (annual %)", year: null, value: null },
    };
  }

  const [population, gdpUsd, gdpPerCapitaUsd, gdpGrowthPct] = await Promise.all([
    latestIndicator(country.iso2Code, "SP.POP.TOTL", "Population"),
    latestIndicator(country.iso2Code, "NY.GDP.MKTP.CD", "GDP (current US$)"),
    latestIndicator(country.iso2Code, "NY.GDP.PCAP.CD", "GDP per capita (current US$)"),
    latestIndicator(country.iso2Code, "NY.GDP.MKTP.KD.ZG", "GDP growth (annual %)"),
  ]);

  return { country, population, gdpUsd, gdpPerCapitaUsd, gdpGrowthPct };
}
