#!/usr/bin/env python3
"""產生假資料：public/data/places.json 與 public/images/<slug>.svg 佔位圖。

用法：python3 scripts/gen_fake_data.py [--seed 42]
資料欄位與原站 (nextplace.day) 的 Place 型別一致，之後換成真資料只要改 places.json。
"""
import json, math, random, argparse, datetime, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(ROOT, "public")

ap = argparse.ArgumentParser()
ap.add_argument("--seed", type=int, default=42)
args = ap.parse_args()
rnd = random.Random(args.seed)

# ---------- 基礎常數（與前端 app.js 一致） ----------
ANCHORS = [
    ("sunnyvale", "Sunnyvale", 37.3688, -122.0363),
    ("cupertino", "Cupertino", 37.323, -122.0322),
    ("mountain-view", "Mountain View", 37.3861, -122.0839),
    ("palo-alto", "Palo Alto", 37.4419, -122.143),
    ("san-jose", "San Jose", 37.3382, -121.8863),
    ("milpitas", "Milpitas", 37.4323, -121.8996),
    ("fremont", "Fremont", 37.5485, -121.9886),
    ("san-mateo", "San Mateo", 37.563, -122.3255),
    ("san-francisco", "San Francisco", 37.7749, -122.4194),
    ("oakland", "Oakland", 37.8044, -122.2712),
    ("berkeley", "Berkeley", 37.8715, -122.273),
    ("santa-cruz", "Santa Cruz", 36.9741, -122.0308),
    ("morgan-hill", "Morgan Hill", 37.1305, -121.6544),
]
# 地點所在城市（真實地理名，僅作座標用）
CITIES = {
    "Sunnyvale": (37.3688, -122.0363), "Cupertino": (37.323, -122.0322), "Mountain View": (37.3861, -122.0839),
    "Palo Alto": (37.4419, -122.143), "Los Altos Hills": (37.3797, -122.1375), "Santa Clara": (37.3541, -121.9552),
    "San Jose": (37.3382, -121.8863), "Campbell": (37.2872, -121.95), "Los Gatos": (37.2358, -121.9624),
    "Saratoga": (37.2638, -122.023), "Milpitas": (37.4323, -121.8996), "Fremont": (37.5485, -121.9886),
    "Morgan Hill": (37.1305, -121.6544), "Gilroy": (37.0058, -121.5683), "Half Moon Bay": (37.4636, -122.4286),
    "Pescadero": (37.255, -122.3831), "Woodside": (37.43, -122.2539), "San Mateo": (37.563, -122.3255),
    "San Francisco": (37.7749, -122.4194), "Oakland": (37.8044, -122.2712), "Berkeley": (37.8715, -122.273),
    "Santa Cruz": (36.9741, -122.0308), "Capitola": (36.9752, -121.9533), "Felton": (37.0513, -122.0733),
    "Aptos": (36.9772, -121.8994), "Watsonville": (36.9102, -121.7569), "Sausalito": (37.859, -122.4853),
    "Alameda": (37.7652, -122.2416), "Monterey": (36.6002, -121.8947), "Davenport": (37.0119, -122.1922),
}
CATS = {
    "hike": 17, "playground": 13, "beach": 11, "zoo": 10, "seasonal": 8,
    "farm": 7, "museum": 7, "train": 7, "garden": 5, "indoor": 3,
}
CAT_EMOJI = {"hike": "🥾", "farm": "🐐", "playground": "🛝", "indoor": "🏠", "beach": "🏖️",
             "train": "🚂", "garden": "🌷", "zoo": "🦒", "museum": "🎨", "seasonal": "🎃"}
CAT_COLORS = {"hike": ["#2f6b50", "#8fae7a"], "farm": ["#c9722f", "#f0b27a"], "playground": ["#e9a23b", "#f7d78a"],
              "indoor": ["#4d6fb0", "#9db6e3"], "beach": ["#2f8fb5", "#9bd3e6"], "train": ["#7a4b3a", "#c49a86"],
              "garden": ["#c25f85", "#efb2c8"], "zoo": ["#a67c1e", "#e3c46b"], "museum": ["#5b5fb5", "#aeb0e6"],
              "seasonal": ["#d9682f", "#f6b48a"]}

