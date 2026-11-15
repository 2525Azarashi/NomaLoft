// Bespoke Minimalist Line-Art & Architectural Cafe Vignettes (Kyoto / Osaka Zine Style)
// 100% Original Inline SVG Data URIs — Zero Emojis, Zero Stock Clichés

const toSvgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`

export const KANSAI_VIGNETTES = {
  kitahamaRiver: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#F2EBE0"/>
      <rect x="18" y="18" width="524" height="324" rx="8" fill="none" stroke="#241D18" stroke-width="1.2" opacity="0.25"/>
      <!-- Nakanoshima River Arch Window -->
      <path d="M76 280 V120 C76 58 224 58 224 120 V280 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <line x1="150" y1="74" x2="150" y2="280" stroke="#241D18" stroke-width="1.4"/>
      <line x1="76" y1="176" x2="224" y2="176" stroke="#241D18" stroke-width="1.4"/>
      <!-- River ripples outside window -->
      <path d="M96 232 Q122 226 148 232 T204 232" fill="none" stroke="#8C9E9E" stroke-width="1.6" stroke-linecap="round"/>
      <path d="M104 248 Q130 242 156 248 T196 248" fill="none" stroke="#8C9E9E" stroke-width="1.6" stroke-linecap="round"/>
      <!-- Minimal Pendant Light -->
      <line x1="378" y1="18" x2="378" y2="96" stroke="#241D18" stroke-width="1.8"/>
      <path d="M342 122 C342 96 414 96 414 122 Z" fill="#C26347" stroke="#241D18" stroke-width="2"/>
      <!-- Long Timber Counter -->
      <rect x="48" y="268" width="464" height="14" rx="3" fill="#D5B895" stroke="#241D18" stroke-width="2"/>
      <line x1="98" y1="282" x2="98" y2="342" stroke="#241D18" stroke-width="2"/>
      <line x1="462" y1="282" x2="462" y2="342" stroke="#241D18" stroke-width="2"/>
      <!-- Laptop & V60 Pour Over -->
      <path d="M254 206 H356 L348 268 H246 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="2" stroke-linejoin="round"/>
      <rect x="232" y="264" width="128" height="5" rx="2" fill="#241D18"/>
      <polygon points="402,226 442,226 432,250 412,250" fill="#FBF8F3" stroke="#241D18" stroke-width="1.8"/>
      <rect x="408" y="250" width="28" height="18" rx="4" fill="#E5D8C5" stroke="#241D18" stroke-width="1.8"/>
      <path d="M422 214 C420 206 426 202 423 194" fill="none" stroke="#C26347" stroke-width="1.6" stroke-linecap="round"/>
      <text x="492" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">OSAKA / KITAHAMA</text>
    </svg>
  `),
  nakazakiNagaya: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#EFE7DA"/>
      <!-- Exposed Wooden Roof Beams (Nagaya Loft) -->
      <line x1="40" y1="90" x2="280" y2="32" stroke="#241D18" stroke-width="3"/>
      <line x1="520" y1="90" x2="280" y2="32" stroke="#241D18" stroke-width="3"/>
      <line x1="90" y1="78" x2="470" y2="78" stroke="#241D18" stroke-width="2"/>
      <!-- Shoji / Lattice Window -->
      <rect x="88" y="114" width="136" height="136" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <line x1="133" y1="114" x2="133" y2="250" stroke="#241D18" stroke-width="1.2"/>
      <line x1="179" y1="114" x2="179" y2="250" stroke="#241D18" stroke-width="1.2"/>
      <line x1="88" y1="160" x2="224" y2="160" stroke="#241D18" stroke-width="1.2"/>
      <line x1="88" y1="205" x2="224" y2="205" stroke="#241D18" stroke-width="1.2"/>
      <!-- Warm Brass Lamp & Desk -->
      <path d="M316 276 V178 C316 154 346 154 352 172" fill="none" stroke="#241D18" stroke-width="2.2"/>
      <polygon points="340,170 374,170 382,188 332,188" fill="#DFC082" stroke="#241D18" stroke-width="1.8"/>
      <rect x="248" y="276" width="244" height="12" rx="3" fill="#C9A882" stroke="#241D18" stroke-width="2"/>
      <!-- Cute Minimal Line-Art Cat Sleeping Near Laptop -->
      <path d="M412 276 C412 256 448 256 448 276 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="1.8"/>
      <path d="M417 262 L415 253 L424 258" fill="#FBF8F3" stroke="#241D18" stroke-width="1.6"/>
      <path d="M443 262 L445 253 L436 258" fill="#FBF8F3" stroke="#241D18" stroke-width="1.6"/>
      <text x="492" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">OSAKA / NAKAZAKICHO</text>
    </svg>
  `),
  umedaTerminal: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#F4EFE6"/>
      <!-- Acoustic Booth + External 4K Display -->
      <rect x="64" y="68" width="132" height="218" rx="10" fill="#E1EAE1" stroke="#241D18" stroke-width="2"/>
      <rect x="80" y="86" width="100" height="142" rx="6" fill="#FBF8F3" stroke="#241D18" stroke-width="1.6"/>
      <text x="130" y="114" text-anchor="middle" font-family="monospace" font-size="10" fill="#241D18">SILENT BOOTH</text>
      <!-- Wide Monitor Setup -->
      <rect x="242" y="136" width="176" height="102" rx="8" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <line x1="264" y1="204" x2="306" y2="176" stroke="#4F7356" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="306" y1="176" x2="338" y2="192" stroke="#4F7356" stroke-width="2.4" stroke-linecap="round"/>
      <line x1="338" y1="192" x2="392" y2="158" stroke="#C26347" stroke-width="2.4" stroke-linecap="round"/>
      <rect x="318" y="238" width="24" height="32" fill="#D8CCB8" stroke="#241D18" stroke-width="1.8"/>
      <rect x="218" y="270" width="278" height="14" rx="3" fill="#C9A882" stroke="#241D18" stroke-width="2"/>
      <!-- Espresso Cup -->
      <rect x="442" y="244" width="28" height="26" rx="5" fill="#FBF8F3" stroke="#241D18" stroke-width="1.8"/>
      <text x="504" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">OSAKA / UMEDA</text>
    </svg>
  `),
  horieCraft: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#F3ECE1"/>
      <!-- Mid-century Shelving & Plants -->
      <line x1="68" y1="112" x2="268" y2="112" stroke="#241D18" stroke-width="2"/>
      <rect x="86" y="74" width="28" height="38" rx="4" fill="#C26347" stroke="#241D18" stroke-width="1.8"/>
      <circle cx="156" cy="92" r="19" fill="#DFC082" stroke="#241D18" stroke-width="1.8"/>
      <rect x="202" y="80" width="42" height="32" rx="3" fill="#FBF8F3" stroke="#241D18" stroke-width="1.8"/>
      <!-- Designer Round Table & Chair -->
      <ellipse cx="356" cy="258" rx="136" ry="18" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <line x1="356" y1="276" x2="356" y2="338" stroke="#241D18" stroke-width="3"/>
      <path d="M288 202 H374 L366 254 H280 Z" fill="#EAE2D3" stroke="#241D18" stroke-width="2"/>
      <!-- Botanical Pot -->
      <rect x="92" y="248" width="54" height="62" rx="6" fill="#D5B895" stroke="#241D18" stroke-width="2"/>
      <path d="M119 248 C92 210 98 176 119 162 C140 176 146 210 119 248 Z" fill="#849E85" stroke="#241D18" stroke-width="1.8"/>
      <text x="504" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">OSAKA / HORIE</text>
    </svg>
  `),
  kyotoMachiya: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#EFE9DE"/>
      <!-- Kyoto Machiya Round Tsuboniwa Window -->
      <circle cx="168" cy="166" r="78" fill="#FBF8F3" stroke="#241D18" stroke-width="2.2"/>
      <!-- Bamboo & Maple silhouette inside round window -->
      <line x1="144" y1="92" x2="144" y2="240" stroke="#4F7356" stroke-width="3"/>
      <line x1="166" y1="88" x2="166" y2="244" stroke="#4F7356" stroke-width="2.2"/>
      <path d="M166 148 Q194 136 206 152 Q184 162 166 148 Z" fill="#849E85" stroke="#241D18" stroke-width="1.3"/>
      <!-- Low Cedar Counter + Matcha Bowl & MacBook -->
      <rect x="56" y="274" width="448" height="14" rx="2" fill="#BFA07A" stroke="#241D18" stroke-width="2"/>
      <path d="M294 212 H396 L388 274 H286 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <path d="M424 250 H468 C468 268 458 274 446 274 C434 274 424 268 424 250 Z" fill="#849E85" stroke="#241D18" stroke-width="1.8"/>
      <text x="504" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">KYOTO / KARASUMA</text>
    </svg>
  `),
  kamogawaPage: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#F5F0E6"/>
      <!-- Wide Terrace Window Facing Kamogawa -->
      <rect x="58" y="68" width="444" height="164" rx="4" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <line x1="206" y1="68" x2="206" y2="232" stroke="#241D18" stroke-width="1.6"/>
      <line x1="354" y1="68" x2="354" y2="232" stroke="#241D18" stroke-width="1.6"/>
      <!-- Distant Higashiyama mountains -->
      <path d="M58 192 Q132 146 212 184 T376 172 T502 188 V232 H58 Z" fill="#DCE4D8" stroke="#241D18" stroke-width="1.4"/>
      <!-- Counter Workstations -->
      <rect x="44" y="272" width="472" height="14" rx="3" fill="#D5B895" stroke="#241D18" stroke-width="2"/>
      <path d="M138 214 H232 L224 272 H130 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <rect x="272" y="252" width="52" height="20" rx="3" fill="#DFC082" stroke="#241D18" stroke-width="1.8"/>
      <text x="504" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">KYOTO / KAMOGAWA</text>
    </svg>
  `),
  kobeStone: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#EDE5D8"/>
      <!-- Classical Kyukyoryuchi Stone Columns & Tall Arches -->
      <path d="M92 284 V126 C92 78 182 78 182 126 V284 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <path d="M214 284 V126 C214 78 304 78 304 126 V284 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <!-- Espresso Machine Silhouette -->
      <rect x="358" y="198" width="98" height="74" rx="6" fill="#E3D7C4" stroke="#241D18" stroke-width="2"/>
      <rect x="372" y="182" width="70" height="16" rx="3" fill="#C26347" stroke="#241D18" stroke-width="1.8"/>
      <rect x="48" y="272" width="464" height="16" rx="3" fill="#B89672" stroke="#241D18" stroke-width="2"/>
      <text x="504" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">KOBE / KYUKYORYUCHI</text>
    </svg>
  `),
  kobeHarbor: toSvgUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 560 360">
      <rect width="560" height="360" fill="#F4EFE6"/>
      <!-- Minimalist Bookshelf & Cozy Lounge -->
      <rect x="72" y="84" width="188" height="168" rx="6" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <line x1="72" y1="140" x2="260" y2="140" stroke="#241D18" stroke-width="1.6"/>
      <line x1="72" y1="196" x2="260" y2="196" stroke="#241D18" stroke-width="1.6"/>
      <rect x="92" y="102" width="16" height="38" fill="#C26347" stroke="#241D18" stroke-width="1.4"/>
      <rect x="112" y="108" width="14" height="32" fill="#DFC082" stroke="#241D18" stroke-width="1.4"/>
      <rect x="130" y="98" width="18" height="42" fill="#849E85" stroke="#241D18" stroke-width="1.4"/>
      <!-- Wide Desk & Task Chair -->
      <rect x="292" y="252" width="204" height="14" rx="3" fill="#C9A882" stroke="#241D18" stroke-width="2"/>
      <path d="M336 196 H430 L422 252 H328 Z" fill="#FBF8F3" stroke="#241D18" stroke-width="2"/>
      <text x="504" y="46" text-anchor="end" font-family="monospace" font-size="11" fill="#7A6E65">KOBE / MOTOMACHI</text>
    </svg>
  `)
}
