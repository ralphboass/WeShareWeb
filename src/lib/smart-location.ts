/**
 * Port of AddressParser.swift. Turns a full address into the recognisable
 * name the app shows ("LAX", "UCLA", "Westwood"), falling back to the city.
 * Keep the tables in sync with the app so both show identical labels.
 */

interface Rule {
  patterns: string[];
  displayName: string;
}

// Most specific: exact landmarks.
const LANDMARKS: Rule[] = [
  { patterns: ["1 World Way", "World Way"], displayName: "LAX" },
  { patterns: ["380 World Way"], displayName: "LAX" },
  { patterns: ["18601 Airport Way", "Airport Way", "18601 Airport"], displayName: "Long Beach Airport" },
  { patterns: ["3400 E Tahquitz Canyon Way", "Palm Springs Airport"], displayName: "Palm Springs Airport" },

  { patterns: ["Hilgard Ave, 405"], displayName: "UCLA" },
  { patterns: ["308 Westwood Plaza", "Westwood Plaza"], displayName: "UCLA Campus" },
  { patterns: ["University Ave", "University Avenue"], displayName: "UCLA Campus" },
  { patterns: ["3551 Trousdale Pkwy", "Trousdale Pkwy", "Trousdale Parkway"], displayName: "USC" },
  { patterns: ["University Park", "University Park Campus"], displayName: "USC" },
  {
    patterns: [
      "Mesa Rd", "Mesa Road", "Storke Rd", "Storke Road", "El Colegio Rd", "El Colegio Road",
      "Phelps Rd", "Phelps Road", "Ocean Rd", "Ocean Road", "Lagoon Rd", "Lagoon Road",
      "Stadium Rd", "Stadium Road", "Harder Stadium", "Henley Gate",
      "University of California Santa Barbara", "UC Santa Barbara", "UCSB",
    ],
    displayName: "UCSB",
  },
  { patterns: ["Gilman Dr", "Gilman Drive"], displayName: "UCSD" },
  { patterns: ["La Jolla Village Dr", "La Jolla Village Drive"], displayName: "UCSD" },
  { patterns: ["Campus Dr", "Campus Drive"], displayName: "UCI" },
  { patterns: ["University Dr", "University Drive"], displayName: "UCI Campus" },
  { patterns: ["Nordhoff St", "Nordhoff Street"], displayName: "CSUN" },
  { patterns: ["Zelzah Ave", "Zelzah Avenue"], displayName: "CSUN" },

  { patterns: ["1313 Disneyland Dr", "Disneyland Dr", "Disneyland Drive"], displayName: "Disneyland" },
  { patterns: ["1313 S Harbor Blvd", "Harbor Blvd"], displayName: "Disneyland" },
  { patterns: ["100 Universal City Plaza", "Universal City Plaza"], displayName: "Universal Studios" },
  { patterns: ["800 W Olympic Blvd", "Olympic Blvd"], displayName: "Crypto.com Arena" },
  { patterns: ["1000 Vin Scully Ave", "Vin Scully Ave"], displayName: "Dodger Stadium" },
  { patterns: ["1111 S Figueroa St", "Figueroa St"], displayName: "LA Live" },
  { patterns: ["6801 Hollywood Blvd", "Hollywood Blvd"], displayName: "Hollywood" },
  { patterns: ["2800 E Observatory Rd", "Observatory Rd"], displayName: "Griffith Observatory" },
  { patterns: ["200 Santa Monica Pier", "Santa Monica Pier"], displayName: "Santa Monica Pier" },
  { patterns: ["1200 Getty Center Dr", "Getty Center"], displayName: "Getty Center" },
  { patterns: ["Rose Bowl Dr", "1001 Rose Bowl Dr"], displayName: "Rose Bowl Stadium" },
  { patterns: ["800 N Alameda St", "Alameda St", "Union Station"], displayName: "Union Station" },

  { patterns: ["189 The Grove Dr", "The Grove"], displayName: "The Grove" },
  { patterns: ["Santa Monica Blvd, 10250", "Westfield Century City"], displayName: "Century City Mall" },
  { patterns: ["Hollywood Blvd, 6801", "Hollywood & Highland"], displayName: "Hollywood & Highland" },
  { patterns: ["Brand Blvd, 100 S", "Americana"], displayName: "Americana at Brand" },
];