# 每類偏好的城市（近的多、遠的少）
CAT_CITIES = {
    "hike": ["Los Altos Hills", "Cupertino", "Saratoga", "Los Gatos", "San Jose", "Palo Alto", "Fremont", "Woodside", "Felton", "Half Moon Bay", "Morgan Hill", "Milpitas"],
    "playground": ["Sunnyvale", "Sunnyvale", "Cupertino", "Mountain View", "Santa Clara", "Palo Alto", "San Jose", "Campbell", "Los Gatos", "Fremont"],
    "beach": ["Half Moon Bay", "Pescadero", "Santa Cruz", "Capitola", "Aptos", "San Francisco", "Alameda", "San Mateo", "Davenport"],
    "zoo": ["Palo Alto", "San Jose", "Oakland", "San Francisco", "San Mateo", "Monterey", "Fremont"],
    "seasonal": ["Morgan Hill", "Gilroy", "Half Moon Bay", "Watsonville", "San Jose", "Los Gatos", "Sunnyvale"],
    "farm": ["Los Altos Hills", "Morgan Hill", "Pescadero", "Half Moon Bay", "Watsonville", "Fremont", "Davenport"],
    "museum": ["San Jose", "Palo Alto", "San Francisco", "Berkeley", "Oakland", "Sausalito", "Santa Clara"],
    "train": ["Los Gatos", "Felton", "Fremont", "San Francisco", "Oakland", "Sunnyvale", "Santa Cruz"],
    "garden": ["Saratoga", "San Jose", "Woodside", "San Francisco", "Berkeley"],
    "indoor": ["Cupertino", "Sunnyvale", "San Jose"],
}

# 名稱素材（虛構）
NATURE = ["Willow Creek", "Oak Ridge", "Fox Hollow", "Silver Lake", "Redtail Canyon", "Meadowbrook", "Heron Marsh",
          "Blue Oak", "Pine Hollow", "Cedar Point", "Quail Ridge", "Coyote Meadow", "Fern Gully", "Sandhill Creek",
          "Eagle Rock", "Lupine Hills", "Otter Slough", "Maple Bend", "Sunny Meadow", "Pebble Cove", "Driftwood",
          "Seal Rock", "Lantern Bay", "Harbor Light", "Clover Field", "Honey Hill", "Apple Barn", "Wildflower",
          "Riverbend", "Poppy Hill", "Moonstone", "Bluebird", "Sycamore", "Juniper", "Tidepool", "Starfish"]
