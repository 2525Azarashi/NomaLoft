import { CAFE_ART } from './illustrations'

export interface HourlyStat {
  hour: string
  crowd: number // 0 - 100
  wifiScore: number // 0 - 100
}

export interface SpotReview {
  id: string
  author: string
  avatar: string
  role: string
  comment: string
  timeAgo: string
  vibeTag: string
}

export interface WorkSpot {
  id: string
  name: string
  nameEn: string
  category: 'cafe' | 'coworking' | 'roastery' | 'library_cafe'
  categoryLabel: string
  area: string
  station: string
  walkMinutes: number
  lat: number
  lng: number
  imageUrl: string
  subImageUrl: string
  badge: string
  catchcopy: string
  description: string
  wifiMbps: number
  wifiStability: number // 0 - 100
  outletRatio: number // 0 - 100 (% of seats with power)
  crowdLevel: number // 0 - 100 (lower is emptier)
  quietness: number // 0 - 100
  coffeeScore: number // 0 - 100
  chairComfort: number // 0 - 100
  callAllowed: 'ok' | 'booth_only' | 'ng'
  callLabel: string
  priceRange: string
  signatureDrink: string
  signaturePrice: string
  openHours: string
  isOpenNow: boolean
  seatsAvailable: number
  totalSeats: number
  tags: string[]
  mascotMood: 'latte' | 'croissant' | 'bean' | 'muffin' | 'matcha'
  hourlyStats: HourlyStat[]
  reviews: SpotReview[]
}

export const PRESET_AREAS = [
  { id: 'shibuya', name: '渋谷・神南', nameEn: 'Shibuya', lat: 35.6619, lng: 139.6995, emoji: '🐕' },
  { id: 'daikanyama', name: '代官山・恵比寿', nameEn: 'Daikanyama', lat: 35.6488, lng: 139.7032, emoji: '🥐' },
  { id: 'omotesando', name: '表参道・青山', nameEn: 'Omotesando', lat: 35.6652, lng: 139.7123, emoji: '🌿' },
  { id: 'nakameguro', name: '中目黒・池尻', nameEn: 'Nakameguro', lat: 35.6443, lng: 139.6982, emoji: '🌸' },
  { id: 'shimokita', name: '下北沢・東北沢', nameEn: 'Shimokitazawa', lat: 35.6616, lng: 139.6683, emoji: '🎸' }
]

