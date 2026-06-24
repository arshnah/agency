// ════════════════════════════════════════════════
//  KOHAKU — Copy humanizer patch
//  Run: node patch2.mjs
//  Strips AI texture from About / Services / Contact / Water copy
// ════════════════════════════════════════════════
import { readFileSync, writeFileSync } from 'fs'

function patch(path, pairs) {
  let c = readFileSync(path, 'utf8')
  let hits = 0
  for (const [oldS, newS] of pairs) {
    if (c.includes(oldS)) { c = c.replaceAll(oldS, newS); hits++ }
    else console.log('  (skip, not found in ' + path + '):', oldS.slice(0, 40))
  }
  writeFileSync(path, c)
  console.log('✓ ' + path + ' — ' + hits + '/' + pairs.length + ' replaced')
}

// ── About.jsx ──
patch('src/components/About.jsx', [
  [
    'A creative agency that makes content people <span className="text-acid">actually remember.</span>',
    'We make ads people <span className="text-acid">screenshot, not skip.</span>'
  ],
  [
    'We use the most powerful creative tools available — directed with genuine intent. The result is work that stands out because it was designed to, not optimised for volume.',
    'Most agencies chase volume and the work starts to blur together. We go the other way. Every piece gets real creative direction, so it lands like a story someone wants to send to a friend. Manga panels, short films, webcomics, UGC, whatever the brand actually needs.'
  ],
  ['Who We Are', 'Who We Are'],
])

// ── Services.jsx ──
patch('src/components/Services.jsx', [
  [
    'Six formats.<br /><span className="text-acid">All unforgettable.</span>',
    'Six things<br /><span className="text-acid">we\u2019re good at.</span>'
  ],
  [
    '4\u201312 panel manga series. The format people screenshot and share. 40x more shares than standard ads.',
    'Four to twelve panel stories with your product woven in. People screenshot these and send them around. We\u2019ve seen them pull far more shares than a normal ad.'
  ],
  [
    '2\u20135 min short films with real narrative arcs. Cinematic quality at a fraction of production cost.',
    'Two to five minute films with an actual story, not a product demo. Cinematic quality without the cinematic budget.'
  ],
  [
    'Episodic content with recurring characters. Builds community, not just impressions.',
    'Episodic stuff with characters people come back for. Builds a following, not just a view count.'
  ],
  [
    'Platform-native content with real creative direction. Built for Reels, Shorts, TikTok.',
    'Platform-native content that still has real direction behind it. Made for Reels, Shorts, and TikTok, not churned out by a farm.'
  ],
  [
    'Pre-launch teaser + launch-day hero + post-launch series. An event, not an announcement.',
    'Teaser, launch day, then a follow-up series. Makes a launch feel like an event instead of a single post.'
  ],
  [
    'Consistent creative direction every month. Same visual language, same narrative voice.',
    'Same creative direction every month. Your whole feed starts to look like it belongs together.'
  ],
])

// ── Contact.jsx ──
patch('src/components/Contact.jsx', [
  [
    'Tell us what you\'re building. We\'ll tell you how to make it impossible to ignore.',
    'Tell us what you\'re building. We\'ll show you how to make people stop scrolling.'
  ],
])

console.log('\nDone. Ab chalao: npm run dev')