SUFFIX = {
    "hike": ["步道", "保護區", "環湖步道", "County Park", "紅木林", "濕地步道", "Open Space", "溪谷步道"],
    "playground": ["Playground", "遊戲場", "公園遊戲場", "共融遊戲場", "戲水公園", "Park"],
    "beach": ["State Beach", "海灘", "卵石灘", "Cove", "Beach & Boardwalk", "海濱公園"],
    "zoo": ["Zoo", "Junior Zoo", "動物園", "水族館", "Wildlife Center", "農場動物園"],
    "seasonal": ["Pumpkin Patch", "聖誕燈飾", "櫻花季", "草莓採果", "聖誕小鎮", "秋收節", "Corn Maze", "燈節"],
    "farm": ["Farm", "農場", "Ranch", "Orchard 採果", "Goat Farm", "Berry Farm", "Farm & Petting Zoo"],
    "museum": ["Children's Museum", "科學館", "Discovery Museum", "Railroad Museum", "Art Center", "自然史博物館", "Maker Lab"],
    "train": ["Railroad", "小火車", "Steam Train", "Miniature Railway", "輕軌體驗", "纜車之旅", "Train Ride"],
    "garden": ["Gardens", "Japanese Garden", "植物園", "Rose Garden", "Estate & Gardens"],
    "indoor": ["Library 兒童區", "室內遊戲場", "Indoor Play Cafe"],
}
TAGS = {
    "hike": ["平路", "碎石路", "柏油路", "小溪", "看鹿", "賞鳥", "廁所", "野餐", "木棧道", "湖", "農場動物", "瀑布", "紅木", "放風箏"],
    "playground": ["共融設施", "沙坑", "戲水區", "廁所", "野餐桌", "滑索", "盪鞦韆", "大樹蔭", "幼兒區", "旋轉盤", "停車方便"],
    "beach": ["卵石", "細沙", "潮池", "廁所", "野餐", "看海獅", "浪小", "遮陽棚", "燈塔", "沙灘玩具", "沖洗區"],
    "zoo": ["小動物", "餵食", "小火車", "旋轉木馬", "廁所", "推車租借", "室內區", "餐飲", "水族缸", "長頸鹿"],
    "seasonal": ["拍照", "小火車", "草垛", "熱可可", "乾草車", "廁所", "燈飾", "現場音樂", "手作", "限時"],
    "farm": ["餵羊", "小豬", "拖拉機", "採果", "農產品店", "廁所", "野餐", "小馬", "雞舍", "冰淇淋"],
    "museum": ["互動展", "水區", "嬰幼兒區", "餐飲", "推車友善", "會員免費", "室內", "手作課", "廁所", "置物櫃"],
    "train": ["小火車", "月台", "隧道", "森林", "廁所", "野餐", "旋轉木馬", "站內商店", "湖景", "老車廂"],
    "garden": ["錦鯉池", "小橋", "櫻花", "廁所", "推車友善", "茶室", "草坪", "玫瑰", "噴泉", "遮蔭"],
    "indoor": ["軟墊區", "冷氣", "咖啡", "廁所", "嬰兒區", "尿布台", "免費", "繪本", "積木", "穿襪入場"],
}
HIGHLIGHT = {
    "hike": ["{d} 英里的平坦{road}繞一圈，沿路可以看到{animal}，兩歲小孩走走停停剛剛好。",
             "從停車場出發就是{road}，{feature}就在路邊，小朋友不用走遠就有東西看。",
             "{feature}一路相伴，樹蔭多、路面平，推車推到底完全沒問題。"],
    "playground": ["整座遊戲場都是軟鋪面，{feature}最受小小孩歡迎，旁邊就有廁所和野餐桌。",
                   "分成幼兒區和大孩子區，{feature}讓一到十歲都有得玩，家長坐著看就好。",
                   "{feature}加上大樹蔭，夏天下午也不會太曬，是附近爸媽的口袋名單。"],
    "beach": ["浪很小的{feature}，退潮時可以翻石頭找小螃蟹，沙很細很好挖。",
              "停車場走兩分鐘就到沙灘，{feature}是最大亮點，冬天還看得到海獅。",
              "沙灘後面有草皮和廁所，{feature}讓小孩玩一個上午都不會膩。"],
    "zoo": ["規模剛剛好，一圈 1.5 小時逛完，{feature}和餵食時間是小孩最期待的。",
            "動物離得很近，{feature}特別適合兩三歲的小孩，園區內還有小火車和旋轉木馬。",
            "半室內半室外，{feature}下雨天也能看，餐飲和推車租借都有。"],
    "seasonal": ["每年只開幾週，{feature}加上現場音樂，是全家合照的固定行程。",
                 "白天有乾草車和{feature}，天黑後燈飾全亮，兩歲小孩看得目不轉睛。",
                 "{feature}和熱可可攤是標配，週末人很多，建議一開門就到。"],
    "farm": ["可以親手餵{animal}，{feature}對兩歲小孩來說刺激又安全。",
             "農場小而精緻，{feature}和小拖拉機是最大亮點，出口有農產品店。",
             "依季節可以採{crop}，{feature}讓小孩邊採邊吃，家長記得帶濕紙巾。"],
    "museum": ["整層都是互動展，{feature}區可以玩掉一個小時，嬰幼兒有獨立的軟墊區。",
               "展品都可以摸可以按，{feature}最受歡迎，下雨天首選。",
               "推車可以直接推進展廳，{feature}和水區記得帶換洗衣物。"],
    "train": ["搭真的小火車穿過{feature}，全程 {d}0 分鐘，兩歲小孩剛好不會坐不住。",
              "在月台就能近距離看{feature}，票價便宜，週末每半小時一班。",
              "{feature}是全程高潮，車廂是敞篷的，風大記得帶外套。"],
    "garden": ["{feature}和錦鯉池是兩歲小孩的最愛，小橋可以走來走去。",
               "園區不大，一小時逛完，{feature}季節最美，推車全程無障礙。",
               "安靜、有遮蔭、有廁所，{feature}旁邊的草皮很適合鋪野餐墊。"],
    "indoor": ["全部軟墊加冷氣，{feature}適合還在爬的寶寶，大人有咖啡可以喝。",
               "免費開放的{feature}，繪本和積木隨便玩，下雨天的救星。",
               "分時段入場不會太擠，{feature}和嬰兒區是分開的，家長可以真的坐下來。"],
}
FEATURES = {
    "hike": ["鴨子池塘", "一座木橋", "小瀑布", "農場動物區", "湖邊碼頭", "紅木林", "一片野花草地", "溪邊淺灘"],
    "playground": ["巨型旋轉盤", "戲水噴泉", "長滑梯", "沙坑挖土機", "鞦韆區", "共融旋轉木馬", "音樂牆"],
    "beach": ["潮池", "天然拱門", "卵石灘", "小海灣", "燈塔", "碼頭", "沙丘"],
    "zoo": ["小動物觸摸區", "長頸鹿餵食台", "水獺池", "農場動物區", "蝴蝶館", "企鵝館"],
    "seasonal": ["南瓜田", "聖誕小火車", "燈光隧道", "玉米迷宮", "聖誕老人小屋", "櫻花步道"],
    "farm": ["小羊餵食區", "拖拉機拉車", "雞舍撿蛋", "小馬牽騎", "蘋果榨汁機", "草莓田"],
    "museum": ["水流實驗", "巨型泡泡", "小型超市扮演區", "恐龍化石挖掘", "光影房", "樂高牆"],
    "train": ["紅木林", "一條隧道", "湖邊鐵橋", "老式蒸汽火車頭", "山谷", "海邊軌道"],
    "garden": ["櫻花步道", "日式小橋", "玫瑰園", "竹林", "噴泉廣場", "茶室"],
    "indoor": ["嬰兒爬行區", "球池", "小滑梯", "繪本角", "積木牆"],
}
ANIMALS = ["鹿和火雞", "山羊和小豬", "鴨子和大雁", "牛和羊", "小馬", "兔子", "松鼠和藍鳥", "海獅"]
CROPS = ["草莓", "櫻桃", "蘋果", "藍莓", "南瓜", "柿子"]
ROADS = ["碎石路", "柏油路", "木棧道", "泥土路", "環湖路"]
TIPS = [
    "週末盡量 9 點前到，不然停車要繞很久。", "帶防風外套，下午風很大。", "廁所只有入口一處，進去前先解決。",
    "附近沒什麼吃的，零食和水要帶夠。", "週一公休，週二到週日 9-5。", "夏天中午很曬，上午去比較舒服。",
    "停車場很小，停滿了可以停對面的路邊。", "會員一年就回本，常去的話值得買。", "帶換洗衣物，玩水區一定會弄濕。",
    "推車可以帶，但裡面人多時不太好推。", "網路買票比現場便宜 $2。", "先查好退潮時間再去，潮池才看得到東西。",
    "冬天下雨後小溪會漲，穿雨鞋比較保險。", "門口有免費地圖，先拿一張。", "下午 3 點以後人少很多。",
]
PARKING = ["免費", "免費，但週末 9 點就停滿", "停車 $6", "停車 $10，只能停主停車場", "路邊免費小停車場", "免費大停車場",
           "園區內 $5；入口前有免費車位", "市中心停車場約 $10-20", "免費，週末中午會滿", "路邊咪表 $2/小時", "免費停車場，週末很搶手"]