export const WORK_SPOTS: WorkSpot[] = [
  {
    id: 'spot-oat-loft',
    name: 'Oat & Timber Loft 渋谷神南',
    nameEn: 'Oat & Timber Loft',
    category: 'cafe',
    categoryLabel: 'ワークカフェ',
    area: '渋谷・神南',
    station: '渋谷駅 B1出口',
    walkMinutes: 5,
    lat: 35.6634,
    lng: 139.6998,
    imageUrl: CAFE_ART.oatLoft,
    subImageUrl: 'https://sspark.genspark.ai/i/81znq8BwVCgoGXQl?width=900',
    badge: '👑 ノマド人気 No.1',
    catchcopy: '焼きたてオーツクッキーの香りと、全席2口コンセントの屋根裏ロフト。',
    description: '北向きの大きな天窓から柔らかな自然光が差し込む、PCワーカー専用ゾーン完備のベーカリーカフェ。木製ワイドデスクは奥行き75cmでMacBook ProとiPadを並べても余裕たっぷり。',
    wifiMbps: 340,
    wifiStability: 98,
    outletRatio: 95,
    crowdLevel: 38,
    quietness: 78,
    coffeeScore: 96,
    chairComfort: 92,
    callAllowed: 'ok',
    callLabel: 'Web会議OK（窓際エリア）',
    priceRange: '¥650〜',
    signatureDrink: '焦がしハニーオーツラテ',
    signaturePrice: '¥680',
    openHours: '08:00 - 22:00',
    isOpenNow: true,
    seatsAvailable: 14,
    totalSeats: 36,
    tags: ['全席電源', '爆速Wi-Fi 6E', 'Web会議OK', 'オーツミルク無料変更', '長居歓迎', '自然光たっぷり'],
    mascotMood: 'latte',
    hourlyStats: [
      { hour: '08h', crowd: 22, wifiScore: 99 },
      { hour: '10h', crowd: 45, wifiScore: 98 },
      { hour: '12h', crowd: 62, wifiScore: 95 },
      { hour: '14h', crowd: 38, wifiScore: 98 },
      { hour: '16h', crowd: 54, wifiScore: 96 },
      { hour: '18h', crowd: 40, wifiScore: 98 },
      { hour: '20h', crowd: 25, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'r1',
        author: 'Haruka.M',
        avatar: '🥨',
        role: 'UI Designer',
        comment: '机の木の質感がサラサラで気持ちいい！オーツラテのフォームがふわふわで午後3時の集中力が爆上がりします。',
        timeAgo: '14分前',
        vibeTag: '集中モード最高'
      },
      {
        id: 'r2',
        author: 'Kenji_Dev',
        avatar: '☕',
        role: 'Frontend Eng.',
        comment: '実測340Mbps出ててDocker pullが一瞬でした。椅子のクッションも厚めで4時間座っても腰が痛くならない！',
        timeAgo: '1時間前',
        vibeTag: '回線が神'
      }
    ]
  },
  {
    id: 'spot-moku-guild',
    name: 'MOKU Co-Roastery & Desk',
    nameEn: 'MOKU Co-Roastery',
    category: 'coworking',
    categoryLabel: 'カフェ併設コワーキング',
    area: '渋谷・神南',
    station: '渋谷駅 ハチ公口',
    walkMinutes: 7,
    lat: 35.6604,
    lng: 139.6962,
    imageUrl: CAFE_ART.roasteryCowork,
    subImageUrl: 'https://sspark.genspark.ai/i/RHBo0XUWvcD65Tcx?width=900',
    badge: '⚡ 4Kモニター無料貸出',
    catchcopy: '自家焙煎のスペシャルティ珈琲が飲み放題。防音フォンブース3室完備！',
    description: '1階は誰でも立ち寄れるロースタリーカフェ、2階は1時間単位でドロップインできるベージュ＆オーク材のコワーキングロフト。USB-C給電対応の27インチモニター席が大人気。',
    wifiMbps: 520,
    wifiStability: 99,
    outletRatio: 100,
    crowdLevel: 44,
    quietness: 88,
    coffeeScore: 94,
    chairComfort: 98,
    callAllowed: 'booth_only',
    callLabel: '防音ブース無料（3室）',
    priceRange: '¥880 / 1h〜',
    signatureDrink: 'ハンドドリップ 浅煎りエチオピア',
    signaturePrice: 'ドロップイン込',
    openHours: '07:30 - 23:00',
    isOpenNow: true,
    seatsAvailable: 19,
    totalSeats: 48,
    tags: ['全席電源', 'USB-Cモニター', '防音ブース', 'ハーマンミラー椅子', 'フリーコーヒー', '朝活7:30〜'],
    mascotMood: 'bean',
    hourlyStats: [
      { hour: '08h', crowd: 30, wifiScore: 100 },
      { hour: '10h', crowd: 52, wifiScore: 99 },
      { hour: '12h', crowd: 48, wifiScore: 99 },
      { hour: '14h', crowd: 44, wifiScore: 99 },
      { hour: '16h', crowd: 65, wifiScore: 97 },
      { hour: '18h', crowd: 50, wifiScore: 99 },
      { hour: '20h', crowd: 28, wifiScore: 100 }
    ],
    reviews: [
      {
        id: 'r3',
        author: 'Sora_PM',
        avatar: '🥐',
        role: 'Product Manager',
        comment: '急なクライアントMTGでも防音ブースが空いてるので本当に助かる！内装がカフェみたいに可愛くて堅苦しさゼロ。',
        timeAgo: '28分前',
        vibeTag: 'MTG救世主'
      }
    ]
  },
  {
    id: 'spot-beurre-study',
    name: 'Café Beurre & Page 代官山',
    nameEn: 'Cafe Beurre & Page',
    category: 'library_cafe',
    categoryLabel: 'ブック＆ワークカフェ',
    area: '代官山・恵比寿',
    station: '代官山駅 正面口',
    walkMinutes: 3,
    lat: 35.6496,
    lng: 139.7028,
    imageUrl: CAFE_ART.bookCafe,
    subImageUrl: 'https://sspark.genspark.ai/i/g01x4u3bLSJQVmPd?width=900',
    badge: '🤫 圧倒的もくもく空間',
    catchcopy: '発酵バタークロワッサンと洋書に囲まれる、私語控えめの集中サンクチュアリ。',
    description: 'デザイン書やアートブックが並ぶ壁面カウンターに、真鍮製の可愛いデスクランプと個別コンセントを配置。キーボードの打鍵音とレコードの小さなジャズだけが心地よく響きます。',
    wifiMbps: 260,
    wifiStability: 96,
    outletRatio: 85,
    crowdLevel: 26,
    quietness: 97,
    coffeeScore: 95,
    chairComfort: 89,
    callAllowed: 'ng',
    callLabel: '通話NG（超集中エリア）',
    priceRange: '¥700〜',
    signatureDrink: 'バニラビーンズ・カフェオレ & 焼きたてクロワッサン',
    signaturePrice: '¥980',
    openHours: '09:00 - 21:00',
    isOpenNow: true,
    seatsAvailable: 11,
    totalSeats: 24,
    tags: ['超静か', '通話NGで安心', 'デスクランプ付', '絶品クロワッサン', 'ひとり席充実', 'レコードBGM'],
    mascotMood: 'croissant',
    hourlyStats: [
      { hour: '08h', crowd: 15, wifiScore: 98 },
      { hour: '10h', crowd: 28, wifiScore: 97 },
      { hour: '12h', crowd: 35, wifiScore: 96 },
      { hour: '14h', crowd: 26, wifiScore: 97 },
      { hour: '16h', crowd: 42, wifiScore: 95 },
      { hour: '18h', crowd: 31, wifiScore: 97 },
      { hour: '20h', crowd: 18, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'r4',
        author: 'Mina_Writer',
        avatar: '📖',
        role: 'Copywriter',
        comment: '原稿の締め切り前は必ずここ。手元の真鍮ライトを灯すとスイッチが入ります。クロワッサンがサクサクすぎて幸せ。',
        timeAgo: '42分前',
        vibeTag: '執筆が捗る'
      }
    ]
  },
  {
    id: 'spot-komorebi-terrace',
    name: 'Komorebi Brew & Work 表参道',
    nameEn: 'Komorebi Brew & Work',
    category: 'roastery',
    categoryLabel: 'グリーン・ロースタリー',
    area: '表参道・青山',
    station: '表参道駅 A4出口',
    walkMinutes: 4,
    lat: 35.6648,
    lng: 139.7115,
    imageUrl: CAFE_ART.greenTerrace,
    subImageUrl: 'https://sspark.genspark.ai/i/jdCHP24qXbXuNwwq?width=900',
    badge: '🌿 テラス電源席あり',
    catchcopy: '観葉植物のアーチと優しいミルクベージュの空間で、深呼吸しながら企画出し。',
    description: '店内のいたるところにオリーブやユーカリが揺れるバイオフィリック・ワークカフェ。屋根付きインナーテラスにも防滴コンセントがあり、春や秋は風を感じながらノマドワークが可能！',
    wifiMbps: 290,
    wifiStability: 94,
    outletRatio: 80,
    crowdLevel: 52,
    quietness: 74,
    coffeeScore: 97,
    chairComfort: 87,
    callAllowed: 'ok',
    callLabel: 'Web会議OK（テラス＆大テーブル）',
    priceRange: '¥680〜',
    signatureDrink: '宇治抹茶オーツミルクラテ',
    signaturePrice: '¥720',
    openHours: '08:30 - 20:30',
    isOpenNow: true,
    seatsAvailable: 9,
    totalSeats: 32,
    tags: ['植物たっぷり', 'Web会議OK', 'テラス電源', 'デカフェ充実', 'ブレスト向き', 'ペット同伴可'],
    mascotMood: 'matcha',
    hourlyStats: [
      { hour: '08h', crowd: 25, wifiScore: 96 },
      { hour: '10h', crowd: 48, wifiScore: 95 },
      { hour: '12h', crowd: 70, wifiScore: 92 },
      { hour: '14h', crowd: 52, wifiScore: 94 },
      { hour: '16h', crowd: 58, wifiScore: 93 },
      { hour: '18h', crowd: 34, wifiScore: 96 },
      { hour: '20h', crowd: 15, wifiScore: 98 }
    ],
    reviews: [
      {
        id: 'r5',
        author: 'Yuta_Brand',
        avatar: '🌿',
        role: 'Art Director',
        comment: 'アイデアが詰まった時に来ると必ず良い企画が浮かぶ不思議な場所。抹茶ラテのグラデーションが美しすぎます。',
        timeAgo: '1時間前',
        vibeTag: 'アイデア湧く'
      }
    ]
  },
  {
    id: 'spot-biscuit-hub',
    name: 'Biscuit & Byte Lounge 中目黒',
    nameEn: 'Biscuit & Byte Lounge',
    category: 'coworking',
    categoryLabel: 'クリエイターラウンジ',
    area: '中目黒・池尻',
    station: '中目黒駅 正面改札',
    walkMinutes: 4,
    lat: 35.6452,
    lng: 139.6991,
    imageUrl: CAFE_ART.biscuitLounge,
    subImageUrl: 'https://sspark.genspark.ai/i/8RmZpC4IG1Nm6xAv?width=900',
    badge: '🍪 3時のおやつタイム付',
    catchcopy: '1ギガ光回線×焼きたてスコーン！遊び心あふれるデザイナーズ・ラウンジ。',
    description: '目黒川沿いのリノベーションビル3階にある、曲線デスクとパステルベージュのソファが可愛いコワーキングカフェ。毎日15時に焼き上がるメープルビスケットの香りが名物です。',
    wifiMbps: 680,
    wifiStability: 99,
    outletRatio: 100,
    crowdLevel: 31,
    quietness: 84,
    coffeeScore: 93,
    chairComfort: 96,
    callAllowed: 'ok',
    callLabel: 'Web会議OK（全席イヤホン着用）',
    priceRange: '¥750 / 1h〜',
    signatureDrink: 'メープルソルト・フラットホワイト',
    signaturePrice: '¥660',
    openHours: '09:00 - 22:30',
    isOpenNow: true,
    seatsAvailable: 17,
    totalSeats: 34,
    tags: ['超高速680Mbps', '全席電源', 'Web会議OK', '焼きたてスコーン', '充電器貸出', '夜22時半まで'],
    mascotMood: 'muffin',
    hourlyStats: [
      { hour: '08h', crowd: 18, wifiScore: 100 },
      { hour: '10h', crowd: 33, wifiScore: 99 },
      { hour: '12h', crowd: 41, wifiScore: 99 },
      { hour: '14h', crowd: 31, wifiScore: 99 },
      { hour: '16h', crowd: 49, wifiScore: 98 },
      { hour: '18h', crowd: 44, wifiScore: 99 },
      { hour: '20h', crowd: 36, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'r6',
        author: 'Aoi_Motion',
        avatar: '🧁',
        role: 'Motion Designer',
        comment: '動画データのアップロードが爆速！しかも充電器やType-Cハブまで可愛いバスケットに入れて貸してくれます。',
        timeAgo: '50分前',
        vibeTag: '動画編集も余裕'
      }
    ]
  },
  {
    id: 'spot-milkfoam-attic',
    name: 'Milkfoam Attic 神泉・松濤',
    nameEn: 'Milkfoam Attic',
    category: 'cafe',
    categoryLabel: '隠れ家ロフトカフェ',
    area: '渋谷・神南',
    station: '神泉駅 北口 / 渋谷駅',
    walkMinutes: 6,
    lat: 35.6587,
    lng: 139.6939,
    imageUrl: CAFE_ART.milkfoamAttic,
    subImageUrl: 'https://sspark.genspark.ai/i/jAKA9qGnC2se1BAM?width=900',
    badge: '☁️ ふかふかソファ席',
    catchcopy: '渋谷の喧騒から徒歩6分。雲みたいなミルクフォームと過ごす秘密の屋根裏部屋。',
    description: '松濤の閑静な路地裏に佇む小さな2階建てカフェ。全席にひざ掛けブランケットと2口コンセント＆USB-Cポートを完備。夕方からはキャンドルライトに切り替わるチルワーク天国。',
    wifiMbps: 220,
    wifiStability: 95,
    outletRatio: 90,
    crowdLevel: 21,
    quietness: 92,
    coffeeScore: 98,
    chairComfort: 95,
    callAllowed: 'ng',
    callLabel: '通話NG（チル＆集中）',
    priceRange: '¥620〜',
    signatureDrink: 'クラウド・シナモンカプチーノ',
    signaturePrice: '¥650',
    openHours: '10:00 - 23:00',
    isOpenNow: true,
    seatsAvailable: 12,
    totalSeats: 20,
    tags: ['穴場スポット', '夜カフェ23時', 'USB-C直挿し', 'ふかふかソファ', '超静か', 'プリンが絶品'],
    mascotMood: 'latte',
    hourlyStats: [
      { hour: '08h', crowd: 10, wifiScore: 97 },
      { hour: '10h', crowd: 19, wifiScore: 96 },
      { hour: '12h', crowd: 29, wifiScore: 95 },
      { hour: '14h', crowd: 21, wifiScore: 96 },
      { hour: '16h', crowd: 34, wifiScore: 95 },
      { hour: '18h', crowd: 38, wifiScore: 94 },
      { hour: '20h', crowd: 42, wifiScore: 94 }
    ],
    reviews: [
      {
        id: 'r7',
        author: 'Ren_iOS',
        avatar: '☁️',
        role: 'Mobile Engineer',
        comment: '渋谷にいることを忘れる静けさ。コンセント横にType-Cポートが直接付いてるのでアダプタ要らずなのが神設計！',
        timeAgo: '2時間前',
        vibeTag: '秘密にしたい穴場'
      }
    ]
  },
  {
    id: 'spot-shimokita-vinyl-desk',
    name: 'Latte & Analog Desk 下北沢',
    nameEn: 'Latte & Analog Desk',
    category: 'coworking',
    categoryLabel: 'カルチャー・コワーキング',
    area: '下北沢・東北沢',
    station: '下北沢駅 東口',
    walkMinutes: 2,
    lat: 35.6619,
    lng: 139.6691,
    imageUrl: CAFE_ART.analogDesk,
    subImageUrl: 'https://sspark.genspark.ai/i/SMsWLSpHYh2tnxw9?width=900',
    badge: '🎧 ローファイBGM空間',
    catchcopy: '心地よいLo-Fiビートと浅煎りラテ。1日最大¥1,800で出入り自由なクリエイティブ基地。',
    description: '線路跡地エリアすぐそばの木の温もりあふれるワークラウンジ。ハイスツール席・ボックス席・靴を脱いでくつろげる小上がりロフト席の3ゾーン構成で気分転換も自由自在！',
    wifiMbps: 460,
    wifiStability: 98,
    outletRatio: 100,
    crowdLevel: 35,
    quietness: 82,
    coffeeScore: 92,
    chairComfort: 91,
    callAllowed: 'booth_only',
    callLabel: 'フォンブース2室無料',
    priceRange: '¥600 / 1h（1日最大¥1,800）',
    signatureDrink: '黒糖きなこソイラテ',
    signaturePrice: '¥580',
    openHours: '08:00 - 22:00',
    isOpenNow: true,
    seatsAvailable: 16,
    totalSeats: 38,
    tags: ['1日上限あり', '全席電源', 'Lo-Fi BGM', '飲食持込OK', '防音ブース', '駅徒歩2分'],
    mascotMood: 'croissant',
    hourlyStats: [
      { hour: '08h', crowd: 16, wifiScore: 99 },
      { hour: '10h', crowd: 31, wifiScore: 98 },
      { hour: '12h', crowd: 44, wifiScore: 98 },
      { hour: '14h', crowd: 35, wifiScore: 98 },
      { hour: '16h', crowd: 48, wifiScore: 97 },
      { hour: '18h', crowd: 39, wifiScore: 98 },
      { hour: '20h', crowd: 27, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'r8',
        author: 'Kaho_Illust',
        avatar: '🎨',
        role: 'Illustrator',
        comment: 'iPadで絵を描くのに最高のテーブル角度！小上がりロフト席が秘密基地みたいでワクワクします。',
        timeAgo: '3時間前',
        vibeTag: '秘密基地感100%'
      }
    ]
  },
  {
    id: 'spot-toast-atelier',
    name: 'Brioche & Beam 恵比寿ガーデン',
    nameEn: 'Brioche & Beam',
    category: 'cafe',
    categoryLabel: 'ベーカリー＆テラスワーク',
    area: '代官山・恵比寿',
    station: '恵比寿駅 西口',
    walkMinutes: 5,
    lat: 35.6469,
    lng: 139.7081,
    imageUrl: CAFE_ART.briocheBeam,
    subImageUrl: 'https://sspark.genspark.ai/i/dQmYCktEB1o20nle?width=900',
    badge: '🍞 朝8時モーニング割',
    catchcopy: '厚切りブリオッシュトーストで始まる最高の朝活。広々ラウンドテーブル完備！',
    description: '高い天井とアーチ窓が印象的なヨーロピアン・ベージュのカフェ。朝8:00〜11:00はドリンク代だけでミニブリオッシュが付くノマド応援モーニングを実施中。',
    wifiMbps: 310,
    wifiStability: 96,
    outletRatio: 88,
    crowdLevel: 42,
    quietness: 80,
    coffeeScore: 95,
    chairComfort: 90,
    callAllowed: 'ok',
    callLabel: 'Web会議OK（奥のワークゾーン）',
    priceRange: '¥640〜',
    signatureDrink: 'アーモンドプラリネラテ',
    signaturePrice: '¥690',
    openHours: '08:00 - 21:30',
    isOpenNow: true,
    seatsAvailable: 13,
    totalSeats: 35,
    tags: ['朝活モーニング', 'Web会議OK', '電源充実', '広々デスク', 'アーチ窓', 'ブリオッシュ名物'],
    mascotMood: 'muffin',
    hourlyStats: [
      { hour: '08h', crowd: 36, wifiScore: 97 },
      { hour: '10h', crowd: 50, wifiScore: 96 },
      { hour: '12h', crowd: 64, wifiScore: 94 },
      { hour: '14h', crowd: 42, wifiScore: 96 },
      { hour: '16h', crowd: 46, wifiScore: 96 },
      { hour: '18h', crowd: 33, wifiScore: 97 },
      { hour: '20h', crowd: 20, wifiScore: 98 }
    ],
    reviews: [
      {
        id: 'r9',
        author: 'Takumi_Data',
        avatar: '📊',
        role: 'Data Scientist',
        comment: '朝8時に来てブリオッシュを食べながらコードを書くのが週3のルーティン。店員さんの笑顔にも癒やされます！',
        timeAgo: '3時間前',
        vibeTag: '朝活ルーティン'
      }
    ]
  }
]

