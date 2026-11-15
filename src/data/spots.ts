import { KANSAI_VIGNETTES } from './illustrations'

export interface HourlyStat {
  hour: string
  crowd: number // 0 - 100
  wifiScore: number // 0 - 100
}

export interface SpotReview {
  id: string
  author: string
  initials: string
  role: string
  comment: string
  timeAgo: string
  vibeTag: string
}

export interface WorkSpot {
  id: string
  code: string
  name: string
  nameEn: string
  city: 'osaka' | 'kyoto' | 'kobe'
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
  wifiStability: number
  outletRatio: number
  crowdLevel: number
  quietness: number
  coffeeScore: number
  chairComfort: number
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
  motif: 'dripper' | 'croissant' | 'bean' | 'lamp' | 'cup'
  hourlyStats: HourlyStat[]
  reviews: SpotReview[]
  source?: 'curated' | 'osm'
}

export const KANSAI_AREAS = [
  {
    id: 'kitahama',
    code: 'OSK-01',
    shortName: '北浜・中之島',
    name: '大阪・北浜 / 中之島',
    nameEn: 'KITAHAMA, OSAKA',
    lat: 34.6918,
    lng: 135.5064
  },
  {
    id: 'umeda',
    code: 'OSK-02',
    shortName: '梅田・中崎町',
    name: '大阪・梅田 / 中崎町',
    nameEn: 'UMEDA & NAKAZAKI',
    lat: 34.7055,
    lng: 135.5048
  },
  {
    id: 'horie',
    code: 'OSK-03',
    shortName: '心斎橋・堀江',
    name: '大阪・南船場 / 堀江',
    nameEn: 'HORIE & MINAMISENBA',
    lat: 34.6736,
    lng: 135.4952
  },
  {
    id: 'kyoto',
    code: 'KYO-01',
    shortName: '京都・烏丸河原町',
    name: '京都・烏丸御池 / 河原町',
    nameEn: 'KARASUMA, KYOTO',
    lat: 35.0086,
    lng: 135.7632
  },
  {
    id: 'kobe',
    code: 'KOB-01',
    shortName: '神戸・元町居留地',
    name: '神戸・旧居留地 / 元町',
    nameEn: 'KYUKYORYUCHI, KOBE',
    lat: 34.6882,
    lng: 135.1912
  }
]

