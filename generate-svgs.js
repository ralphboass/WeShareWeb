const fs = require('fs');
const path = require('path');

const templates = [
  {
    day: "01",
    name: "Day1-CobaltBlue",
    label: "01 // COBALT BLUE",
    desc: "Day 1 • Kickoff",
    bg: "#1E40AF",
    accent: "#60A5FA",
    ticketColor: "#1E40AF",
    badgeBg: "#FAF6EE",
    badgeText: "#1E40AF",
    title: "Start The Semester\\nWith $100 Cash 🎟️",
    subtitle: "7 Days of Drops • 1 Grand Winner",
    tag: "⚡ SEMESTER GIVEAWAY",
    photoCaption: "EST. 2026 // ROAD TRIP",
    icon: "image"
  },
  {
    day: "02",
    name: "Day2-VioletPurple",
    label: "02 // VIOLET PURPLE",
    desc: "Day 2 • Routes",
    bg: "#581C87",
    accent: "#C084FC",
    ticketColor: "#581C87",
    badgeBg: "#FAF6EE",
    badgeText: "#581C87",
    title: "Where Are We\\nDriving Next? 🛣️",
    subtitle: "Campus commute or weekend getaway?",
    tag: "📍 DREAM COMMUTES",
    photoCaption: "HIGHWAY VIBES",
    icon: "map-pin"
  },
  {
    day: "03",
    name: "Day3-RosePink",
    label: "03 // DEEP ROSE PINK",
    desc: "Day 3 • Aux Battle",
    bg: "#9D174D",
    accent: "#F472B6",
    ticketColor: "#9D174D",
    badgeBg: "#FAF6EE",
    badgeText: "#9D174D",
    title: "Pass The Aux Cord,\\nDrop That Track 🎶",
    subtitle: "What 1 song is mandatory in the car?",
    tag: "📻 AUX CORD BATTLE",
    photoCaption: "CASSETTE SIDE A",
    icon: "music"
  },
  {
    day: "04",
    name: "Day4-SkyCyan",
    label: "04 // SKY CYAN",
    desc: "Day 4 • Split & Save",
    bg: "#075985",
    accent: "#38BDF8",
    ticketColor: "#075985",
    badgeBg: "#FAF6EE",
    badgeText: "#075985",
    title: "Split The Ride,\\nSave Up To 75% 💰",
    subtitle: "Verified student rides • Instant matching",
    tag: "💵 BUDGET HACK",
    photoCaption: "SMART COMMUTE",
    icon: "piggy-bank"
  },
  {
    day: "05",
    name: "Day5-WarmOatmeal",
    label: "05 // WARM OATMEAL",
    desc: "Day 5 • Passenger Personas",
    bg: "#FAF6EE",
    textColor: "#1C1917",
    isLight: true,
    accent: "#DE9B35",
    ticketColor: "#1C1917",
    badgeBg: "#1C1917",
    badgeText: "#FAF6EE",
    title: "Which One Are You\\nIn The Car? 🎭",
    subtitle: "1. The DJ • 2. The Sleeper • 3. Snacker • 4. Co-Pilot",
    tag: "🎭 CARPOOL PERSONAS",
    photoCaption: "CREW CHECK",
    icon: "users"
  },
  {
    day: "06",
    name: "Day6-IndigoNavy",
    label: "06 // INDIGO NAVY",
    desc: "Day 6 • 5x Entries",
    bg: "#312E81",
    accent: "#818CF8",
    ticketColor: "#312E81",
    badgeBg: "#FAF6EE",
    badgeText: "#312E81",
    title: "Post Or Book\\nA Ride Today 🚘",
    subtitle: "Driver or rider: unlock 5x entries for $100 draw!",
    tag: "🎟️ 5X GRAND ENTRIES",
    photoCaption: "EMPTY SEATS",
    icon: "car"
  },
  {
    day: "07",
    name: "Day7-ObsidianGold",
    label: "07 // OBSIDIAN & GOLD",
    desc: "Day 7 • Grand Finale",
    bg: "#18181B",
    accent: "#FBBF24",
    ticketColor: "#18181B",
    badgeBg: "#FBBF24",
    badgeText: "#18181B",
    title: "The $100 Grand Prize\\nDraw Is Tonight! 🎁",
    subtitle: "$100 Amazon / Apple Card OR AirPods + Free Rides",
    tag: "🎉 FINAL HOURS TO ENTER",
    photoCaption: "GRAND DRAW",
    icon: "trophy"
  },
  {
    day: "08",
    name: "Bonus-HoneyMustard",
    label: "08 // HONEY MUSTARD",
    desc: "Warm 70s Commuter",
    bg: "#D97706",
    accent: "#FDE68A",
    ticketColor: "#78350F",
    badgeBg: "#1C1917",
    badgeText: "#FAF6EE",
    title: "Never Drive Alone,\\nShare The Gas ⛽",
    subtitle: "Connect with verified student carpools",
    tag: "☀️ COMMUTER SPECIAL",
    photoCaption: "SUNSHINE DRIVE",
    icon: "sun"
  },
  {
    day: "09",
    name: "Bonus-ForestSage",
    label: "09 // FOREST SAGE",
    desc: "Eco Clean Commute",
    bg: "#1E3A2F",
    accent: "#6EE7B7",
    ticketColor: "#064E3B",
    badgeBg: "#FAF6EE",
    badgeText: "#1E3A2F",
    title: "Less Traffic,\\nMore Memories 🍃",
    subtitle: "Ride together & reduce campus carbon footprint",
    tag: "🌲 ECO COMMUTE",
    photoCaption: "CLEAN DRIVE",
    icon: "trees"
  },
  {
    day: "10",
    name: "Bonus-SunsetCoral",
    label: "10 // SUNSET CORAL",
    desc: "Weekend Getaway",
    bg: "#BE4B38",
    accent: "#FECDD3",
    ticketColor: "#881337",
    badgeBg: "#FAF6EE",
    badgeText: "#BE4B38",
    title: "Your Next Road Trip\\nStarts Here 🏖️",
    subtitle: "Split gas, share good music, explore more",
    tag: "🌅 WEEKEND ESCAPE",
    photoCaption: "GOLDEN HOUR",
    icon: "compass"
  },
  {
    day: "11",
    name: "Bonus-TerracottaRust",
    label: "11 // TERRACOTTA RUST",
    desc: "Classic 70s Earth Tone",
    bg: "#BC4B28",
    accent: "#FDBA74",
    ticketColor: "#7C2D12",
    badgeBg: "#FAF6EE",
    badgeText: "#BC4B28",
    title: "Campus Rides Made\\nSimple & Cheap 🚗",
    subtitle: "Split the cost • Skip the parking headache",
    tag: "🍂 VINTAGE CARPOOL",
    photoCaption: "CAMPUS COMMUTE",
    icon: "car"
  },
  {
    day: "12",
    name: "Bonus-DustyMauve",
    label: "12 // DUSTY MAUVE",
    desc: "Muted Aesthetic Lilac",
    bg: "#6B4C7A",
    accent: "#E9D5FF",
    ticketColor: "#581C87",
    badgeBg: "#FAF6EE",
    badgeText: "#6B4C7A",
    title: "Carpooling Never\\nLooked This Good ✨",
    subtitle: "Good tunes, friendly drivers, zero stress",
    tag: "💜 CHILL COMMUTES",
    photoCaption: "GOOD VIBES",
    icon: "sparkles"
  },
  {
    day: "13",
    name: "Bonus-RetroSeafoam",
    label: "13 // RETRO SEAFOAM",
    desc: "Vintage Mint Green",
    bg: "#2D6A4F",
    accent: "#A7F3D0",
    ticketColor: "#064E3B",
    badgeBg: "#FAF6EE",
    badgeText: "#2D6A4F",
    title: "Fresh Rides For\\nThe New Semester 🌱",
    subtitle: "Save up to $150 every month on gas",
    tag: "🌿 FRESH START",
    photoCaption: "SEMESTER FRESH",
    icon: "leaf"
  },
  {
    day: "14",
    name: "Bonus-MidnightTeal",
    label: "14 // MIDNIGHT TEAL",
    desc: "Deep Ocean Marine",
    bg: "#0F4C5C",
    accent: "#67E8F9",
    ticketColor: "#083344",
    badgeBg: "#FAF6EE",
    badgeText: "#0F4C5C",
    title: "Late Night Study?\\nSafe Rides Home 🌙",
    subtitle: "Verified university students only",
    tag: "🛡️ SAFETY FIRST",
    photoCaption: "NIGHT COMMUTE",
    icon: "shield"
  },
  {
    day: "15",
    name: "Bonus-EspressoBrown",
    label: "15 // ESPRESSO BROWN",
    desc: "Rich 70s Coffee Tone",
    bg: "#3D2B1F",
    accent: "#FED7AA",
    ticketColor: "#451A03",
    badgeBg: "#FAF6EE",
    badgeText: "#3D2B1F",
    title: "Fuel Up With Coffee\\n& Cheap Commutes ☕",
    subtitle: "Never pay full price for campus parking again",
    tag: "☕ MORNING FUEL",
    photoCaption: "MORNING RUN",
    icon: "coffee"
  },
  {
    day: "16",
    name: "Bonus-CoastalPeach",
    label: "16 // COASTAL PEACH",
    desc: "Warm California Sunset",
    bg: "#D97059",
    accent: "#FFE4E6",
    ticketColor: "#881337",
    badgeBg: "#FAF6EE",
    badgeText: "#D97059",
    title: "Weekend Wheels &\\nHighway Breezes 🌅",
    subtitle: "Share seats, split tolls, make friends",
    tag: "🌴 COASTAL CRUISE",
    photoCaption: "WEEKEND TRIP",
    icon: "sun"
  },
  {
    day: "17",
    name: "Bonus-LightBlue",
    label: "17 // LIGHT PASTEL BLUE",
    desc: "Soft Powder Sky",
    bg: "#CBE3FB",
    textColor: "#1E3A8A",
    isLight: true,
    accent: "#3B82F6",
    ticketColor: "#1E3A8A",
    badgeBg: "#1E3A8A",
    badgeText: "#FAF6EE",
    title: "Smooth Rides &\\nSunny Skies 🚙☀️",
    subtitle: "Effortless student carpools on campus",
    tag: "🌤️ EASY COMMUTE",
    photoCaption: "CLEAR ROADS",
    icon: "sun"
  },
  {
    day: "18",
    name: "Bonus-LightPink",
    label: "18 // LIGHT PASTEL PINK",
    desc: "Soft Rose Milk",
    bg: "#FCE0EC",
    textColor: "#831843",
    isLight: true,
    accent: "#EC4899",
    ticketColor: "#831843",
    badgeBg: "#831843",
    badgeText: "#FAF6EE",
    title: "Sweet Rides &\\nGreat Company 🌸",
    subtitle: "Good energy only in the passenger seat",
    tag: "💖 PINK VIBES",
    photoCaption: "SWEET TRIP",
    icon: "heart"
  },
  {
    day: "19",
    name: "Bonus-LightViolet",
    label: "19 // LIGHT PASTEL VIOLET",
    desc: "Soft Lavender Breeze",
    bg: "#E8DCF8",
    textColor: "#4C1D95",
    isLight: true,
    accent: "#8B5CF6",
    ticketColor: "#4C1D95",
    badgeBg: "#4C1D95",
    badgeText: "#FAF6EE",
    title: "Dreamy Routes &\\nZero Hassle 💜",
    subtitle: "Split gas and relax on your daily commute",
    tag: "🔮 LAVENDER VIBES",
    photoCaption: "DREAM ROUTE",
    icon: "sparkles"
  }
];

