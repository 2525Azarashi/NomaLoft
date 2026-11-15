# NomaLoft — 関西カフェ・コワーキング電源＆Wi-Fiマップ

大阪・京都・神戸・阪神・奈良・滋賀の**実在カフェ＆コワーキングスペース**を対象に、**コンセントの有無・無料Wi-Fiの有無・公式サイト・公式Instagram・X（最新口コミ）**を横画面フルブリード地図上で即座に確認できるPCワーカー向けWebアプリケーションです。

---

## 公開プレビューURL
- **Sandbox Live Preview**: `https://3000-i9hg2lex5g5ii3268vejl-3c7ff1b5.sandbox.novita.ai`

---

## 主な特徴・実装済み仕様

### 1. 無駄を削ぎ落とした「フルブリード地図 × フローティング・クリームグラスUI」
- **横画面100vw × 100vh フルブリード空間設計**: 画面全体を無料のOpenStreetMapキャンバスとし、その上に半透明のラテ・クリームガラスパネル（`backdrop-filter: blur(26px)` + 立体インセットハイライト）を浮かべる空間UIを採用。
- **OS標準絵文字ゼロ**: HTML / TypeScript / JavaScript / CSS 全ファイルにおいてデフォルト絵文字は0件。すべて専用設計のインラインSVGアイコンで構成。
- **視線追従カップマスコット & 物理LED風トグルスイッチ**: マウスに追従して瞳が動くラテカップSVGや、押し心地のある `[コンセントあり]` `[Wi-Fiあり]` フィルタスイッチを搭載。

### 2. 関西全域の実在カフェ・コワーキング大容量収録（初期99店舗 ＋ OpenStreetMap周辺カフェ自動拡張）
- **検証済み実在スポット 99店舗を初期収録**:
  - **梅田・中崎町・新大阪・江坂**: TSUTAYA BOOKSTORE 梅田MeRISE、セルフカフェ梅田センタービル店、ONthe UMEDA、コモンルーム梅田/中津/江坂、DOWNSTAIRS COFFEE、BIZcomfort東梅田/新大阪 ほか
  - **北浜・淀屋橋・本町・京橋・枚方**: BROOKLYN ROASTING COMPANY KITAHAMA、SCHOOL BUS COFFEE STOP KITAHAMA、FabCafe Osaka、TAKAMURA COFFEE ROASTERS、枚方T-SITE ほか
  - **心斎橋・堀江・難波・天王寺・堺**: おしごとカフェ心斎橋、BROOKLYN ROASTING COMPANY NAMBA、STREAMER COFFEE、TSUTAYA EBISUBASHI、あべのハルカス ほか
  - **京都（烏丸・河原町・京都駅・岡崎・二条・出町柳）**: FabCafe Kyoto、QUESTION河原町御池、小川珈琲 堺町錦店/本店、Kurasu Kyoto Stand、Space Kante、京都岡崎 蔦屋書店 ほか
  - **神戸・阪神（三宮・元町・旧居留地・西宮・芦屋・岡本・姫路）**: SCHOOL BUS COFFEE STOP MOTOMACHI、アクセアカフェ神戸元町、120 WORKPLACE KOBE、BIZcomfort神戸三宮 ほか
  - **奈良・滋賀（近鉄奈良・新大宮・草津・大津）**: 奈良 蔦屋書店、BONCHI、ROKUMEI COFFEE、草津エイスクエア ほか
- **OpenStreetMap Overpass API による街カフェ自動追加**:
  - 初回表示時およびエリア移動・右上「`+ 周辺の街カフェも読込`」クリック時に、OpenStreetMapから周辺の一般カフェ・コワーキングをリアルタイム取得して一覧・地図ピンへ統合（150〜250店舗規模でシームレスに検索可能）。

### 3. コンセント・Wi-Fi有無と公式サイト・SNSへのダイレクト導線
- **カード一覧＆マップピンで即判別**:
  - `コンセント: 全席あり` / `コンセント: あり` / `コンセント: なし` の明確なバッジと設置席の詳細（カウンター・大テーブル等）を記載。
  - `Wi-Fi: あり` / `Wi-Fi: なし` と回線種別（独自高速Wi-Fi・スタバWi-Fi・タリーズWi-Fi等）を明記。
- **ワンタップ外部リンク**:
  - 各カードおよび詳細ボトムシートに **「公式サイト」「Instagram」「X（最新口コミ検索）」「Googleマップ経路」** ボタンを配置。

### 4. UI/UX ＆ インフォグラフィック・アニメーション実装一覧
1. **Kinetic Typography**: ヘッダー見出しの注目ワードが1文字ずつ弾むように切り替わる文字スタッガーアニメーション。
2. **UI/UX Micro-Animations**: 視線追従カップ、スプリング物理スイッチ、SVG珈琲豆＆スパークル粒子エフェクト。
3. **Infographic Animation**: 上部カプセルの電源設置率・Wi-Fi設置率SVGリングゲージ、ボトムシート内の3軸環境スコアバー＆時間帯別着席しやすさチャート。
4. **Pull to Refresh**: カードリスト上端を下に引っ張ると現在の地図中心から周辺カフェを再スキャン。
5. **Skeleton Screen**: 初期読込・エリア移動時のラテシマー・スケルトン表示。
6. **Toast**: 画面上部中央のフローティング・ピルトースト（残り時間バー・`元に戻す` アクション付）。
7. **Bottom Sheet**: 右側マップ下部に浮かび上がり、上下ドラッグで拡大・縮小・クローズできる詳細シート。
8. **Swipe Action**: カード右スワイプで保存切替、左スワイプで詳細＆公式・SNSシート展開。
9. **Auto Complete**: 駅名・店名・ブランド・エリアのリアルタイム候補表示（一致ハイライト、`↑` `↓` `Enter` キー操作、`/` ショートカット対応）。
