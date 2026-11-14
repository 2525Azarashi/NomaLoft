// Custom Cozy Cafe SVG Cover Art Data URIs (100% Original & License-Free)
const svgData = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`

export const CAFE_ART = {
  oatLoft: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#F6ECDC"/>
      <!-- Arched Skylight Window -->
      <path d="M90 360 V135 C90 70 250 70 250 135 V360 Z" fill="#FFFDF8" stroke="#2E2018" stroke-width="5"/>
      <line x1="170" y1="82" x2="170" y2="360" stroke="#2E2018" stroke-width="3"/>
      <line x1="90" y1="210" x2="250" y2="210" stroke="#2E2018" stroke-width="3"/>
      <!-- Warm Sunbeams -->
      <polygon points="110,120 380,420 200,420" fill="#F8DF8C" opacity="0.28"/>
      <!-- Hanging Pendant Lamp -->
      <line x1="410" y1="0" x2="410" y2="95" stroke="#2E2018" stroke-width="4"/>
      <path d="M365 130 C365 92 455 92 455 130 Z" fill="#E88D72" stroke="#2E2018" stroke-width="4.5"/>
      <circle cx="410" cy="134" r="11" fill="#FFF7CC"/>
      <!-- Wooden Desk -->
      <rect x="60" y="295" width="490" height="24" rx="10" fill="#C99E6E" stroke="#2E2018" stroke-width="5"/>
      <rect x="95" y="319" width="22" height="101" fill="#A97D50" stroke="#2E2018" stroke-width="4"/>
      <rect x="485" y="319" width="22" height="101" fill="#A97D50" stroke="#2E2018" stroke-width="4"/>
      <!-- Open Laptop -->
      <path d="M230 210 H365 L355 290 H220 Z" fill="#FFFDF9" stroke="#2E2018" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="292" cy="250" r="14" fill="#F8DF8C" stroke="#2E2018" stroke-width="3.5"/>
      <rect x="200" y="287" width="175" height="9" rx="4" fill="#E8D7BC" stroke="#2E2018" stroke-width="4"/>
      <!-- Power Outlet Badge on Wall -->
      <rect x="475" y="232" width="44" height="36" rx="8" fill="#FFFDF9" stroke="#2E2018" stroke-width="3.5"/>
      <circle cx="489" cy="250" r="3" fill="#2E2018"/><circle cx="505" cy="250" r="3" fill="#2E2018"/>
      <!-- Steaming Oat Latte -->
      <path d="M405 246 H452 V276 C452 287 441 294 428 294 C415 294 405 287 405 276 Z" fill="#FFFDF9" stroke="#2E2018" stroke-width="4.5"/>
      <path d="M452 254 H462 C469 254 469 272 462 272 H452" fill="none" stroke="#2E2018" stroke-width="4.5"/>
      <path d="M420 232 C417 220 426 216 422 206" fill="none" stroke="#D97254" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M436 234 C433 222 442 218 438 208" fill="none" stroke="#C29F70" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
  `),
  roasteryCowork: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#EFE3CE"/>
      <!-- Acoustic Phone Booth in Background -->
      <rect x="70" y="75" width="145" height="255" rx="18" fill="#D8EAD9" stroke="#2E2018" stroke-width="5"/>
      <rect x="88" y="95" width="109" height="165" rx="10" fill="#FFFDF9" stroke="#2E2018" stroke-width="4"/>
      <text x="142" y="135" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="16" fill="#2E2018">BOOTH</text>
      <!-- Dual 4K Monitor Desk -->
      <rect x="240" y="145" width="195" height="115" rx="12" fill="#FFFDF9" stroke="#2E2018" stroke-width="5"/>
      <rect x="255" y="160" width="165" height="82" rx="6" fill="#FAF5EC" stroke="#2E2018" stroke-width="3"/>
      <path d="M275 215 L310 185 L345 205 L395 172" fill="none" stroke="#6D9F75" stroke-width="5" stroke-linecap="round"/>
      <rect x="325" y="260" width="26" height="35" fill="#D7BE98" stroke="#2E2018" stroke-width="4"/>
      <rect x="210" y="295" width="330" height="22" rx="9" fill="#B98B5E" stroke="#2E2018" stroke-width="5"/>
      <!-- Pour Over Dripper -->
      <polygon points="465,240 515,240 502,272 478,272" fill="#E88D72" stroke="#2E2018" stroke-width="4"/>
      <rect x="472" y="272" width="36" height="23" rx="6" fill="#FFFDF9" stroke="#2E2018" stroke-width="4"/>
    </svg>
  `),
  bookCafe: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#F8EFE2"/>
      <!-- Bookshelf -->
      <rect x="65" y="65" width="470" height="15" rx="6" fill="#C99E6E" stroke="#2E2018" stroke-width="4"/>
      <rect x="95" y="18" width="24" height="47" rx="4" fill="#E88D72" stroke="#2E2018" stroke-width="3.5"/>
      <rect x="123" y="24" width="20" height="41" rx="4" fill="#F8DF8C" stroke="#2E2018" stroke-width="3.5"/>
      <rect x="147" y="12" width="28" height="53" rx="4" fill="#8FB996" stroke="#2E2018" stroke-width="3.5"/>
      <rect x="182" y="20" width="22" height="45" rx="4" fill="#FFFDF9" stroke="#2E2018" stroke-width="3.5"/>
      <!-- Brass Desk Lamp -->
      <path d="M150 295 V175 Q150 135 195 145" fill="none" stroke="#2E2018" stroke-width="6" stroke-linecap="round"/>
      <path d="M180 140 L235 162 L200 185 Z" fill="#F2CA52" stroke="#2E2018" stroke-width="4.5" stroke-linejoin="round"/>
      <polygon points="205,182 310,295 140,295" fill="#F8DF8C" opacity="0.32"/>
      <!-- Croissant on Plate -->
      <ellipse cx="425" cy="286" rx="58" ry="13" fill="#FFFDF9" stroke="#2E2018" stroke-width="4"/>
      <path d="M388 278 C395 248 455 248 462 278 C445 286 405 286 388 278 Z" fill="#E4A458" stroke="#2E2018" stroke-width="4.5"/>
      <rect x="70" y="295" width="460" height="24" rx="10" fill="#C29668" stroke="#2E2018" stroke-width="5"/>
    </svg>
  `),
  greenTerrace: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#EFF4EC"/>
      <!-- Botanical Leaves -->
      <path d="M85 310 Q55 210 130 155 Q155 235 85 310 Z" fill="#8FB996" stroke="#2E2018" stroke-width="4.5"/>
      <path d="M105 310 Q145 215 205 190 Q185 265 105 310 Z" fill="#6D9F75" stroke="#2E2018" stroke-width="4.5"/>
      <rect x="72" y="295" width="60" height="65" rx="10" fill="#E88D72" stroke="#2E2018" stroke-width="4.5"/>
      <!-- Round Cafe Table + Matcha Latte + Laptop -->
      <ellipse cx="355" cy="295" rx="165" ry="24" fill="#FFFDF9" stroke="#2E2018" stroke-width="5"/>
      <rect x="342" y="319" width="26" height="95" fill="#2E2018"/>
      <path d="M265 212 H375 L365 284 H255 Z" fill="#FAF5EC" stroke="#2E2018" stroke-width="4.5"/>
      <rect x="415" y="242" width="42" height="46" rx="10" fill="#B8DFBF" stroke="#2E2018" stroke-width="4"/>
      <circle cx="495" cy="95" r="38" fill="#F8DF8C" stroke="#2E2018" stroke-width="4"/>
    </svg>
  `),
  biscuitLounge: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#FAF0E4"/>
      <rect x="75" y="185" width="450" height="125" rx="52" fill="#F4C7B8" stroke="#2E2018" stroke-width="5"/>
      <rect x="55" y="235" width="490" height="90" rx="34" fill="#FFFDF9" stroke="#2E2018" stroke-width="5"/>
      <rect x="215" y="72" width="170" height="54" rx="27" fill="#F8DF8C" stroke="#2E2018" stroke-width="4.5"/>
      <text x="300" y="106" text-anchor="middle" font-family="monospace" font-weight="bold" font-size="22" fill="#2E2018">680 Mbps⚡</text>
      <circle cx="260" cy="272" r="22" fill="#DDA15E" stroke="#2E2018" stroke-width="4"/>
      <circle cx="254" cy="267" r="2.5" fill="#2E2018"/><circle cx="268" cy="275" r="2.5" fill="#2E2018"/>
      <rect x="315" y="242" width="95" height="52" rx="8" fill="#E8D7BC" stroke="#2E2018" stroke-width="4"/>
    </svg>
  `),
  milkfoamAttic: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#F3E9D7"/>
      <polygon points="0,150 300,20 600,150 600,0 0,0" fill="#E8D7BC" stroke="#2E2018" stroke-width="4"/>
      <circle cx="300" cy="115" r="46" fill="#FFFDF9" stroke="#2E2018" stroke-width="4.5"/>
      <path d="M180 280 C180 230 420 230 420 280 Z" fill="#FFFDF9" stroke="#2E2018" stroke-width="4.5"/>
      <rect x="135" y="280" width="330" height="58" rx="26" fill="#D7BE98" stroke="#2E2018" stroke-width="5"/>
      <circle cx="465" cy="250" r="18" fill="#F8DF8C" stroke="#2E2018" stroke-width="3.5"/>
    </svg>
  `),
  analogDesk: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#F5EBDD"/>
      <rect x="95" y="95" width="165" height="165" rx="20" fill="#E88D72" stroke="#2E2018" stroke-width="5"/>
      <circle cx="177" cy="177" r="56" fill="#2E2018"/>
      <circle cx="177" cy="177" r="18" fill="#F8DF8C"/>
      <path d="M315 190 H455 L442 285 H302 Z" fill="#FFFDF9" stroke="#2E2018" stroke-width="5"/>
      <rect x="75" y="285" width="455" height="24" rx="10" fill="#C29F70" stroke="#2E2018" stroke-width="5"/>
    </svg>
  `),
  briocheBeam: svgData(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">
      <rect width="600" height="420" fill="#FCF5E8"/>
      <path d="M195 320 V135 C195 55 405 55 405 135 V320 Z" fill="#F8DF8C" opacity="0.45" stroke="#2E2018" stroke-width="4.5"/>
      <rect x="235" y="218" width="130" height="75" rx="22" fill="#E4A458" stroke="#2E2018" stroke-width="4.5"/>
      <circle cx="265" cy="218" r="24" fill="#E4A458" stroke="#2E2018" stroke-width="4.5"/>
      <circle cx="300" cy="212" r="26" fill="#E4A458" stroke="#2E2018" stroke-width="4.5"/>
      <circle cx="335" cy="218" r="24" fill="#E4A458" stroke="#2E2018" stroke-width="4.5"/>
      <rect x="90" y="293" width="420" height="24" rx="10" fill="#C99E6E" stroke="#2E2018" stroke-width="5"/>
    </svg>
  `)
}