// Streets that identify a neighbourhood or a specific UCLA building.
const STREET_NEIGHBOURHOODS: Rule[] = [
  {
    patterns: [
      "Landfair Ave", "Landfair", "Gayley Ave", "Hilgard Ave", "Hilgard", "Gayley",
      "Levering Ave", "Levering", "Midvale Ave", "Midvale", "Strathmore Dr", "Strathmore",
      "Kelton Ave", "Kelton", "Veteran Ave", "Glenrock Ave", "Glenrock", "Lindbrook Dr",
      "Lindbrook", "Weyburn Ave", "Weyburn", "Broxton Ave", "Broxton",
    ],
    displayName: "Westwood",
  },
  { patterns: ["De Neve Dr, 270"], displayName: "Rieber Hall" },
  { patterns: ["De Neve Dr, 280"], displayName: "Rieber Vista" },
  { patterns: ["De Neve Dr, 310"], displayName: "Rieber Hall" },
  { patterns: ["De Neve Dr, 240"], displayName: "Hedrick Summit" },
  { patterns: ["De Neve Dr, 350"], displayName: "Sproul Hall" },
  { patterns: ["Dickson Ct, 10745", "Dickson Ct", "Portola plaza"], displayName: "Royce Hall" },
  { patterns: ["Easton Cir, 111", "Easton Cir"], displayName: "Sunset Rec" },
  { patterns: ["De Neve Dr", "De Neve Drive", "De Neve"], displayName: "De Neve" },
  { patterns: ["Rodeo Dr", "Rodeo Drive", "Canon Dr", "Canon Drive", "Beverly Dr", "Beverly Drive"], displayName: "Beverly Hills" },
  { patterns: ["Abbot Kinney", "Abbot Kinney Blvd", "Venice Blvd", "Venice Boulevard"], displayName: "Venice" },
  { patterns: ["Hollywood Blvd", "Hollywood Boulevard", "Vine St", "Vine Street"], displayName: "Hollywood" },
];

const NEIGHBOURHOODS: Rule[] = [
  { patterns: ["Westwood", "Westwood Village"], displayName: "Westwood" },
  { patterns: ["Santa Barbara", "Santa Bárbara"], displayName: "Santa Barbara" },
  { patterns: ["Isla Vista", "Isla Vista CA"], displayName: "Isla Vista" },
  { patterns: ["Goleta"], displayName: "Goleta" },
];

function firstMatch(addressLower: string, rules: Rule[]): string | null {
  for (const rule of rules) {
    for (const pattern of rule.patterns) {
      if (addressLower.includes(pattern.toLowerCase())) return rule.displayName;
    }
  }
  return null;
}

/** AddressParser.parseAddress: landmark → street → neighbourhood → city. */
export function parseAddress(address: string, cityName: string): string {
  const addressLower = (address ?? "").toLowerCase();

  return (
    firstMatch(addressLower, LANDMARKS) ??
    firstMatch(addressLower, STREET_NEIGHBOURHOODS) ??
    firstMatch(addressLower, NEIGHBOURHOODS) ??
    cityName ??
    ""
  );
}

/** Ride.smartDeparture */
export const smartDeparture = (ride: {
  departure: string;
  departureAddress: string;
}) => parseAddress(ride.departureAddress, ride.departure);

/** Ride.smartDestination */
export const smartDestination = (ride: {
  destination: string;
  destinationAddress: string;
}) => parseAddress(ride.destinationAddress, ride.destination);
