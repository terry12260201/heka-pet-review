// 由 tools/build_data.py 產生，改需求請改 tools/reqs.py 再重跑。
const GROUPS = [
 {
  "k": "life",
  "zh": "基本生活",
  "desc": "待機、走、跳、吃喝、睡、休息、探索：企劃的 7 主狀態與 8 情境動作"
 },
 {
  "k": "touch",
  "zh": "觸摸反應",
  "desc": "企劃：摸頭／耳／背／肚子，連續觸摸會升級成抖耳、擋爪、退開；反應疊在主狀態上"
 },
 {
  "k": "play",
  "zh": "玩耍與道具",
  "desc": "追球、玩具、食盆：企劃「命中區→判定→鎖定→冷卻」的道具互動"
 },
 {
  "k": "mood",
  "zh": "情緒表現",
  "desc": "興奮慶祝、撒嬌社交：企劃的心情數值與生活提醒完成時的回饋"
 },
 {
  "k": "ar",
  "zh": "AR 手勢反應",
  "desc": "企劃：揮手、伸手、蹲下、張開雙臂、傾身，各對應一個寵物反應"
 },
 {
  "k": "trip",
  "zh": "旅行與明信片",
  "desc": "出發、召回、景點定格拍照"
 },
 {
  "k": "user",
  "zh": "南瓜指定補充",
  "desc": "2026-10-07 南瓜點名要的動作"
 },
 {
  "k": "idea",
  "zh": "Claude 建議補充",
  "desc": "判斷能增加樂趣或照護價值的動作"
 }
];
const REQS = [
 {
  "id": "life_idle",
  "g": "life",
  "src": "plan",
  "zh": "待機（自由活動）",
  "cover": "ok",
  "clips": [
   "Idle_1",
   "Idle_2",
   "Idle_3",
   "Idle_7"
  ],
  "desc": "站著喘氣、張望、看向玩家，四支輪播就不會機械重複。",
  "gap": ""
 },
 {
  "id": "life_walk",
  "g": "life",
  "src": "plan",
  "zh": "行走（偽 3D 忽近忽遠）",
  "cover": "ok",
  "clips": [
   "Walk_F_IP",
   "Walk_L_IP",
   "Walk_R_IP",
   "Walk_B_IP",
   "Turn_L_IP",
   "Turn_R_IP",
   "Turn_L180_IP",
   "Turn_R180_IP"
  ],
  "desc": "原地版走路六方向＋轉身；位移交給程式控制，素材包另有位移版（RM）。",
  "gap": ""
 },
 {
  "id": "life_jump",
  "g": "life",
  "src": "plan",
  "zh": "跳躍",
  "cover": "ok",
  "clips": [
   "Jump_Place_IP",
   "Jump_F_IP",
   "JumpStart_Up",
   "JumpAir_Up",
   "JumpLand",
   "JumpStart_Down_IP"
  ],
  "desc": "原地跳、往前跳，另有起跳／空中／落地拆段，可組合跳上跳下。",
  "gap": ""
 },
 {
  "id": "life_eat",
  "g": "life",
  "src": "plan",
  "zh": "進食（點碗餵食）",
  "cover": "ok",
  "clips": [
   "EatDrink_start",
   "Eat_loop",
   "EatDrink_end",
   "Eat_tear"
  ],
  "desc": "低頭靠近碗→吃→抬頭，三段可接；撕咬版適合啃零食。",
  "gap": ""
 },
 {
  "id": "life_drink",
  "g": "life",
  "src": "plan",
  "zh": "喝水",
  "cover": "ok",
  "clips": [
   "EatDrink_start",
   "Drink_loop",
   "EatDrink_end"
  ],
  "desc": "和吃飯共用開始與結束段。",
  "gap": ""
 },
 {
  "id": "life_sleep",
  "g": "life",
  "src": "plan",
  "zh": "睡眠",
  "cover": "part",
  "clips": [
   "Lie_Sleep_start",
   "Lie_Sleep_loop",
   "Lie_Sleep_end",
   "Lie_belly_sleep_start",
   "Lie_belly_sleep",
   "Lie_belly_sleep_end"
  ],
  "desc": "蜷睡、趴睡各有入睡／循環／醒來。",
  "gap": "企劃寫睡眠中要「偶發翻身」，素材包沒有翻身。"
 },
 {
  "id": "life_rest",
  "g": "life",
  "src": "plan",
  "zh": "休息（趴、坐）",
  "cover": "ok",
  "clips": [
   "Lie_belly_start",
   "Lie_belly_loop_1",
   "Lie_belly_end",
   "Lie_start",
   "Lie_loop_1",
   "Lie_end",
   "Sitting_start",
   "Sitting_loop_1",
   "Sitting_end"
  ],
  "desc": "肚子貼地趴、放鬆側腿趴、坐下，都有開始／循環／結束。",
  "gap": ""
 },
 {
  "id": "life_explore",
  "g": "life",
  "src": "plan",
  "zh": "探索（嗅聞、挖）",
  "cover": "ok",
  "clips": [
   "Idle_4",
   "Idle_6",
   "Digging_start",
   "Digging_loop",
   "Digging_end"
  ],
  "desc": "低頭嗅地、抬頭聞空氣、挖洞。",
  "gap": ""
 },
 {
  "id": "touch_head",
  "g": "touch",
  "src": "plan",
  "zh": "摸頭",
  "cover": "gap",
  "clips": [],
  "desc": "瞇眼、抬頭往手上蹭、尾巴慢搖。",
  "gap": "素材包沒有被摸的反應。"
 },
 {
  "id": "touch_ear",
  "g": "touch",
  "src": "plan",
  "zh": "摸耳朵→抖耳",
  "cover": "gap",
  "clips": [],
  "desc": "被摸的那隻耳朵抖兩下、頭微歪。",
  "gap": "素材包沒有。"
 },
 {
  "id": "touch_back",
  "g": "touch",
  "src": "plan",
  "zh": "摸背",
  "cover": "gap",
  "clips": [],
  "desc": "背往下沉、舒服瞇眼、尾巴搖。",
  "gap": "素材包沒有。"
 },
 {
  "id": "touch_belly",
  "g": "touch",
  "src": "plan",
  "zh": "摸肚子→翻肚",
  "cover": "gap",
  "clips": [],
  "desc": "側倒翻肚、四腳放鬆、討摸。",
  "gap": "素材包沒有翻肚。"
 },
 {
  "id": "touch_block",
  "g": "touch",
  "src": "plan",
  "zh": "連摸太多→擋爪",
  "cover": "gap",
  "clips": [],
  "desc": "抬一隻前腳輕擋手。",
  "gap": "素材包沒有。"
 },
 {
  "id": "touch_retreat",
  "g": "touch",
  "src": "plan",
  "zh": "連摸太多→退開",
  "cover": "part",
  "clips": [
   "Walk_B_IP",
   "Turn_L180_IP"
  ],
  "desc": "往後退或轉身走開。",
  "gap": "有後退與轉身；缺「不耐煩」的表情與耳朵。"
 },
 {
  "id": "play_ball",
  "g": "play",
  "src": "plan",
  "zh": "追球",
  "cover": "part",
  "clips": [
   "Run_F_IP",
   "RunFast_F_IP",
   "Pick_up",
   "Pick_up_idle",
   "Put_down"
  ],
  "desc": "衝過去→叼起→叼著回來→放下，四段素材包都有。",
  "gap": "缺「撲球、用爪撥球」與追到時的停頓。"
 },
 {
  "id": "play_toy",
  "g": "play",
  "src": "plan",
  "zh": "玩玩具",
  "cover": "part",
  "clips": [
   "Pick_up",
   "Pick_up_idle",
   "Idle_5_loop"
  ],
  "desc": "叼起玩具、前伏邀玩。",
  "gap": "缺咬著玩具甩頭、拔河。"
 },
 {
  "id": "mood_happy",
  "g": "mood",
  "src": "plan",
  "zh": "興奮慶祝（完成生活提醒）",
  "cover": "part",
  "clips": [
   "Jump_Place_IP",
   "Idle_5_loop"
  ],
  "desc": "原地跳、前伏邀玩可先頂著用。",
  "gap": "缺原地轉圈、邊跳邊搖尾這類「好開心」的慶祝。"
 },
 {
  "id": "mood_social",
  "g": "mood",
  "src": "plan",
  "zh": "社交撒嬌",
  "cover": "part",
  "clips": [
   "Idle_2",
   "Bark"
  ],
  "desc": "看向玩家、叫一聲。",
  "gap": "缺搖尾蹭人、坐著討摸；照護情境吠叫要節制。"
 },
 {
  "id": "ar_wave",
  "g": "ar",
  "src": "plan",
  "zh": "揮手→看過來",
  "cover": "part",
  "clips": [
   "Idle_2",
   "Bark"
  ],
  "desc": "轉頭看向鏡頭、叫一聲回應。",
  "gap": "缺開心搖尾的回應。"
 },
 {
  "id": "ar_reach",
  "g": "ar",
  "src": "plan",
  "zh": "伸手→靠近聞手",
  "cover": "part",
  "clips": [
   "Walk_F_IP",
   "Idle_6"
  ],
  "desc": "走近、抬頭聞。",
  "gap": "缺湊近聞手、舔手。"
 },
 {
  "id": "ar_squat",
  "g": "ar",
  "src": "plan",
  "zh": "蹲下→跑過來",
  "cover": "ok",
  "clips": [
   "Run_F_IP",
   "Sitting_start",
   "Sitting_loop_1"
  ],
  "desc": "跑過來後坐好看你。",
  "gap": ""
 },
 {
  "id": "ar_arms",
  "g": "ar",
  "src": "plan",
  "zh": "張開雙臂→撲過來",
  "cover": "part",
  "clips": [
   "Jump_Run_IP",
   "Jump_F_IP"
  ],
  "desc": "邊跑邊跳、往前跳。",
  "gap": "缺撲到懷裡的收尾（站起前腳搭上來）。"
 },
 {
  "id": "ar_lean",
  "g": "ar",
  "src": "plan",
  "zh": "傾身→歪頭",
  "cover": "gap",
  "clips": [],
  "desc": "左右歪頭、耳朵豎起，疑惑又好奇。",
  "gap": "素材包沒有歪頭。"
 },
 {
  "id": "trip_go",
  "g": "trip",
  "src": "plan",
  "zh": "出發與召回",
  "cover": "ok",
  "clips": [
   "Walk_F_IP",
   "Run_F_IP",
   "Turn_R180_IP"
  ],
  "desc": "轉身離開、跑回來。",
  "gap": ""
 },
 {
  "id": "trip_photo",
  "g": "trip",
  "src": "plan",
  "zh": "明信片定格",
  "cover": "ok",
  "clips": [
   "Sitting_loop_1",
   "Idle_2",
   "Lie_belly_loop_1"
  ],
  "desc": "坐好、看鏡頭、趴著，挑一格當拍照姿勢。",
  "gap": ""
 },
 {
  "id": "user_bed",
  "g": "user",
  "src": "user",
  "zh": "床上睡覺",
  "cover": "part",
  "clips": [
   "JumpStart_Up",
   "JumpUp_End_IP",
   "Lie_Sleep_start",
   "Lie_Sleep_loop",
   "Lie_Sleep_end",
   "JumpStart_Down_IP"
  ],
  "desc": "跳上床→蜷睡→醒來→跳下床，可用素材包拆段接起來。",
  "gap": "要對齊床的高度；缺上床後先轉一圈踩一踩再躺的動作。"
 },
 {
  "id": "user_run",
  "g": "user",
  "src": "user",
  "zh": "跑步",
  "cover": "ok",
  "clips": [
   "Run_F_IP",
   "Run_L_IP",
   "Run_R_IP",
   "RunFast_F_IP",
   "Trot_F_IP"
  ],
  "desc": "小跑、跑、衝刺三種速度，左右轉彎都有。",
  "gap": ""
 },
 {
  "id": "user_walk",
  "g": "user",
  "src": "user",
  "zh": "走路",
  "cover": "ok",
  "clips": [
   "Walk_F_IP",
   "Walk_L_IP",
   "Walk_R_IP",
   "Walk_B_IP",
   "Walk_BL_IP",
   "Walk_BR_IP"
  ],
  "desc": "六方向走路。",
  "gap": ""
 },
 {
  "id": "user_roll",
  "g": "user",
  "src": "user",
  "zh": "原地打滾",
  "cover": "gap",
  "clips": [],
  "desc": "側倒、翻滾一圈、站起來甩甩頭。",
  "gap": "素材包沒有；要翻轉整隻身體，建議用 45° 斜角影片做。"
 },
 {
  "id": "user_shake",
  "g": "user",
  "src": "user",
  "zh": "全身抖毛",
  "cover": "part",
  "clips": [
   "BodyShake_FromBeagle"
  ],
  "desc": "從 Beagle 的 GPT 版抖毛移植過來（兩隻是同一套骨架）。",
  "gap": "移植試做，還沒經過人眼驗收。"
 },
 {
  "id": "idea_spin",
  "g": "idea",
  "src": "idea",
  "zh": "追尾巴轉圈",
  "cover": "gap",
  "clips": [],
  "desc": "開心時原地追尾巴轉一兩圈，長者看了會笑。",
  "gap": "素材包沒有；也能當「興奮慶祝」用。"
 },
 {
  "id": "idea_tilt",
  "g": "idea",
  "src": "idea",
  "zh": "歪頭疑惑",
  "cover": "gap",
  "clips": [],
  "desc": "聽到聲音或長者說話時歪頭，最萌的單一表情。",
  "gap": "和 AR「傾身」共用。"
 },
 {
  "id": "idea_stretch",
  "g": "idea",
  "src": "idea",
  "zh": "伸懶腰＋打哈欠",
  "cover": "part",
  "clips": [
   "Idle_5_start",
   "Idle_5_loop",
   "Idle_5_end"
  ],
  "desc": "起床、睡前的過場，讓作息看起來真實。",
  "gap": "前伏那段可當伸懶腰前半；缺後腳伸展與哈欠。"
 },
 {
  "id": "idea_wag",
  "g": "idea",
  "src": "idea",
  "zh": "開心搖尾（疊加層）",
  "cover": "gap",
  "clips": [],
  "desc": "只動尾巴，可疊在任何動作上，回應長者說話。",
  "gap": "做成疊加層，不用整支動畫。"
 },
 {
  "id": "idea_paw",
  "g": "idea",
  "src": "idea",
  "zh": "給爪握手",
  "cover": "gap",
  "clips": [],
  "desc": "坐著抬一隻前腳，配合 AR 伸手，互動回饋最直接。",
  "gap": "素材包沒有。"
 },
 {
  "id": "idea_lick",
  "g": "idea",
  "src": "idea",
  "zh": "舔手／舔鏡頭",
  "cover": "gap",
  "clips": [],
  "desc": "湊近舔一下，親密度高時解鎖。",
  "gap": "素材包沒有。"
 },
 {
  "id": "idea_bring",
  "g": "idea",
  "src": "idea",
  "zh": "叼東西給主人（提醒用）",
  "cover": "part",
  "clips": [
   "Walk_F_IP",
   "Pick_up",
   "Pick_up_idle",
   "Put_down"
  ],
  "desc": "叼藥袋、水杯模型走過來放下，接生活提醒（吃藥、喝水）。",
  "gap": "四段都有，要接上道具掛點。"
 },
 {
  "id": "idea_scratch",
  "g": "idea",
  "src": "idea",
  "zh": "後腳抓癢",
  "cover": "ok",
  "clips": [
   "Scratching"
  ],
  "desc": "素材包現成，放進待機輪播增加生活感。",
  "gap": ""
 },
 {
  "id": "idea_sneeze",
  "g": "idea",
  "src": "idea",
  "zh": "打噴嚏",
  "cover": "gap",
  "clips": [],
  "desc": "嗅聞後偶爾打個噴嚏，小驚喜。",
  "gap": "素材包沒有。"
 },
 {
  "id": "idea_dream",
  "g": "idea",
  "src": "idea",
  "zh": "睡夢中踢腿",
  "cover": "gap",
  "clips": [],
  "desc": "睡著時腳抽動像在跑，可做成疊加層。",
  "gap": "素材包沒有。"
 },
 {
  "id": "idea_sad",
  "g": "idea",
  "src": "idea",
  "zh": "低落趴著（久未互動）",
  "cover": "part",
  "clips": [
   "Lie_belly_loop_1"
  ],
  "desc": "長者太久沒來時趴著、耳朵垂下，引導回來互動。",
  "gap": "缺耳朵下垂、眼神往上看的表情層。"
 },
 {
  "id": "idea_wait",
  "g": "idea",
  "src": "idea",
  "zh": "等門、看窗外",
  "cover": "part",
  "clips": [
   "Sitting_loop_2",
   "Idle_6"
  ],
  "desc": "長者外出時坐在門口等、聞空氣。",
  "gap": "缺盯著門口、聽到聲音耳朵豎起。"
 },
 {
  "id": "idea_swim",
  "g": "idea",
  "src": "idea",
  "zh": "水邊景點游泳",
  "cover": "ok",
  "clips": [
   "Swim_F_IP",
   "Swim_idle",
   "Swim_enter_IP"
  ],
  "desc": "旅行到海邊、湖邊的景點可以用，素材包現成。",
  "gap": ""
 }
];
const PACK = [
 {
  "en": "A_Pose",
  "zh": "A 字基準姿勢",
  "cat": "idle",
  "use": "no",
  "frames": "1-2",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Attack_Bite",
  "zh": "撲咬",
  "cat": "fight",
  "use": "no",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Attack_Bite_IP",
  "zh": "撲咬（原地）",
  "cat": "fight",
  "use": "no",
  "frames": "1-36",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Attack_F",
  "zh": "攻擊－前",
  "cat": "fight",
  "use": "no",
  "frames": "1-28",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Attack_J",
  "zh": "跳撲攻擊",
  "cat": "fight",
  "use": "no",
  "frames": "1-38",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Attack_L",
  "zh": "攻擊－左",
  "cat": "fight",
  "use": "no",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Attack_R",
  "zh": "攻擊－右",
  "cat": "fight",
  "use": "no",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Bark",
  "zh": "吠叫",
  "cat": "social",
  "use": "maybe",
  "frames": "1-111",
  "loop": false,
  "reqs": [
   "mood_social",
   "ar_wave"
  ]
 },
 {
  "en": "Crouch_BL_IP",
  "zh": "伏低前進－左後",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-33",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_BR_IP",
  "zh": "伏低前進－右後",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-33",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_B_IP",
  "zh": "伏低前進－後退",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-33",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_F_IP",
  "zh": "伏低前進－向前",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-33",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_Idle_end",
  "zh": "伏低警戒－結束",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-21",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Crouch_Idle_loop_1",
  "zh": "伏低警戒－循環 1",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-41",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_Idle_loop_2",
  "zh": "伏低警戒－循環 2",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-131",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_Idle_start",
  "zh": "伏低警戒－開始",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-22",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Crouch_L_IP",
  "zh": "伏低前進－左轉弧",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-33",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_R_IP",
  "zh": "伏低前進－右轉弧",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-33",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_turn_L_IP",
  "zh": "伏低左轉",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-17",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Crouch_turn_R_IP",
  "zh": "伏低右轉",
  "cat": "crouch",
  "use": "maybe",
  "frames": "1-17",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Death_L",
  "zh": "倒下－左",
  "cat": "fight",
  "use": "no",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Death_R",
  "zh": "倒下－右",
  "cat": "fight",
  "use": "no",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Defecate",
  "zh": "大便",
  "cat": "life",
  "use": "no",
  "frames": "1-141",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Digging_end",
  "zh": "挖洞－結束",
  "cat": "life",
  "use": "maybe",
  "frames": "1-21",
  "loop": false,
  "reqs": [
   "life_explore"
  ]
 },
 {
  "en": "Digging_loop",
  "zh": "挖洞－循環",
  "cat": "life",
  "use": "maybe",
  "frames": "1-41",
  "loop": true,
  "reqs": [
   "life_explore"
  ]
 },
 {
  "en": "Digging_start",
  "zh": "挖洞－開始",
  "cat": "life",
  "use": "maybe",
  "frames": "1-21",
  "loop": false,
  "reqs": [
   "life_explore"
  ]
 },
 {
  "en": "Drink_loop",
  "zh": "喝水－循環",
  "cat": "eat",
  "use": "yes",
  "frames": "1-81",
  "loop": true,
  "reqs": [
   "life_drink"
  ]
 },
 {
  "en": "EatDrink_end",
  "zh": "吃完抬頭",
  "cat": "eat",
  "use": "yes",
  "frames": "1-41",
  "loop": false,
  "reqs": [
   "life_eat",
   "life_drink"
  ]
 },
 {
  "en": "EatDrink_start",
  "zh": "低頭靠近碗",
  "cat": "eat",
  "use": "yes",
  "frames": "1-21",
  "loop": false,
  "reqs": [
   "life_eat",
   "life_drink"
  ]
 },
 {
  "en": "Eat_loop",
  "zh": "吃飯－循環",
  "cat": "eat",
  "use": "yes",
  "frames": "1-81",
  "loop": true,
  "reqs": [
   "life_eat"
  ]
 },
 {
  "en": "Eat_tear",
  "zh": "撕咬食物",
  "cat": "eat",
  "use": "maybe",
  "frames": "1-101",
  "loop": false,
  "reqs": [
   "life_eat"
  ]
 },
 {
  "en": "Fall",
  "zh": "掉落中",
  "cat": "jump",
  "use": "maybe",
  "frames": "1-9",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Hit_B",
  "zh": "被打－後",
  "cat": "fight",
  "use": "no",
  "frames": "1-27",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Hit_F",
  "zh": "被打－前",
  "cat": "fight",
  "use": "no",
  "frames": "1-26",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Hit_M",
  "zh": "被打－中",
  "cat": "fight",
  "use": "no",
  "frames": "1-21",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Idle_1",
  "zh": "待機－喘氣張望",
  "cat": "idle",
  "use": "yes",
  "frames": "1-101",
  "loop": true,
  "reqs": [
   "life_idle"
  ]
 },
 {
  "en": "Idle_2",
  "zh": "待機－看向前方",
  "cat": "idle",
  "use": "yes",
  "frames": "1-121",
  "loop": true,
  "reqs": [
   "life_idle",
   "mood_social",
   "ar_wave",
   "trip_photo"
  ]
 },
 {
  "en": "Idle_3",
  "zh": "待機－伏低張望",
  "cat": "idle",
  "use": "yes",
  "frames": "1-101",
  "loop": true,
  "reqs": [
   "life_idle"
  ]
 },
 {
  "en": "Idle_4",
  "zh": "低頭嗅聞地面",
  "cat": "idle",
  "use": "yes",
  "frames": "1-101",
  "loop": true,
  "reqs": [
   "life_explore"
  ]
 },
 {
  "en": "Idle_5_end",
  "zh": "前伏邀玩－結束",
  "cat": "idle",
  "use": "yes",
  "frames": "1-16",
  "loop": false,
  "reqs": [
   "idea_stretch"
  ]
 },
 {
  "en": "Idle_5_loop",
  "zh": "前伏邀玩－循環",
  "cat": "idle",
  "use": "yes",
  "frames": "1-31",
  "loop": true,
  "reqs": [
   "play_toy",
   "mood_happy",
   "idea_stretch"
  ]
 },
 {
  "en": "Idle_5_start",
  "zh": "前伏邀玩－開始",
  "cat": "idle",
  "use": "yes",
  "frames": "1-16",
  "loop": false,
  "reqs": [
   "idea_stretch"
  ]
 },
 {
  "en": "Idle_6",
  "zh": "抬頭聞空氣",
  "cat": "idle",
  "use": "yes",
  "frames": "1-121",
  "loop": true,
  "reqs": [
   "life_explore",
   "ar_reach",
   "idea_wait"
  ]
 },
 {
  "en": "Idle_7",
  "zh": "四處張望（長版）",
  "cat": "idle",
  "use": "yes",
  "frames": "1-201",
  "loop": true,
  "reqs": [
   "life_idle"
  ]
 },
 {
  "en": "JumpAir_Horiz",
  "zh": "空中（水平）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpAir_Up",
  "zh": "空中（往上）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": [
   "life_jump"
  ]
 },
 {
  "en": "JumpAir_Up_F",
  "zh": "空中（往上前傾）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpAir_high",
  "zh": "空中（高）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpAir_high_F",
  "zh": "空中（高前傾）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpAir_low",
  "zh": "空中（低）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpAir_low_F",
  "zh": "空中（低前傾）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpLand",
  "zh": "落地",
  "cat": "jump",
  "use": "yes",
  "frames": "1-21",
  "loop": false,
  "reqs": [
   "life_jump"
  ]
 },
 {
  "en": "JumpLand_F_IP",
  "zh": "落地（往前）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-20",
  "loop": true,
  "reqs": []
 },
 {
  "en": "JumpLand_Place",
  "zh": "落地（原地）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-16",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpStart_Down_IP",
  "zh": "往下跳",
  "cat": "jump",
  "use": "yes",
  "frames": "1-18",
  "loop": true,
  "reqs": [
   "life_jump",
   "user_bed"
  ]
 },
 {
  "en": "JumpStart_F_IP",
  "zh": "起跳（往前）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-13",
  "loop": true,
  "reqs": []
 },
 {
  "en": "JumpStart_Place",
  "zh": "起跳（原地）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-11",
  "loop": false,
  "reqs": []
 },
 {
  "en": "JumpStart_Up",
  "zh": "起跳（抬頭往上）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-11",
  "loop": false,
  "reqs": [
   "life_jump",
   "user_bed"
  ]
 },
 {
  "en": "JumpUp_End_IP",
  "zh": "跳上去爬上收尾",
  "cat": "jump",
  "use": "yes",
  "frames": "1-26",
  "loop": true,
  "reqs": [
   "user_bed"
  ]
 },
 {
  "en": "Jump_F_IP",
  "zh": "往前跳（完整）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-44",
  "loop": true,
  "reqs": [
   "life_jump",
   "ar_arms"
  ]
 },
 {
  "en": "Jump_Place_IP",
  "zh": "原地跳（完整）",
  "cat": "jump",
  "use": "yes",
  "frames": "1-36",
  "loop": true,
  "reqs": [
   "life_jump",
   "mood_happy"
  ]
 },
 {
  "en": "Jump_Run_IP",
  "zh": "邊跑邊跳",
  "cat": "jump",
  "use": "yes",
  "frames": "1-38",
  "loop": true,
  "reqs": [
   "ar_arms"
  ]
 },
 {
  "en": "Lie_Sleep_end",
  "zh": "蜷睡醒來",
  "cat": "lie",
  "use": "yes",
  "frames": "1-16",
  "loop": false,
  "reqs": [
   "life_sleep",
   "user_bed"
  ]
 },
 {
  "en": "Lie_Sleep_loop",
  "zh": "蜷睡－循環",
  "cat": "lie",
  "use": "yes",
  "frames": "1-21",
  "loop": true,
  "reqs": [
   "life_sleep",
   "user_bed"
  ]
 },
 {
  "en": "Lie_Sleep_start",
  "zh": "蜷睡入睡",
  "cat": "lie",
  "use": "yes",
  "frames": "1-11",
  "loop": false,
  "reqs": [
   "life_sleep",
   "user_bed"
  ]
 },
 {
  "en": "Lie_belly_end",
  "zh": "趴著起身",
  "cat": "lie",
  "use": "yes",
  "frames": "1-26",
  "loop": false,
  "reqs": [
   "life_rest"
  ]
 },
 {
  "en": "Lie_belly_loop_1",
  "zh": "趴著－循環 1",
  "cat": "lie",
  "use": "yes",
  "frames": "1-81",
  "loop": true,
  "reqs": [
   "life_rest",
   "trip_photo",
   "idea_sad"
  ]
 },
 {
  "en": "Lie_belly_loop_2",
  "zh": "趴著－循環 2",
  "cat": "lie",
  "use": "yes",
  "frames": "1-81",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Lie_belly_sleep",
  "zh": "趴睡－循環",
  "cat": "lie",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": [
   "life_sleep"
  ]
 },
 {
  "en": "Lie_belly_sleep_end",
  "zh": "趴睡醒來",
  "cat": "lie",
  "use": "yes",
  "frames": "1-21",
  "loop": false,
  "reqs": [
   "life_sleep"
  ]
 },
 {
  "en": "Lie_belly_sleep_start",
  "zh": "趴著入睡",
  "cat": "lie",
  "use": "yes",
  "frames": "1-21",
  "loop": false,
  "reqs": [
   "life_sleep"
  ]
 },
 {
  "en": "Lie_belly_start",
  "zh": "趴下（肚子貼地）",
  "cat": "lie",
  "use": "yes",
  "frames": "1-26",
  "loop": false,
  "reqs": [
   "life_rest"
  ]
 },
 {
  "en": "Lie_end",
  "zh": "放鬆趴起身",
  "cat": "lie",
  "use": "yes",
  "frames": "1-36",
  "loop": false,
  "reqs": [
   "life_rest"
  ]
 },
 {
  "en": "Lie_loop_1",
  "zh": "放鬆趴－循環 1",
  "cat": "lie",
  "use": "yes",
  "frames": "1-81",
  "loop": true,
  "reqs": [
   "life_rest"
  ]
 },
 {
  "en": "Lie_loop_2",
  "zh": "放鬆趴－循環 2",
  "cat": "lie",
  "use": "yes",
  "frames": "1-81",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Lie_start",
  "zh": "趴下（放鬆側腿）",
  "cat": "lie",
  "use": "yes",
  "frames": "1-37",
  "loop": false,
  "reqs": [
   "life_rest"
  ]
 },
 {
  "en": "Pick_up",
  "zh": "叼起東西",
  "cat": "life",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": [
   "play_ball",
   "play_toy",
   "idea_bring"
  ]
 },
 {
  "en": "Pick_up_idle",
  "zh": "叼著東西待機",
  "cat": "life",
  "use": "yes",
  "frames": "1-101",
  "loop": false,
  "reqs": [
   "play_ball",
   "play_toy",
   "idea_bring"
  ]
 },
 {
  "en": "Pissing",
  "zh": "抬腳尿尿",
  "cat": "life",
  "use": "no",
  "frames": "1-131",
  "loop": false,
  "reqs": []
 },
 {
  "en": "Put_down",
  "zh": "放下東西",
  "cat": "life",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": [
   "play_ball",
   "idea_bring"
  ]
 },
 {
  "en": "RunFast_F_IP",
  "zh": "衝刺－向前",
  "cat": "move",
  "use": "yes",
  "frames": "1-13",
  "loop": true,
  "reqs": [
   "play_ball",
   "user_run"
  ]
 },
 {
  "en": "RunFast_L_IP",
  "zh": "衝刺－左轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-13",
  "loop": true,
  "reqs": []
 },
 {
  "en": "RunFast_R_IP",
  "zh": "衝刺－右轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-13",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Run_F_IP",
  "zh": "跑步－向前",
  "cat": "move",
  "use": "yes",
  "frames": "1-13",
  "loop": true,
  "reqs": [
   "play_ball",
   "ar_squat",
   "trip_go",
   "user_run"
  ]
 },
 {
  "en": "Run_L_IP",
  "zh": "跑步－左轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-13",
  "loop": true,
  "reqs": [
   "user_run"
  ]
 },
 {
  "en": "Run_R_IP",
  "zh": "跑步－右轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-13",
  "loop": true,
  "reqs": [
   "user_run"
  ]
 },
 {
  "en": "Scratching",
  "zh": "後腳抓癢",
  "cat": "life",
  "use": "yes",
  "frames": "1-146",
  "loop": false,
  "reqs": [
   "idea_scratch"
  ]
 },
 {
  "en": "Sitting_end",
  "zh": "站起來",
  "cat": "sit",
  "use": "yes",
  "frames": "1-26",
  "loop": false,
  "reqs": [
   "life_rest"
  ]
 },
 {
  "en": "Sitting_loop_1",
  "zh": "坐著－循環 1",
  "cat": "sit",
  "use": "yes",
  "frames": "1-41",
  "loop": true,
  "reqs": [
   "life_rest",
   "ar_squat",
   "trip_photo"
  ]
 },
 {
  "en": "Sitting_loop_2",
  "zh": "坐著－循環 2",
  "cat": "sit",
  "use": "yes",
  "frames": "1-96",
  "loop": true,
  "reqs": [
   "idea_wait"
  ]
 },
 {
  "en": "Sitting_start",
  "zh": "坐下",
  "cat": "sit",
  "use": "yes",
  "frames": "1-31",
  "loop": false,
  "reqs": [
   "life_rest",
   "ar_squat"
  ]
 },
 {
  "en": "Swim_BL_IP",
  "zh": "游泳－左後",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Swim_BR_IP",
  "zh": "游泳－右後",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Swim_B_IP",
  "zh": "游泳－後退",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Swim_F_IP",
  "zh": "游泳－向前",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": [
   "idea_swim"
  ]
 },
 {
  "en": "Swim_L_IP",
  "zh": "游泳－左轉弧",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Swim_R_IP",
  "zh": "游泳－右轉弧",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Swim_Turn_L_IP",
  "zh": "游泳－原地左轉",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Swim_Turn_R_IP",
  "zh": "游泳－原地右轉",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Swim_enter_IP",
  "zh": "下水",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-31",
  "loop": true,
  "reqs": [
   "idea_swim"
  ]
 },
 {
  "en": "Swim_idle",
  "zh": "游泳待機",
  "cat": "swim",
  "use": "maybe",
  "frames": "1-37",
  "loop": false,
  "reqs": [
   "idea_swim"
  ]
 },
 {
  "en": "Trot_F_IP",
  "zh": "小跑－向前",
  "cat": "move",
  "use": "yes",
  "frames": "1-17",
  "loop": true,
  "reqs": [
   "user_run"
  ]
 },
 {
  "en": "Trot_L_IP",
  "zh": "小跑－左轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-17",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Trot_R_IP",
  "zh": "小跑－右轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-17",
  "loop": true,
  "reqs": []
 },
 {
  "en": "Turn_L180_IP",
  "zh": "左轉 180°",
  "cat": "turn",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "life_walk",
   "touch_retreat"
  ]
 },
 {
  "en": "Turn_L_IP",
  "zh": "左轉 90°",
  "cat": "turn",
  "use": "yes",
  "frames": "1-17",
  "loop": true,
  "reqs": [
   "life_walk"
  ]
 },
 {
  "en": "Turn_R180_IP",
  "zh": "右轉 180°",
  "cat": "turn",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "life_walk",
   "trip_go"
  ]
 },
 {
  "en": "Turn_R_IP",
  "zh": "右轉 90°",
  "cat": "turn",
  "use": "yes",
  "frames": "1-17",
  "loop": true,
  "reqs": [
   "life_walk"
  ]
 },
 {
  "en": "Walk_BL_IP",
  "zh": "走路－左後",
  "cat": "move",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "user_walk"
  ]
 },
 {
  "en": "Walk_BR_IP",
  "zh": "走路－右後",
  "cat": "move",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "user_walk"
  ]
 },
 {
  "en": "Walk_B_IP",
  "zh": "走路－後退",
  "cat": "move",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "life_walk",
   "touch_retreat",
   "user_walk"
  ]
 },
 {
  "en": "Walk_F_IP",
  "zh": "走路－向前",
  "cat": "move",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "life_walk",
   "ar_reach",
   "trip_go",
   "user_walk",
   "idea_bring"
  ]
 },
 {
  "en": "Walk_L_IP",
  "zh": "走路－左轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "life_walk",
   "user_walk"
  ]
 },
 {
  "en": "Walk_R_IP",
  "zh": "走路－右轉弧",
  "cat": "move",
  "use": "yes",
  "frames": "1-25",
  "loop": true,
  "reqs": [
   "life_walk",
   "user_walk"
  ]
 },
 {
  "en": "BodyShake_FromBeagle",
  "zh": "全身抖毛（移植自 Beagle GPT 版）",
  "cat": "idle",
  "use": "yes",
  "frames": "0-120",
  "loop": true,
  "extra": true,
  "reqs": [
   "user_shake"
  ]
 }
];
const CATS = [
 {
  "k": "idle",
  "zh": "待機"
 },
 {
  "k": "move",
  "zh": "移動"
 },
 {
  "k": "turn",
  "zh": "轉身"
 },
 {
  "k": "jump",
  "zh": "跳躍"
 },
 {
  "k": "lie",
  "zh": "趴臥睡眠"
 },
 {
  "k": "sit",
  "zh": "坐"
 },
 {
  "k": "eat",
  "zh": "吃喝"
 },
 {
  "k": "life",
  "zh": "生活小事"
 },
 {
  "k": "social",
  "zh": "互動"
 },
 {
  "k": "crouch",
  "zh": "蹲伏潛行"
 },
 {
  "k": "swim",
  "zh": "游泳"
 },
 {
  "k": "fight",
  "zh": "攻擊受擊"
 }
];
const NOT_FOR_CARE = "攻擊、撲咬、被打、倒下、尿尿、大便這 13 支在照護情境不建議使用；另一支 A_Pose 是技術用的基準姿勢，不是動畫。";
// ---- 以下是固定資料（tools/data_static.js），build_data.py 會接在自動產生的資料後面 ----
const SRC_LABEL = {plan:'企劃（待 Jira 核對）', user:'南瓜指定', idea:'Claude 建議'};
const COVER_LABEL = {ok:'素材包現成', part:'部分可用', gap:'素材包沒有'};
const USE_LABEL = {yes:'可直接用', maybe:'看情境', no:'照護情境不建議'};
// 需求的審查狀態（團隊在這頁標，存在自己的瀏覽器；共用版本在 status.json）
const STATUS_OPTS = [
  ["pending", "待確認"],
  ["adopt",   "確認採用"],
  ["rework",  "要修改"],
  ["make",    "要新做"],
  ["drop",    "不做"]
];
const STAGES = [["need","提需求"],["video","生影片"],["fit","對骨架"],["qa","待驗收"],["pass","通過"]];
const MILESTONES = [
  "素材包盤點：Cartoon_JRTerrier 114 支動畫轉成網頁可播",
  "需求對照初稿：企劃需求 × 素材包",
  "Jira FOOT-27 動作表核對、補齊",
  "缺口排優先順序（團隊確認）",
  "缺口製作：AI 影片對骨架或移植",
  "逐支 QA，交給 Unity"
];
const DEFAULT_MILES = [true, true, false, false, false, false];
const CHARACTERS = [
  {name:"Jack Russell Terrier（Cartoon_JRTerrier）", status:"active", note:"V03 主角，57 根骨頭，素材包 114 支動畫"},
  {name:"Beagle（Cartoon_Beagle）", status:"done", note:"V02 已封存，同一套骨架，動畫可移植 → <a href=\"v02-beagle/\">看 V02</a>"},
  {name:"貓、龍", status:"planned", note:"規劃中，企劃要求貓不能演得像狗"}
];
const DOWNLOADS = [
  {file:"jrterrier.glb", label:"JRTerrier 模型＋115 支動畫（.glb）", who:"網頁、Blender、快速預覽", note:"約 8.6 MB，含素材包 114 支＋移植抖毛"},
  {file:"downloads/JRTerrier_動作需求對照.csv", label:"動作需求對照表（.csv）", who:"企劃、PM、對 Jira", note:"每個需求用哪幾支、缺什麼，可直接貼進 Google Sheets"},
  {file:"downloads/JRTerrier_素材包動畫清單.csv", label:"素材包 114 支清單（.csv）", who:"Unity、動畫", note:"中文名、分類、照護情境適不適合、對應需求"},
  {file:"textures/albedo1.jpg", label:"毛色貼圖 1–4（.jpg）", who:"美術", note:"1024 網頁版；原檔 2048 .tif 在素材包 Textures 資料夾"}
];
const SPELLS = [
  {t:"用 Jira 更新需求", s:"讀 Jira FOOT-27（https://pvrar.atlassian.net/browse/FOOT-27）的動作表，更新 heka-pet-review 審片室 V03 的需求對照：照 Jira 改需求名稱與分組、標出 Jira 有但這頁沒有的、這頁有但 Jira 沒有的，重跑 tools/build_data.py 後推上去。"},
  {t:"做一支缺的動作", s:"用 ai-video-to-bones 幫 JRTerrier 做〈動作名〉。模型在 ~/Desktop/Project/03_私人開發/電子寵物狗的動作/Model/Cartoon_Animals/Cartoon_Dogs/Cartoon_JRTerrier，做好放進審片室 V03。"},
  {t:"把 Beagle 的動畫搬過來", s:"把審片室 V02 的〈動畫名〉用 tools/retarget_same_rig.py 移植到 JRTerrier，量腳底沒有浮空穿地後放進 V03。"},
  {t:"標需求狀態", s:"把審片室 V03 的〈需求名〉標成「確認採用／要修改／要新做／不做」，備註〈原因〉。"}
];