COSTS = ["free"] * 32 + ["$$"] * 27 + ["$$$"] * 22 + ["$$$$"] * 7
URL_HOSTS = ["https://example.org/parks/", "https://example.com/visit/", "https://example.net/places/"]

CAT_COST_BIAS = {"hike": ["free", "free", "$$"], "playground": ["free", "free", "free"], "beach": ["free", "free", "$$"],
                 "zoo": ["$$", "$$$", "$$$$"], "seasonal": ["$$", "$$$", "free"], "farm": ["$$", "free", "$$$"],
                 "museum": ["$$$", "$$$$", "$$"], "train": ["$$", "$$$", "$$"], "garden": ["free", "$$", "$$"],
                 "indoor": ["free", "$$", "free"]}
CAT_SHADE = {"hike": ["medium", "high", "low"], "playground": ["low", "medium"], "beach": ["low"], "zoo": ["medium"],
             "seasonal": ["low", "medium"], "farm": ["low", "medium"], "museum": ["high"], "train": ["medium", "high"],
             "garden": ["medium", "high"], "indoor": ["high"]}
CAT_WEATHER = {"hike": [["sunny", "cool"], ["sunny", "cool", "windy-ok"], ["sunny", "hot", "cool"]],
               "playground": [["sunny", "cool"], ["sunny", "hot", "cool"]],
               "beach": [["sunny", "hot", "windy-ok"], ["sunny", "cool", "windy-ok"]],
               "zoo": [["sunny", "cool"], ["sunny", "cool", "rain-ok"]],
               "seasonal": [["sunny", "cool"], ["cool", "rain-ok"]],
               "farm": [["sunny", "cool"], ["sunny", "hot", "cool"]],
               "museum": [["rain-ok", "hot", "cool"], ["rain-ok", "hot"]],
               "train": [["sunny", "cool"], ["sunny", "cool", "rain-ok"]],
               "garden": [["sunny", "cool"], ["sunny", "cool", "hot"]],
               "indoor": [["rain-ok", "hot", "cool"]]}