export const WORK_SPOTS: WorkSpot[] = [
  {
    id: 'spot-kitahama-river',
    code: 'NL-01',
    name: 'Kitahama Riverbank Roastery',
    nameEn: 'KITAHAMA RIVERBANK',
    city: 'osaka',
    category: 'roastery',
    categoryLabel: '川沿いロースタリーカフェ',
    area: '大阪・北浜 / 中之島',
    station: '北浜駅 26番出口',
    walkMinutes: 2,
    lat: 34.6924,
    lng: 135.5071,
    imageUrl: KANSAI_VIGNETTES.kitahamaRiver,
    subImageUrl: 'https://sspark.genspark.ai/i/81znq8BwVCgoGXQl?width=900',
    badge: 'RIVERSIDE COUNTER',
    catchcopy: '土佐堀川の水面を眺めながら、全席AC電源付きのロングカウンターで深煎りドリップを。',
    description: '近代建築が並ぶ北浜エリアの川沿い1階・2階ロフト。奥行き72cmの無垢オーク材カウンター全18席に2口コンセントとUSB-Cポートを完備。朝7時半から開く関西ノマドの定番拠点です。',
    wifiMbps: 380,
    wifiStability: 98,
    outletRatio: 95,
    crowdLevel: 34,
    quietness: 84,
    coffeeScore: 97,
    chairComfort: 91,
    callAllowed: 'ok',
    callLabel: 'Web会議可（2Fリバーサイド席）',
    priceRange: '¥620〜',
    signatureDrink: '北浜ブレンド ハンドドリップ & オーツビスケット',
    signaturePrice: '¥780',
    openHours: '07:30 - 21:00',
    isOpenNow: true,
    seatsAvailable: 14,
    totalSeats: 34,
    tags: ['川沿いテラス', '全席電源', '高速Wi-Fi 6', '朝活7:30〜', 'Web会議可', '自家焙煎'],
    motif: 'dripper',
    hourlyStats: [
      { hour: '08h', crowd: 24, wifiScore: 99 },
      { hour: '10h', crowd: 42, wifiScore: 98 },
      { hour: '12h', crowd: 61, wifiScore: 95 },
      { hour: '14h', crowd: 34, wifiScore: 98 },
      { hour: '16h', crowd: 48, wifiScore: 97 },
      { hour: '18h', crowd: 36, wifiScore: 98 },
      { hour: '20h', crowd: 20, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'kr1',
        author: 'N. Takahashi',
        initials: 'NT',
        role: 'Product Designer',
        comment: '中之島のバラ園を見下ろす窓際席の採光が完璧。Figma作業が驚くほど捗るし、浅煎りのエチオピアが本当に美味しい。',
        timeAgo: '18分前',
        vibeTag: '採光と珈琲'
      },
      {
        id: 'kr2',
        author: 'K. Morimoto',
        initials: 'KM',
        role: 'Backend Engineer',
        comment: '実測380Mbps安定。カウンター下の真鍮フックにバックパックを掛けられる細やかな設計が嬉しい。',
        timeAgo: '1時間前',
        vibeTag: '回線安定'
      }
    ]
  },
  {
    id: 'spot-nakanoshima-arch',
    code: 'NL-02',
    name: 'Salon de Bibliothéque 中之島',
    nameEn: 'SALON NAKANOSHIMA',
    city: 'osaka',
    category: 'library_cafe',
    categoryLabel: '建築ブック＆ワークラウンジ',
    area: '大阪・北浜 / 中之島',
    station: 'なにわ橋駅 1番出口 / 淀屋橋駅',
    walkMinutes: 3,
    lat: 34.6932,
    lng: 135.5034,
    imageUrl: KANSAI_VIGNETTES.kobeStone,
    subImageUrl: 'https://sspark.genspark.ai/i/g01x4u3bLSJQVmPd?width=900',
    badge: 'SILENT READING DESK',
    catchcopy: '石造りアーチ天井と真鍮デスクランプ。私語控えめの圧倒的な集中時間が流れる図書室カフェ。',
    description: 'レトロビルの重厚な意匠を残した静寂ワークカフェ。建築・タイポグラフィ関連の洋書が並び、各席に手元照明と個別電源を備えています。原稿執筆や設計業務に最適。',
    wifiMbps: 290,
    wifiStability: 97,
    outletRatio: 90,
    crowdLevel: 25,
    quietness: 98,
    coffeeScore: 94,
    chairComfort: 93,
    callAllowed: 'ng',
    callLabel: '通話不可（サイレント集中空間）',
    priceRange: '¥680〜',
    signatureDrink: 'カフェ・クレーム & 発酵バターフィナンシェ',
    signaturePrice: '¥890',
    openHours: '09:00 - 21:30',
    isOpenNow: true,
    seatsAvailable: 12,
    totalSeats: 26,
    tags: ['超静寂', '真鍮ランプ席', '通話不可で安心', '洋書ライブラリー', 'ひとり席充実'],
    motif: 'lamp',
    hourlyStats: [
      { hour: '08h', crowd: 14, wifiScore: 99 },
      { hour: '10h', crowd: 26, wifiScore: 98 },
      { hour: '12h', crowd: 34, wifiScore: 97 },
      { hour: '14h', crowd: 25, wifiScore: 98 },
      { hour: '16h', crowd: 39, wifiScore: 96 },
      { hour: '18h', crowd: 29, wifiScore: 98 },
      { hour: '20h', crowd: 18, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'kr3',
        author: 'S. Fujii',
        initials: 'SF',
        role: 'Editorial Writer',
        comment: '大阪市内とは思えない静けさ。手元の真鍮ランプを灯すと自然に背筋が伸びて3時間ぶっ通しで書けました。',
        timeAgo: '40分前',
        vibeTag: '執筆特化'
      }
    ]
  },
  {
    id: 'spot-nakazaki-nagaya',
    code: 'NL-03',
    name: '古民家ロフト 焙煎所 舎 (SHA) 中崎町',
    nameEn: 'ROASTERY SHA NAKAZAKI',
    city: 'osaka',
    category: 'cafe',
    categoryLabel: '長屋リノベ・ロフトカフェ',
    area: '大阪・梅田 / 中崎町',
    station: '中崎町駅 2番出口 / 梅田駅',
    walkMinutes: 3,
    lat: 34.7068,
    lng: 135.5059,
    imageUrl: KANSAI_VIGNETTES.nakazakiNagaya,
    subImageUrl: 'https://sspark.genspark.ai/i/jdCHP24qXbXuNwwq?width=900',
    badge: 'WOODEN LOFT',
    catchcopy: '昭和初期の木造長屋を改装した屋根裏ワーク席。梁の見える漆喰空間で穏やかにPC作業。',
    description: '梅田から徒歩圏でありながら路地裏の穏やかな空気が流れる中崎町の長屋カフェ。2階はPCワーカー優先の広々とした古材テーブル席になっており、全席に延長タップと高速光回線を導入。',
    wifiMbps: 320,
    wifiStability: 96,
    outletRatio: 92,
    crowdLevel: 29,
    quietness: 90,
    coffeeScore: 96,
    chairComfort: 89,
    callAllowed: 'ng',
    callLabel: '通話控えめ（イヤホン聴講は可）',
    priceRange: '¥600〜',
    signatureDrink: '和三盆オーツラテ & 自家製カヌレ',
    signaturePrice: '¥820',
    openHours: '09:30 - 20:30',
    isOpenNow: true,
    seatsAvailable: 9,
    totalSeats: 22,
    tags: ['長屋リノベ', '隠れ家ロフト', '全席電源', '梅田徒歩圏', '自家製焼き菓子'],
    motif: 'cup',
    hourlyStats: [
      { hour: '08h', crowd: 12, wifiScore: 98 },
      { hour: '10h', crowd: 25, wifiScore: 97 },
      { hour: '12h', crowd: 38, wifiScore: 96 },
      { hour: '14h', crowd: 29, wifiScore: 97 },
      { hour: '16h', crowd: 46, wifiScore: 95 },
      { hour: '18h', crowd: 31, wifiScore: 97 },
      { hour: '20h', crowd: 15, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'kr4',
        author: 'A. Nishimura',
        initials: 'AN',
        role: 'Illustrator',
        comment: '木の匂いと障子越しの柔らかい光が最高に落ち着きます。梅田の人混みに疲れたら必ずここへ避難します。',
        timeAgo: '55分前',
        vibeTag: '長屋ロフト'
      }
    ]
  },
  {
    id: 'spot-umeda-terminal',
    code: 'NL-04',
    name: 'LOFTWORK STUDIO 芝田・うめきた',
    nameEn: 'LOFTWORK SHIBATA',
    city: 'osaka',
    category: 'coworking',
    categoryLabel: 'ドロップイン・コワーキング',
    area: '大阪・梅田 / 中崎町',
    station: '大阪駅 うめきた地下口 / 阪急大阪梅田駅',
    walkMinutes: 4,
    lat: 34.7042,
    lng: 135.4982,
    imageUrl: KANSAI_VIGNETTES.umedaTerminal,
    subImageUrl: 'https://sspark.genspark.ai/i/RHBo0XUWvcD65Tcx?width=900',
    badge: '4K DISPLAY & BOOTH',
    catchcopy: '10Gbps専有回線と防音テレフォンブース4室。バリスタ常駐のカフェラウンジ併設。',
    description: 'うめきたエリアすぐ横、1時間単位で会員登録なしでも気軽に使えるベージュ＆アッシュウッド調のワークスタジオ。USB-Cケーブル1本で映像出力＋90W給電できる27インチ4Kモニター席を16台常設。',
    wifiMbps: 690,
    wifiStability: 99,
    outletRatio: 100,
    crowdLevel: 43,
    quietness: 86,
    coffeeScore: 93,
    chairComfort: 98,
    callAllowed: 'booth_only',
    callLabel: '防音ブース無料（4室）・会議席あり',
    priceRange: '¥770 / 1h（1日最大¥2,400）',
    signatureDrink: 'フリースペシャルティドリップ（3種日替わり）',
    signaturePrice: '利用料に含む',
    openHours: '07:00 - 23:00',
    isOpenNow: true,
    seatsAvailable: 21,
    totalSeats: 52,
    tags: ['全席電源', 'USB-C 4Kモニター', '防音ブース', '超高速690Mbps', '朝7時〜夜23時'],
    motif: 'bean',
    hourlyStats: [
      { hour: '08h', crowd: 31, wifiScore: 100 },
      { hour: '10h', crowd: 54, wifiScore: 99 },
      { hour: '12h', crowd: 46, wifiScore: 99 },
      { hour: '14h', crowd: 43, wifiScore: 99 },
      { hour: '16h', crowd: 62, wifiScore: 98 },
      { hour: '18h', crowd: 49, wifiScore: 99 },
      { hour: '20h', crowd: 28, wifiScore: 100 }
    ],
    reviews: [
      {
        id: 'kr5',
        author: 'R. Kawaguchi',
        initials: 'RK',
        role: 'Tech Lead',
        comment: '新幹線・JR移動の合間に2時間だけ寄れる神立地。コワーキング特有の無機質さがなく、北欧カフェのような居心地。',
        timeAgo: '32分前',
        vibeTag: '4K外部出力'
      }
    ]
  },
  {
    id: 'spot-horie-craft',
    code: 'NL-05',
    name: 'ATELIER BEIGE & ESPRESSO 北堀江',
    nameEn: 'ATELIER BEIGE HORIE',
    city: 'osaka',
    category: 'cafe',
    categoryLabel: '家具ショールーム併設カフェ',
    area: '大阪・南船場 / 堀江',
    station: '四ツ橋駅 4番出口 / 心斎橋駅',
    walkMinutes: 3,
    lat: 34.6742,
    lng: 135.4938,
    imageUrl: KANSAI_VIGNETTES.horieCraft,
    subImageUrl: 'https://sspark.genspark.ai/i/SMsWLSpHYh2tnxw9?width=900',
    badge: 'CRAFT FURNITURE',
    catchcopy: '堀江の家具職人が仕立てた人間工学ウッドチェアを実際に試せる、広々テーブルのワークカフェ。',
    description: 'オーダー家具工房が運営する北堀江の路面カフェ。すべての席で異なる国産無垢材チェアに座ってPC作業ができ、天板裏に目立たないよう埋め込まれたスマートコンセントが秀逸です。',
    wifiMbps: 410,
    wifiStability: 97,
    outletRatio: 94,
    crowdLevel: 36,
    quietness: 82,
    coffeeScore: 95,
    chairComfort: 99,
    callAllowed: 'ok',
    callLabel: 'Web会議可（大テーブル＆窓際席）',
    priceRange: '¥650〜',
    signatureDrink: 'フラットホワイト & カルダモンロール',
    signaturePrice: '¥920',
    openHours: '08:30 - 21:00',
    isOpenNow: true,
    seatsAvailable: 15,
    totalSeats: 36,
    tags: ['名作チェア体験', '全席電源', 'Web会議可', '広々デスク', 'カルダモンロール'],
    motif: 'croissant',
    hourlyStats: [
      { hour: '08h', crowd: 20, wifiScore: 99 },
      { hour: '10h', crowd: 38, wifiScore: 98 },
      { hour: '12h', crowd: 55, wifiScore: 96 },
      { hour: '14h', crowd: 36, wifiScore: 97 },
      { hour: '16h', crowd: 51, wifiScore: 96 },
      { hour: '18h', crowd: 33, wifiScore: 98 },
      { hour: '20h', crowd: 19, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'kr6',
        author: 'Y. Doi',
        initials: 'YD',
        role: 'Architect',
        comment: '椅子の座り心地が異次元。そのまま自分の書斎用に1脚オーダーしそうになりました。カルダモンロールも絶品。',
        timeAgo: '1時間前',
        vibeTag: '椅子が極上'
      }
    ]
  },
  {
    id: 'spot-kyoto-machiya',
    code: 'NL-06',
    name: '茶寮 焙 (BAI) WORKROOM 烏丸御池',
    nameEn: 'SARYO BAI KYOTO',
    city: 'kyoto',
    category: 'coworking',
    categoryLabel: '京町家ワークラウンジ＆焙煎所',
    area: '京都・烏丸御池 / 河原町',
    station: '烏丸御池駅 5番出口',
    walkMinutes: 4,
    lat: 35.0102,
    lng: 135.7604,
    imageUrl: KANSAI_VIGNETTES.kyotoMachiya,
    subImageUrl: 'https://sspark.genspark.ai/i/8RmZpC4IG1Nm6xAv?width=900',
    badge: 'KYOTO MACHIYA',
    catchcopy: '坪庭の青竹を望む京町家で、宇治碾茶ラテと自家焙煎珈琲を片手に静かなクリエイティブ時間。',
    description: '築95年の京町家を構造補強・断熱リノベーションしたワークラウンジ。1階はカフェ利用のみも可能な杉一枚板カウンター、2階はオンラインMTGブース付きのコワーキングロフトです。',
    wifiMbps: 540,
    wifiStability: 99,
    outletRatio: 100,
    crowdLevel: 31,
    quietness: 93,
    coffeeScore: 98,
    chairComfort: 94,
    callAllowed: 'booth_only',
    callLabel: '2F防音ブース2室（予約不要）',
    priceRange: '¥680〜 / 2F ¥700・1h',
    signatureDrink: '宇治手摘み抹茶オーツラテ',
    signaturePrice: '¥740',
    openHours: '08:00 - 21:00',
    isOpenNow: true,
    seatsAvailable: 16,
    totalSeats: 32,
    tags: ['京町家×坪庭', '全席電源', '高速540Mbps', '防音ブース', '宇治抹茶ラテ'],
    motif: 'dripper',
    hourlyStats: [
      { hour: '08h', crowd: 18, wifiScore: 100 },
      { hour: '10h', crowd: 34, wifiScore: 99 },
      { hour: '12h', crowd: 42, wifiScore: 98 },
      { hour: '14h', crowd: 31, wifiScore: 99 },
      { hour: '16h', crowd: 45, wifiScore: 98 },
      { hour: '18h', crowd: 29, wifiScore: 99 },
      { hour: '20h', crowd: 16, wifiScore: 100 }
    ],
    reviews: [
      {
        id: 'kr7',
        author: 'M. Hasegawa',
        initials: 'MH',
        role: 'Creative Director',
        comment: '京都出張のたびに必ず寄る場所。坪庭の苔と竹を眺めながら企画書をまとめると余計なノイズが消えます。',
        timeAgo: '2時間前',
        vibeTag: '京都の隠れ家'
      }
    ]
  },
  {
    id: 'spot-kamogawa-page',
    code: 'NL-07',
    name: 'KAMOGAWA FOLIO & COFFEE 河原町三条',
    nameEn: 'KAMOGAWA FOLIO',
    city: 'kyoto',
    category: 'cafe',
    categoryLabel: 'リバービュー・ワークカフェ',
    area: '京都・烏丸御池 / 河原町',
    station: '三条駅 6番出口 / 京都河原町駅',
    walkMinutes: 3,
    lat: 35.0079,
    lng: 135.7706,
    imageUrl: KANSAI_VIGNETTES.kamogawaPage,
    subImageUrl: 'https://sspark.genspark.ai/i/dQmYCktEB1o20nle?width=900',
    badge: 'HIGASHIYAMA VIEW',
    catchcopy: '東山の稜線と鴨川を一望するパノラマ窓カウンター。全席コンセント完備の開放的ロフト。',
    description: '鴨川沿いビルの3階ワンフロアを占める開放感抜群のベーカリー＆コーヒースタンド。東向きの連続窓に沿った14メートルのロングデスクは、午前中の爽やかな光の中で作業したいPCワーカーの聖地。',
    wifiMbps: 350,
    wifiStability: 96,
    outletRatio: 92,
    crowdLevel: 39,
    quietness: 83,
    coffeeScore: 95,
    chairComfort: 90,
    callAllowed: 'ok',
    callLabel: 'Web会議可（ラウンジテーブル席）',
    priceRange: '¥640〜',
    signatureDrink: '京都浅煎りラテ & 全粒粉スコーン',
    signaturePrice: '¥850',
    openHours: '08:00 - 20:30',
    isOpenNow: true,
    seatsAvailable: 13,
    totalSeats: 34,
    tags: ['鴨川パノラマ', '全席電源', '朝活8:00〜', 'Web会議可', '全粒粉スコーン'],
    motif: 'croissant',
    hourlyStats: [
      { hour: '08h', crowd: 28, wifiScore: 98 },
      { hour: '10h', crowd: 44, wifiScore: 96 },
      { hour: '12h', crowd: 56, wifiScore: 95 },
      { hour: '14h', crowd: 39, wifiScore: 96 },
      { hour: '16h', crowd: 52, wifiScore: 95 },
      { hour: '18h', crowd: 30, wifiScore: 97 },
      { hour: '20h', crowd: 14, wifiScore: 99 }
    ],
    reviews: [
      {
        id: 'kr8',
        author: 'T. Inoue',
        initials: 'TI',
        role: 'iOS Developer',
        comment: '鴨川と東山を見ながらビルド待ちできる贅沢さ。電源口の間隔が広くてMacのアダプタが干渉しないのもプロ仕様。',
        timeAgo: '2時間前',
        vibeTag: '絶景カウンター'
      }
    ]
  },
  {
    id: 'spot-kobe-harbor',
    code: 'NL-08',
    name: 'PORT ARCHIVE & ROAST 神戸旧居留地',
    nameEn: 'PORT ARCHIVE KOBE',
    city: 'kobe',
    category: 'coworking',
    categoryLabel: '洋館カフェ＆コワーキング',
    area: '神戸・旧居留地 / 元町',
    station: '元町駅 東口 / 三宮駅',
    walkMinutes: 4,
    lat: 34.6879,
    lng: 135.1924,
    imageUrl: KANSAI_VIGNETTES.kobeHarbor,
    subImageUrl: 'https://sspark.genspark.ai/i/jAKA9qGnC2se1BAM?width=900',
    badge: 'STONE HERITAGE',
    catchcopy: '天井高4.2mの旧居留地レトロ洋館。港町らしいクラシックな静けさと1Gbps回線が同居する空間。',
    description: '昭和初期の貿易商館フロアを丁寧に修復した神戸・旧居留地のワークカフェ。大きな縦長窓から柔らかな光が落ちる大机には真鍮製の電源ボックスが並び、カフェ1杯から終日ドロップインまで柔軟に対応。',
    wifiMbps: 490,
    wifiStability: 99,
    outletRatio: 96,
    crowdLevel: 28,
    quietness: 91,
    coffeeScore: 96,
    chairComfort: 95,
    callAllowed: 'booth_only',
    callLabel: '防音フォンブース2室完備',
    priceRange: '¥660〜 / 終日枠 ¥1,900',
    signatureDrink: '神戸炭火エスプレッソ・ラテ',
    signaturePrice: '¥680',
    openHours: '08:30 - 21:30',
    isOpenNow: true,
    seatsAvailable: 18,
    totalSeats: 38,
    tags: ['旧居留地洋館', '天井高4.2m', '高速490Mbps', '防音ブース', '全席電源'],
    motif: 'bean',
    hourlyStats: [
      { hour: '08h', crowd: 19, wifiScore: 100 },
      { hour: '10h', crowd: 32, wifiScore: 99 },
      { hour: '12h', crowd: 41, wifiScore: 98 },
      { hour: '14h', crowd: 28, wifiScore: 99 },
      { hour: '16h', crowd: 40, wifiScore: 98 },
      { hour: '18h', crowd: 27, wifiScore: 99 },
      { hour: '20h', crowd: 15, wifiScore: 100 }
    ],
    reviews: [
      {
        id: 'kr9',
        author: 'H. Matsuda',
        initials: 'HM',
        role: 'Brand Strategist',
        comment: '天井が高くて呼吸が深くなる空間。東京や海外からのゲストとオンラインMTGする時もブースが綺麗で重宝しています。',
        timeAgo: '3時間前',
        vibeTag: '洋館の品格'
      }
    ]
  }
]

