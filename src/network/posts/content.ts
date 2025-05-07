import { api } from "@/api/api";

const postMessageContent = {
  gig_potential: [
    // Theft
    {
      content:
        "Heard about a fat stack of unmarked credit chips hiding in Sector 7 🤫 Anyone up for a midnight swipe?",
      type: "theft",
    },
    {
      content:
        "Just saw a corp convoy rolling through the neon alley—imagine the payday if someone got creative 🚚💨",
      type: "theft",
    },
    {
      content:
        "Word on the street is there’s an unlocked vault at the old bank vault site… temptation much?",
      type: "theft",
    },
    {
      content:
        "Port docks are buzzing—rumor of a crate full of chrome. Could be trouble, could be riches 💰",
      type: "theft",
    },
    {
      content:
        "Any low-key runners wanna help me ghost into that faceless bank? Discretion guaranteed ✨",
      type: "theft",
    },
    {
      content:
        "Who’s down for a quick daylight data grab? Prototype biotech files, high risk, higher reward 🧬",
      type: "theft",
    },
    {
      content:
        "Jewel district’s quiet tonight… almost makes you wanna go for a little sparkle-snatch 👀",
      type: "theft",
    },
    {
      content:
        "Patrol unit just unloaded a comms array—any ghosts looking for a challenge?",
      type: "theft",
    },
    {
      content:
        "Spotted an unguarded shipping container of shiny goods… wish someone would snag it 😉",
      type: "theft",
    },
    {
      content:
        "Got a tip on some confiscated arms in Precinct 12… daredevils, this is your moment 🔫",
      type: " thef`t",
    },
    {
      content:
        "Late night intel: corporate CEO’s safe code is probably too easy. Worth a shot?",
      type: "theft",
    },
    {
      content:
        "Local scrap yard sitting on a hidden cache of chrome plating… anyone fancy a dig?",
      type: "theft",
    },
    {
      content:
        "That armored van downtown looked juicy. Anyone got a plan B for intercept?",
      type: "theft",
    },
    {
      content:
        "Caught wind of a maintenance hatch under the data center—perfect ghost entry 👻",
      type: "theft",
    },
    {
      content:
        "Break-in at the VR lounge next week? I can supply the gear, need the muscle.",
      type: "theft",
    },
    {
      content:
        "I’d swipe that gold-plated holo-projector if someone would help fence it 🕹️",
      type: "theft",
    },
    {
      content:
        "Basement vault in the old museum hasn’t been touched in years… luck favors the bold 💎",
      type: "theft",
    },
    {
      content:
        "Ever lifted a police cruiser’s dashcam? Me neither, but could be fun 🤔",
      type: "theft",
    },
    {
      content:
        "Found a blind spot in the mall’s security. Who’s up for a quick in-and-out?",
      type: "theft",
    },
    {
      content:
        "That abandoned splice lab has some shiny biotech vials… curious explorers?",
      type: "theft",
    },

    // Assassination
    {
      content:
        "Funny how some folks talk too much… knows anyone good with silent solutions? 🤐",
      type: "assassination",
    },
    {
      content:
        "Saw a board member strutting at last night’s gala—some of us might wanna cut in line permanently 💼🔪",
      type: "assassination",
    },
    {
      content:
        "I swear, that rival fixer needs a permanent timeout… poison recommendations? 🥀",
      type: "assassination",
    },
    {
      content:
        "Blade art is underrated. Anyone here sculpt steel in close quarters?",
      type: "assassination",
    },
    {
      content:
        "Snipers in the city skyline got any free slots? Clean shots only, no drama 🎯",
      type: "assassination",
    },
    {
      content:
        "Got a target who’s always flanked by drones… fancy a drone-proof bullet?",
      type: "assassination",
    },
    {
      content:
        "Heard of a poison so sweet it tastes like cherries… interested folks?",
      type: "assassination",
    },
    {
      content:
        "Looking for someone to make someone else disappear—preferably without a trace 🚫",
      type: "assassination",
    },
    {
      content:
        "Any ghost with a blade wanna give a demonstration? I’ve got creds.",
      type: "assassination",
    },
    {
      content: "Need that loudmouth at the bar to shut up… permanently. Ideas?",
      type: "assassination",
    },
    {
      content:
        "Gala VIPs are ripe targets. Who’s got the chops for a no-fuss job?",
      type: "assassination",
    },
    {
      content: "Metal whisperers, I need silence delivered with precision.",
      type: "assassination",
    },
    {
      content: "If your scouting report includes a drop roof, I’m listening.",
      type: "assassination",
    },
    {
      content:
        "What’s the going rate for a clean night job? Asking for a friend…",
      type: "assassination",
    },
    {
      content:
        "Ever used a railgun for a personal errand? Hit me with details.",
      type: "assassination",
    },
    {
      content: "Quick question: which toxin leaves no fingerprint?",
      type: "assassination",
    },
    {
      content: "Looking to hire someone who can play dead—literally.",
      type: "assassination",
    },
    {
      content: "Need a specialist who loves long-range games. Scope included.",
      type: "assassination",
    },
    {
      content: "Any blade whisperers open to moonlit gigs?",
      type: "assassination",
    },
    {
      content: "Wealthy exec in penthouse—roof entrance only. Thoughts?",
      type: "assassination",
    },

    // Hacking
    {
      content:
        "Corp firewall’s laughable… bet a decent slicer could ghost right through 😂",
      type: "hacking",
    },
    {
      content:
        "That embarrassing video of Mr. Bigwig needs to vanish. Who’s up for digital erasure? 📼❌",
      type: "hacking",
    },
    {
      content:
        "Ever hijacked a holo-broadcast? Thinking of airing some spicy anti-corp memes at 22:00 🔥",
      type: "hacking",
    },
    {
      content:
        "Got sealed gang comms begging for decryption… deadline’s tonight, brains and coffee welcomed ☕💻",
      type: "hacking",
    },
    {
      content:
        "Heard the city grid’s wide open—full admin access for whoever installs the slickest backdoor 🔓",
      type: "hacking",
    },
    {
      content:
        "Who’s got the juice to reroute traffic cams? Need eyes on the back alleys.",
      type: "hacking",
    },
    {
      content:
        "Thinking of jamming every news feed with cat videos—worth a few creds?",
      type: "hacking",
    },
    {
      content: "My toaster keeps emailing me… someone disable this rogue AI?",
      type: "hacking",
    },
    {
      content:
        "Need a script to wipe all of corp’s employee records. DM your rates.",
      type: "hacking",
    },
    {
      content:
        "Ever replaced holo-ads with mosh pit footage? Asking for entertainment purposes.",
      type: "hacking",
    },
    {
      content:
        "Looking to ghost in and ghost out of the mainframe. Fast and silent wins.",
      type: "hacking",
    },
    {
      content:
        "Deploying ransomware on corp kitchens… gourmet ransom notes included 😂",
      type: "hacking",
    },
    {
      content:
        "Any minds skilled at bending smartglass cameras? I know a paymaster.",
      type: "hacking",
    },
    {
      content:
        "Need someone to hack my ex’s social creds… petty, but satisfying.",
      type: "hacking",
    },
    {
      content:
        "Gonna inject some Easter eggs into civic announcements. Who’s in?",
      type: "hacking",
    },
    {
      content:
        "Want to swap city’s emergency sirens with party tunes. DM your backdoor method.",
      type: "hacking",
    },
    {
      content: "Heard of memory-wiping malware? Let’s discuss terms.",
      type: "hacking",
    },
    {
      content: "Wifi’s weak but my ambition’s strong—anyone boost AP signals?",
      type: "hacking",
    },
    {
      content: "Thinking of livestreaming a DOS attack on the mayor. Thoughts?",
      type: "hacking",
    },
    {
      content:
        "I need a foolproof VPN built in a weekend. Pay upfront, creds later.",
      type: "hacking",
    },

    // Smuggling
    {
      content:
        "Heard some sticky nanites need a ride past checkpoint—low chatter, big creds 🤫",
      type: "smuggling",
    },
    {
      content:
        "Biochips on the move tonight… anyone with smooth wheels wanna tag along? 🏎️",
      type: "smuggling",
    },
    {
      content:
        "Got a stack of sealed crates—could be anything. Weapons? Art? Your guess. DM if curious 📦",
      type: "smuggling",
    },
    {
      content:
        "Exotic critters need a new home—no questions, just quick paws across the border 🐾",
      type: "smuggling",
    },
    {
      content:
        "Art heist leftovers need a getaway ride. Fast car, loose lips sink ships 🚗💨",
      type: "smuggling",
    },
    {
      content:
        "Need to ghost some banned mods into public VR booths. Discretion is key.",
      type: "smuggling",
    },
    {
      content:
        "Heard of a back alley route under the subway… perfect for hidden cargo.",
      type: "smuggling",
    },
    {
      content:
        "Importing vintage synth records—custom sealed cases. Interested DJs?",
      type: "smuggling",
    },
    {
      content:
        "Gold bars hidden in fuel tanks—who can drive a tanker past customs?",
      type: "smuggling",
    },
    {
      content:
        "Moving micro-drones in med shipments tonight. Clean hands only.",
      type: "smuggling",
    },
    {
      content:
        "Got a hot shipment of unregistered weapons… looking for a cool head.",
      type: "smuggling",
    },
    {
      content:
        "Silk fabrics soaked in rare oils… care for a delicate transport?",
      type: "smuggling",
    },
    {
      content:
        "Fresh buds from the hydro farms—need a bike courier before dawn 🌿",
      type: "smuggling",
    },
    {
      content:
        "Need help shuttling luxury synth-leather across district lines.",
      type: "smuggling",
    },
    {
      content: "Moving stolen art in hollowed crates of scrap metal—who’s up?",
      type: "smuggling",
    },
    {
      content: "Transporting prototype hover-blades… no scans, no logs.",
      type: "smuggling",
    },
    {
      content:
        "Midnight lanes clear if you know the back roads. Perfect for contraband.",
      type: "smuggling",
    },
    {
      content:
        "Bottled biome samples gotta stay cool—looking for a chill driver ❄️",
      type: "smuggling",
    },
    {
      content:
        "Got a crate of vintage wine—official docs say it’s fertilizer 🍷",
      type: "smuggling",
    },
    {
      content: "Grain shipments make great cover for bio-samples. Thoughts?",
      type: "smuggling",
    },

    // Surveillance
    {
      content:
        "Thinking of planting a few micro‑cams in Exec L’s office… anyone got specs on the security sweep?",
      type: "surveillance",
    },
    {
      content:
        "Tailing that VIP last night… crowded streets make it fun, but sweatier 😓",
      type: "surveillance",
    },
    {
      content:
        "Someone should tap the syndicate’s chatter—imagine the dirt we’d dig up 🕵️‍♂️",
      type: "surveillance",
    },
    {
      content:
        "Drones on patrol look bored—wonder if they’d spill their flight path secrets for creds 🤖",
      type: "surveillance",
    },
    {
      content:
        "Building a sonic sensor net around my hideout… feedback welcome on gear options 👂",
      type: "surveillance",
    },
    {
      content: "Street cams got blind spots near the old bridge—ideas welcome.",
      type: "surveillance",
    },
    {
      content:
        "Just hacked a café cam… live feed’s golden for tailing ops ☕📹",
      type: "surveillance",
    },
    {
      content: "Need someone to analyze GPS pings from that shady courier.",
      type: "surveillance",
    },
    {
      content:
        "Thinking of deploying nano-bugs for eavesdropping… who’s built them before?",
      type: "surveillance",
    },
    {
      content: "Heard a chatter drone’s got a weak mic—could be covert gold.",
      type: "surveillance",
    },
    {
      content:
        "Any recs for a silent motion sensor network? My hideout’s lonely.",
      type: "surveillance",
    },
    {
      content:
        "Followed a suspect into the sewer vents… cameras or drone next?",
      type: "surveillance",
    },
    {
      content: "Streetlight poles make epic tripod spots for cams. Who knew?",
      type: "surveillance",
    },
    {
      content: "Need eyes on rooftop gatherings—cheap coax feed anyone?",
      type: "surveillance",
    },
    {
      content: "Thinking of jamming patrol drone signals… discuss gear.",
      type: "surveillance",
    },
    {
      content: "Micro-cam specs for subdermal install? DM your guides.",
      type: "surveillance",
    },
    {
      content: "Sound sensors in alleyways pick up too much—any filter hacks?",
      type: "surveillance",
    },
    {
      content: "Got a tile tracker going, but I need more resolution. Ideas?",
      type: "surveillance",
    },
    {
      content:
        "License plate OCR feeds are flawed—who’s built a better parser?",
      type: "surveillance",
    },
    {
      content:
        "Shadowing VIP convoys is fun, but I need range cams. Suggestions?",
      type: "surveillance",
    },

    // Protection
    {
      content:
        "My scientist friend’s got too many people wanting her dead… any muscle for a friendly guard gig? 🛡️",
      type: "protection",
    },
    {
      content:
        "Illicit auction on the low—need eyes on perimeter, no questions asked 👀",
      type: "protection",
    },
    {
      content:
        "VIP’s in heat—hostile zone ahead. Looking for shadow steps and silent exits",
      type: "protection",
    },
    {
      content:
        "Warehouse full of chrome shipments—ghosts gotta watch that spot for gremlins 🏭",
      type: "protection",
    },
    {
      content:
        "Digital vault’s tougher than my ex—anyone want to build a shield that actually holds? 🛡️💾",
      type: "protection",
    },
    {
      content:
        "Heard about a gang planning a jump—need someone to stand in the gap.",
      type: "protection",
    },
    {
      content: "Client’s hot on my tail—looking for a decoy to take the heat.",
      type: "protection",
    },
    {
      content:
        "Park hopping under moonlight—need bodyguard vibes, not cop vibes.",
      type: "protection",
    },
    {
      content: "He’s stalking my feed… want someone to crash his party.",
      type: "protection",
    },
    {
      content: "Got creds for a night watch at the black market stalls.",
      type: "protection",
    },
    {
      content: "Need someone who knows hand-to-hand and vanishes into shadows.",
      type: "protection",
    },
    {
      content:
        "Client wants ghost escort through the bad blocks—no cheap tricks.",
      type: "protection",
    },
    {
      content:
        "Tattoo parlor downstairs looks shady—need someone to check the back door.",
      type: "protection",
    },
    {
      content: "Gas station holdup threats rising… looking for overwatch eyes.",
      type: "protection",
    },
    {
      content:
        "Heard a rumble by the old bridge—any muscle to scare off trouble?",
      type: "protection",
    },
    {
      content:
        "Need someone to babysit my vault door while I’m out. Serious gig.",
      type: "protection",
    },
    {
      content: "Got a client who hates drones—need anti-air watch.",
      type: "protection",
    },
    {
      content:
        "Escort needed for a midnight med-drop—no questions, just survival.",
      type: "protection",
    },
    {
      content: "Door-to-door intel runs aren’t safe—looking for backup.",
      type: "protection",
    },
    {
      content: "Need someone to guard my ride while I handle business.",
      type: "protection",
    },
    {
      content:
        "Local turf war heating up—need someone to stand between me and a bullet.",
      type: "protection",
    },
  ],
  joke: [
    {
      content:
        "I'm looking for a getaway driver for a heist. Anyone interested?",
      type: "joke",
    },
    {
      content: "Heard the net’s so slow today even my toaster’s lagging.",
      type: "joke",
    },
    {
      content:
        "Wanted: AI therapist. Must listen to my existential dread about neon lights.",
      type: "joke",
    },
    {
      content:
        "Selling invisible cloaks—100% effective if you can’t see the ad.",
      type: "joke",
    },
    {
      content:
        "If you hear a dog barking at night, it’s probably just a modded speaker.",
      type: "joke",
    },
    {
      content:
        "Request: seasoned hacker to explain why my coffee machine thinks it’s sentient.",
      type: "joke",
    },
    {
      content:
        "Offering free hugs… just kidding, I’ll charge you extra for emotional support.",
      type: "joke",
    },
    {
      content:
        "Wanted: translator for my junkyard robot that only speaks Klingon dialect.",
      type: "joke",
    },
    {
      content:
        "Selling genuine faux-artifacts. Real enough to fool your grandma.",
      type: "joke",
    },
    {
      content:
        "Looking for a bodyguard. Must not mind existential screams at 3AM.",
      type: "joke",
    },
  ],
  common: [
    {
      content: "It's a beautiful day outside, isn't it?",
      type: "common",
    },
    {
      content: "Just refueled my bike, fuel prices are killing me.",
      type: "common",
    },
    {
      content: "Anyone know a good noodle bar open past midnight?",
      type: "common",
    },
    {
      content: "Power flicker downtown—hope they fix the grid soon.",
      type: "common",
    },
    {
      content: "Picked up a new holo-deck game, totally immersive.",
      type: "common",
    },
    {
      content: "Rain’s coming, time to break out the old synth-jacket.",
      type: "common",
    },
    {
      content: "Street market’s got fresh produce today—tomatoes are a steal.",
      type: "common",
    },
    {
      content: "Chatted with the barkeep—turns out he’s a former mech jockey.",
      type: "common",
    },
    {
      content: "Traffic’s a nightmare with all these cargo drones overhead.",
      type: "common",
    },
    {
      content: "Moon’s full tonight—perfect for rooftop meets.",
      type: "common",
    },
  ],
};

export function getRandomMessage() {
  const roll = api.generator.rng();
  if (roll < 0.05) {
    const arr = postMessageContent.gig_potential;
    return arr[Math.floor(api.generator.rng() * arr.length)];
  } else if (roll < 0.2) {
    const arr = postMessageContent.joke;
    return arr[Math.floor(api.generator.rng() * arr.length)];
  } else {
    const arr = postMessageContent.common;
    return arr[Math.floor(api.generator.rng() * arr.length)];
  }
}