CAT_SEASON = {"hike": [["spring", "fall", "winter"], ["spring", "summer", "fall", "winter"], ["spring", "fall"]],
              "playground": [["spring", "summer", "fall"], ["spring", "summer", "fall", "winter"]],
              "beach": [["summer", "fall"], ["spring", "summer", "fall"]],
              "zoo": [["spring", "summer", "fall", "winter"], ["spring", "fall"]],
              "seasonal": [["fall"], ["winter"], ["spring"]],
              "farm": [["spring", "summer", "fall"], ["summer", "fall"]],
              "museum": [["spring", "summer", "fall", "winter"], ["winter"]],
              "train": [["spring", "summer", "fall"], ["spring", "summer", "fall", "winter"]],
              "garden": [["spring", "fall"], ["spring", "summer", "fall"]],
              "indoor": [["spring", "summer", "fall", "winter"], ["winter"]]}
CAT_HOURS = {"hike": [1.5, 2, 2.5, 3], "playground": [1, 1.5, 2], "beach": [1.5, 2, 3], "zoo": [2, 2.5, 3],
             "seasonal": [1.5, 2, 2.5], "farm": [1.5, 2, 2.5], "museum": [2, 2.5, 3, 3.5], "train": [1, 1.5, 2],
             "garden": [1, 1.5], "indoor": [1, 1.5, 2]}


def haversine_mi(lat1, lng1, lat2, lng2):
    p = math.pi / 180
    a = math.sin((lat2 - lat1) * p / 2) ** 2 + math.cos(lat1 * p) * math.cos(lat2 * p) * math.sin((lng2 - lng1) * p / 2) ** 2
    return 7917.6 * math.asin(math.sqrt(a))


def drive_min(lat, lng, alat, alng):
    mi = haversine_mi(lat, lng, alat, alng)
    return max(5, int(5 * round((mi / 32 * 60 * 1.25 + 4) / 5)))


def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower())
    return s.strip("-")


