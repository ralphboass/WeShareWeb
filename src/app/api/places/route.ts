import { NextResponse } from "next/server";
import { parseAddress } from "@/lib/smart-location";

/**
 * Place lookup for the pickup/drop-off fields, proxied server-side so the
 * upstream provider sees one identifiable caller and responses can be cached.
 *
 * Photon (OpenStreetMap) needs no API key. To move to Google Places later,
 * only `search()` below has to change — the response shape is what the UI
 * depends on.
 */

const PHOTON_ENDPOINT = "https://photon.komoot.io/api/";

// Bias results towards Los Angeles, like the app's MapKit region does.
const BIAS_LAT = 34.0522;
const BIAS_LON = -118.2437;

const STATE_ABBREVIATIONS: Record<string, string> = {
  California: "CA",
  Nevada: "NV",
  Arizona: "AZ",
  Oregon: "OR",
  Washington: "WA",
  Utah: "UT",
  Idaho: "ID",
  Colorado: "CO",
  "New Mexico": "NM",
  Texas: "TX",
};

/**
 * MapKit (used by the app) abbreviates street types; Photon spells them out.
 * Normalising here keeps stored addresses consistent between app and web, and
 * lets the AddressParser landmark patterns — written against the abbreviated
 * form, e.g. "Hilgard Ave, 405" — actually match.
 */
const STREET_TYPES: Array<[RegExp, string]> = [
  [/\bAvenue\b/g, "Ave"],
  [/\bStreet\b/g, "St"],
  [/\bBoulevard\b/g, "Blvd"],
  [/\bDrive\b/g, "Dr"],
  [/\bRoad\b/g, "Rd"],
  [/\bCourt\b/g, "Ct"],
  [/\bCircle\b/g, "Cir"],
  [/\bParkway\b/g, "Pkwy"],
  [/\bPlace\b/g, "Pl"],
  [/\bTerrace\b/g, "Ter"],
  [/\bHighway\b/g, "Hwy"],
  [/\bLane\b/g, "Ln"],
];

const abbreviateStreet = (street: string) =>
  STREET_TYPES.reduce(
    (result, [pattern, replacement]) => result.replace(pattern, replacement),
    street,
  );

export interface PlaceSuggestion {
  id: string;
  /** Recognisable short name, e.g. "UCLA" or "Westwood" */
  label: string;
  /** Full address in the app's format: "Street, Number, City, State" */
  address: string;
  /** City, stored as the ride's `departure` / `destination` */
  city: string;
  /** Human-readable line shown under the label in the dropdown */
  context: string;
  latitude?: number;
  longitude?: number;
}

interface PhotonProperties {
  osm_id?: number;
  osm_key?: string;
  name?: string;
  housenumber?: string;
  street?: string;
  city?: string;
  district?: string;
  county?: string;
  state?: string;
  postcode?: string;
  countrycode?: string;
}

interface PhotonFeature {
  properties: PhotonProperties;
  geometry?: { coordinates?: [number, number] };
}

function toSuggestion(feature: PhotonFeature): PlaceSuggestion | null {
  const p = feature.properties;
  if (p.countrycode && p.countrycode !== "US") return null;

  const city = p.city ?? p.district ?? p.county ?? "";
  const state = p.state ? (STATE_ABBREVIATIONS[p.state] ?? p.state) : "";
  const street = abbreviateStreet(p.street ?? p.name ?? "");
  if (!street && !city) return null;

  // "Street, Number, City, State" — the order MapKit produces in the app, and
  // the order the AddressParser landmark patterns are written for.
  const address = [
    street,
    p.housenumber,
    city,
    state,
  ]
    .filter(Boolean)
    .join(", ");

  const poiName = p.name && p.name !== p.street ? p.name : "";
  const smart = parseAddress(address, city || poiName);

  // Prefer the recognisable label the rides themselves show ("LAX", "UCLA",
  // "Westwood"), so picking a suggestion produces a term that matches listings.
  const recognised = smart && smart !== city ? smart : "";

  return {
    id: `${p.osm_id ?? address}-${p.osm_key ?? ""}`,
    label: recognised || poiName || city,
    address,
    city: city || smart,
    context: address,
    latitude: feature.geometry?.coordinates?.[1],
    longitude: feature.geometry?.coordinates?.[0],
  };
}

async function search(term: string): Promise<PlaceSuggestion[]> {
  const url = new URL(PHOTON_ENDPOINT);
  url.searchParams.set("q", term);
  url.searchParams.set("limit", "8");
  url.searchParams.set("lang", "en");
  url.searchParams.set("lat", String(BIAS_LAT));
  url.searchParams.set("lon", String(BIAS_LON));

  const response = await fetch(url, {
    headers: { "User-Agent": "WeShareRide/1.0 (https://weshare-ride.com)" },
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error(`Place lookup failed (${response.status})`);

  const data = (await response.json()) as { features?: PhotonFeature[] };
  const seen = new Set<string>();

  return (data.features ?? [])
    .map(toSuggestion)
    .filter((suggestion): suggestion is PlaceSuggestion => suggestion !== null)
    .filter((suggestion) => {
      const key = `${suggestion.label}|${suggestion.address}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6);
}

export async function GET(request: Request) {
  const term = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (term.length < 3) return NextResponse.json({ results: [] });

  try {
    return NextResponse.json(
      { results: await search(term) },
      { headers: { "Cache-Control": "public, s-maxage=86400" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        results: [],
        error: error instanceof Error ? error.message : "Place lookup failed",
      },
      { status: 502 },
    );
  }
}