const targetDir = path.join(__dirname, 'public/instagram-templates');

templates.forEach(t => {
  const isLight = t.isLight || false;
  const mainText = isLight ? t.textColor || '#1C1917' : '#FAF6EE';
  const subText = isLight ? 'rgba(28, 25, 23, 0.8)' : 'rgba(250, 246, 238, 0.85)';
  const borderCol = isLight ? 'rgba(0, 0, 0, 0.12)' : 'rgba(250, 246, 238, 0.2)';
  const badgeBg = t.badgeBg || (isLight ? '#1C1917' : '#FAF6EE');
  const badgeText = t.badgeText || (isLight ? '#FAF6EE' : t.ticketColor);
  
  const titleLines = t.title.split('\\n');

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1350" width="1080" height="1350">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&amp;family=Plus+Jakarta+Sans:wght@700;800;900&amp;family=Space+Mono:wght@700&amp;display=swap');
      .title { font-family: 'Playfair Display', Georgia, serif; font-weight: 900; fill: ${mainText}; }
      .sans { font-family: 'Plus Jakarta Sans', sans-serif; }
      .mono { font-family: 'Space Mono', monospace; font-weight: 700; }
    </style>
    <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="25" stdDeviation="30" flood-opacity="0.4"/>
    </filter>
  </defs>

  <!-- Solid Vintage Background -->
  <rect width="1080" height="1350" fill="${t.bg}" />
  <rect x="28" y="28" width="1024" height="1294" rx="48" fill="none" stroke="${borderCol}" stroke-width="4" />

  <!-- Top Centered Day Badge -->
  <g transform="translate(540, 85)">
    <rect x="-150" y="0" width="300" height="70" rx="35" fill="${badgeBg}" filter="url(#cardShadow)"/>
    <text x="0" y="45" class="mono" font-size="22" fill="${badgeText}" text-anchor="middle">★ DAY ${t.day} OF 07 ★</text>
  </g>

  <!-- Central Polaroid Photo Frame (Enlarged & Prominent) -->
  <g transform="translate(340, 230) rotate(-2)">
    <!-- Shadow & Paper Frame -->
    <rect x="0" y="0" width="400" height="460" rx="20" fill="#FAF6EE" filter="url(#cardShadow)" />
    
    <!-- Empty Image Placeholder / Print Window -->
    <rect x="24" y="24" width="352" height="340" rx="14" fill="#EFE8DC" stroke="#D1C7B7" stroke-width="3" stroke-dasharray="8,8" />
    
    <!-- Icon Placeholder -->
    <circle cx="200" cy="170" r="50" fill="#FAF6EE" stroke="#D1C7B7" stroke-width="3"/>
    <path d="M180 170 L220 170 M200 150 L200 190" stroke="#78716C" stroke-width="5" stroke-linecap="round"/>
    <text x="200" y="265" class="mono" font-size="18" fill="#78716C" text-anchor="middle">INSERT PHOTO HERE</text>
    <text x="200" y="295" class="mono" font-size="13" fill="#A8A29E" text-anchor="middle">1080 x 1080 or 4:5</text>

    <!-- Polaroid Caption -->
    <text x="200" y="420" class="mono" font-size="18" fill="#44403C" text-anchor="middle">${t.photoCaption}</text>

    <!-- Washi Tape -->
    <rect x="135" y="-18" width="130" height="36" fill="#FAF6EE" opacity="0.85" />
  </g>

  <!-- Tag & Main Headline in Open Lower Area (No Lower Text Box) -->
  <g transform="translate(540, 810)">
    <!-- Tag Pill -->
    <rect x="-180" y="0" width="360" height="48" rx="24" fill="${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.25)'}" stroke="${borderCol}" stroke-width="2"/>
    <text x="0" y="31" class="mono" font-size="18" fill="${mainText}" text-anchor="middle">${t.tag}</text>

    <!-- Headline Lines -->
    <text x="0" y="125" class="title" font-size="64" text-anchor="middle">${titleLines[0]}</text>
    ${titleLines[1] ? `<text x="0" y="205" class="title" font-size="64" text-anchor="middle">${titleLines[1]}</text>` : ''}
    <text x="0" y="${titleLines[1] ? '275' : '195'}" class="sans" font-weight="700" font-size="28" fill="${subText}" text-anchor="middle">${t.subtitle}</text>
  </g>
</svg>`;

  const filePath = path.join(targetDir, `${t.name}.svg`);
  fs.writeFileSync(filePath, svgContent, 'utf8');
  console.log(`Generated Clean SVG: ${filePath}`);
});