export const AUTOCOMPLETE_KEYWORDS = [
  { label: '爆速Wi-Fi 300Mbps以上', type: 'feature', query: '爆速', icon: '⚡' },
  { label: '全席電源・コンセント完備', type: 'feature', query: '全席電源', icon: '🔌' },
  { label: 'Web会議・通話OK', type: 'feature', query: 'Web会議OK', icon: '🎧' },
  { label: '防音フォンブースあり', type: 'feature', query: '防音ブース', icon: '🚪' },
  { label: '超静か・もくもく集中空間', type: 'feature', query: '超静か', icon: '🤫' },
  { label: 'USB-Cモニター貸出', type: 'feature', query: 'モニター', icon: '🖥️' },
  { label: '朝活モーニング（8時台オープン）', type: 'feature', query: '朝活', icon: '☀️' },
  { label: '夜カフェ（22時以降OK）', type: 'feature', query: '夜', icon: '🌙' },
  { label: '焼きたてクロワッサン・スコーン', type: 'menu', query: 'クロワッサン', icon: '🥐' },
  { label: '渋谷・神南エリア', type: 'area', query: '渋谷', icon: '🐕' },
  { label: '代官山・恵比寿エリア', type: 'area', query: '代官山', icon: '🌿' },
  { label: '表参道・青山エリア', type: 'area', query: '表参道', icon: '✨' },
  { label: '中目黒・池尻エリア', type: 'area', query: '中目黒', icon: '🌸' },
  { label: '下北沢・東北沢エリア', type: 'area', query: '下北沢', icon: '🎸' }
]