used_names, used_slugs = set(), set()
places = []
for cat, count in CATS.items():
    for i in range(count):
        for _ in range(100):
            base = rnd.choice(NATURE)
            suffix = rnd.choice(SUFFIX[cat])
            name = f"{base} {suffix}"
            if name not in used_names:
                break
        used_names.add(name)
        slug = slugify(f"{base}-{cat}-{i+1}")
        used_slugs.add(slug)
        city = rnd.choice(CAT_CITIES[cat])
        clat, clng = CITIES[city]
        lat = round(clat + rnd.uniform(-0.03, 0.03), 4)
        lng = round(clng + rnd.uniform(-0.03, 0.03), 4)
        dmin = drive_min(lat, lng, *ANCHORS[0][2:])
        rating = rnd.choices([5, 4, 3, 2], weights=[33, 39, 14, 2])[0]
        stroller = rnd.random() < (0.8 if cat in ("playground", "museum", "indoor", "garden", "zoo", "train") else 0.6)
        feature = rnd.choice(FEATURES[cat])
        highlight = rnd.choice(HIGHLIGHT[cat]).format(
            d=rnd.choice([1, 1.5, 2, 3]), road=rnd.choice(ROADS), animal=rnd.choice(ANIMALS),
            feature=feature, crop=rnd.choice(CROPS))
        tips = " ".join(rnd.sample(TIPS, 2))
        cost = rnd.choice(CAT_COST_BIAS[cat])
        has_image = rnd.random() > 0.08  # 少數地點沒有圖片，走 emoji 漸層 fallback
        places.append({
            "slug": slug,
            "name": name,
            "city": city,
            "category": cat,
            "lat": lat, "lng": lng,
            "driveMin": dmin,
            "toddlerRating": rating,
            "strollerFriendly": stroller,
            "shade": rnd.choice(CAT_SHADE[cat]),
            "cost": cost,
            "parking": rnd.choice(PARKING),
            "durationHours": rnd.choice(CAT_HOURS[cat]),
            "bestSeason": rnd.choice(CAT_SEASON[cat]),
            "weather": rnd.choice(CAT_WEATHER[cat]),
            "tags": rnd.sample(TAGS[cat], k=rnd.randint(4, 7)),
            "highlight": highlight,
            "tips": tips,
            "url": rnd.choice(URL_HOSTS) + slug,
            "reservationsRequired": rnd.random() < (0.35 if cat in ("museum", "seasonal", "farm", "train") else 0.08),
            "image": f"/images/{slug}.svg" if has_image else None,
        })

# 依「推薦分」大致排序（前端會再算一次，這裡只讓 JSON 好讀）
places.sort(key=lambda p: (-p["toddlerRating"], p["driveMin"]))

# 各錨點城市的車程矩陣（原站是手工 JSON，這裡用距離估算）
drive_matrix = {
    p["slug"]: {aid: drive_min(p["lat"], p["lng"], alat, alng) for aid, _, alat, alng in ANCHORS}
    for p in places
}

# 少數地點的年齡覆寫（原站 AGE_OVERRIDES 的假版本）
age_overrides = {}
for p in rnd.sample(places, 12):
    age_overrides[p["slug"]] = {k: rnd.randint(2, 5) for k in rnd.sample(["baby", "toddler", "preschool", "school"], k=rnd.randint(1, 2))}

# 假照片版權資訊
LICENSES = [("CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0"),
            ("CC BY-SA 3.0", "https://creativecommons.org/licenses/by-sa/3.0"),
            ("CC BY 2.0", "https://creativecommons.org/licenses/by/2.0"),
            ("CC0", "https://creativecommons.org/publicdomain/zero/1.0/"),
            ("Public domain", "")]
AUTHORS = ["Placeholder Studio", "kidsgo bot", "Demo Photographer", "Sample User 42", "Mock Commons", "Lorem Pixel"]
credits = {}
for p in places:
    if not p["image"]:
        continue
    lic, lic_url = rnd.choice(LICENSES)
    fname = f"File:{p['name'].replace(' ', '_')}_placeholder.svg"
    credits[p["slug"]] = {
        "src": p["image"], "file": fname, "artist": rnd.choice(AUTHORS), "license": lic, "licenseUrl": lic_url,
        "source": "https://example.org/commons/" + fname.replace(":", "_"),
        "generic": rnd.random() < 0.15, "locked": False,
    }

# 本週末預報（假）；日期邏輯與原站相同：週日當天算「今天」，週六是前一天
today = datetime.date.today()
wd = (today.weekday() + 1) % 7  # 0=Sun ... 6=Sat
sat_off, sun_off = (6 - wd + 7) % 7, (7 - wd) % 7
if wd == 0:
    sat_off, sun_off = -1, 0
sat = today + datetime.timedelta(days=sat_off)
sun = today + datetime.timedelta(days=sun_off)
WX = [("clear", "☀️"), ("partly", "🌤️"), ("overcast", "☁️"), ("fog", "🌫️"), ("showers", "🌦️")]
CODE = {"clear": 0, "partly": 2, "overcast": 3, "fog": 45, "showers": 80}