export const AUTOCOMPLETE_KEYWORDS = [
  { label: '大阪・北浜 / 中之島エリア', type: 'area', areaId: 'kitahama', query: '北浜', iconType: 'pin' },
  { label: '大阪・梅田 / 中崎町エリア', type: 'area', areaId: 'umeda', query: '中崎町', iconType: 'pin' },
  { label: '大阪・心斎橋 / 堀江エリア', type: 'area', areaId: 'horie', query: '堀江', iconType: 'pin' },
  { label: '京都・烏丸御池 / 河原町エリア', type: 'area', areaId: 'kyoto', query: '京都', iconType: 'pin' },
  { label: '神戸・旧居留地 / 元町エリア', type: 'area', areaId: 'kobe', query: '神戸', iconType: 'pin' },
  { label: '全席電源・コンセント完備', type: 'feature', query: '全席電源', iconType: 'plug' },
  { label: '高速Wi-Fi 300Mbps以上', type: 'feature', query: '高速', iconType: 'bolt' },
  { label: '防音ブース・Web会議可', type: 'feature', query: '防音ブース', iconType: 'mic' },
  { label: '超静寂・サイレント読書執筆', type: 'feature', query: '静寂', iconType: 'book' },
  { label: 'USB-C 4K外部モニター常設', type: 'feature', query: 'モニター', iconType: 'monitor' },
  { label: '京町家・長屋リノベーション', type: 'feature', query: 'リノベ', iconType: 'cup' }
]