def day_forecast(d, key):
    k, emoji = WX[key]
    hi = rnd.randint(68, 84)
    return {"date": d.isoformat(), "day": "sat" if d.weekday() == 5 else "sun" if d.weekday() == 6 else "today",
            "tempMaxF": hi, "tempMinF": hi - rnd.randint(18, 24), "rainChance": rnd.choice([0, 0, 0, 5, 10, 30]) if k != "showers" else 60,
            "code": CODE[k], "summaryKey": k, "emoji": emoji}


forecast = [day_forecast(sat, rnd.randint(0, 3)), day_forecast(sun, rnd.randint(0, 3))]
sat_f = forecast[0]
mood = "rainy" if sat_f["rainChance"] >= 45 or sat_f["code"] >= 51 else "hot" if sat_f["tempMaxF"] >= 88 else "cool" if sat_f["tempMaxF"] <= 62 else "nice"
m = today.month
season = "winter" if m in (12, 1, 2) else "spring" if m in (3, 4, 5) else "summer" if m in (6, 7, 8) else "fall"

out = {
    "generatedAt": datetime.datetime.now().isoformat(timespec="seconds"),
    "note": "假資料（繁體中文 / 台灣用語），由 scripts/gen_fake_data.py 產生；欄位與 nextplace.day 的 Place 型別一致。",
    "season": season,
    "suggestedMood": mood,
    "forecast": forecast,
    "places": places,
    "driveMatrix": drive_matrix,
    "ageOverrides": age_overrides,
    "credits": credits,
}
os.makedirs(os.path.join(PUB, "data"), exist_ok=True)
with open(os.path.join(PUB, "data", "places.json"), "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

# ---------- SVG 佔位圖 ----------
img_dir = os.path.join(PUB, "images")
os.makedirs(img_dir, exist_ok=True)
for fn in os.listdir(img_dir):
    if fn.endswith(".svg"):
        os.remove(os.path.join(img_dir, fn))


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


for p in places:
    if not p["image"]:
        continue
    c1, c2 = CAT_COLORS[p["category"]]
    h = abs(hash(p["slug"])) % 1000
    r = random.Random(p["slug"])
    blobs = "".join(
        f'<circle cx="{r.randint(0, 1200)}" cy="{r.randint(0, 1140)}" r="{r.randint(90, 320)}" fill="{"#fff" if i % 2 else "#000"}" opacity="{0.10 if i % 2 else 0.08}"/>'
        for i in range(6))
    hills = f'<path d="M0 820 C 200 {r.randint(680, 780)}, 420 {r.randint(700, 800)}, 620 {r.randint(720, 800)} S 1000 {r.randint(700, 790)}, 1200 {r.randint(740, 820)} L1200 1140 L0 1140 Z" fill="#000" opacity="0.12"/>'
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1140" width="1200" height="1140">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="{c1}"/><stop offset="1" stop-color="{c2}"/></linearGradient></defs>
<rect width="1200" height="1140" fill="url(#g)"/>
{blobs}{hills}
<text x="600" y="600" font-size="300" text-anchor="middle" dominant-baseline="middle">{CAT_EMOJI[p["category"]]}</text>
<text x="600" y="1010" font-size="54" font-family="Plus Jakarta Sans, PingFang TC, Noto Sans TC, sans-serif" font-weight="600" fill="#fff" fill-opacity="0.92" text-anchor="middle">{esc(p["name"])}</text>
<text x="600" y="1070" font-size="30" font-family="Plus Jakarta Sans, PingFang TC, Noto Sans TC, sans-serif" fill="#fff" fill-opacity="0.7" text-anchor="middle">{esc(p["city"])} · 示意圖（假資料）</text>
</svg>'''
    with open(os.path.join(img_dir, f"{p['slug']}.svg"), "w", encoding="utf-8") as f:
        f.write(svg)

print(f"places: {len(places)}  images: {len(credits)}  season: {season}  mood: {mood}  forecast: {[ (d['date'], d['day']) for d in forecast]}")
