// HEKA Beagle 審片資料 — 由工單 03_缺口清單 生成
const CLIPS = [
  {id:0,  en:"Idle_1",            zh:"待機", desc:"素材包原始待機，作為風格與銜接基準", tier:"REF", frames:"1-190"},
  {id:1,  en:"Pet_Head_React",    zh:"摸頭反應", desc:"頭輕壓低→瞇眼→輕蹭上抬，尾巴慢搖（觸摸頭部）", tier:"P0", frames:"1-40"},
  {id:2,  en:"Pet_Ear_Flick",     zh:"摸耳抖耳", desc:"單耳快速抖動兩下、微歪頭（觸摸升級鏈第 1 段）", tier:"P0", frames:"1-20"},
  {id:3,  en:"Pet_Turn_Look",     zh:"回頭看玩家", desc:"回頭望向玩家方向、停留、轉回（升級鏈第 2 段）", tier:"P0", frames:"1-30"},
  {id:4,  en:"Pet_Paw_Block",     zh:"擋爪", desc:"坐姿重心後移、抬前爪向前擋兩次（升級鏈第 3 段）", tier:"P0", frames:"1-35"},
  {id:5,  en:"Pet_Back_React",    zh:"摸背反應", desc:"背部拱起→壓低→輕抖→回中立（觸摸背部）", tier:"P0", frames:"1-40"},
  {id:6,  en:"Belly_Up_start",    zh:"翻肚—開始", desc:"從趴姿側翻至四腳朝天（摸腹部最高信任反應）", tier:"P0", frames:"1-30"},
  {id:7,  en:"Belly_Up_loop",     zh:"翻肚—循環", desc:"仰躺呼吸、四肢輕蹬、尾巴擺動（可循環）", tier:"P0", frames:"1-60"},
  {id:8,  en:"Belly_Up_end",      zh:"翻肚—結束", desc:"翻回趴姿，接回 Lie_loop", tier:"P0", frames:"1-25"},
  {id:9,  en:"Sniff_Ground_loop", zh:"嗅聞地面", desc:"低頭貼地嗅聞、鼻端點動、尾平舉（探索核心，可循環）", tier:"P0", frames:"1-50"},
  {id:10, en:"Sniff_Air",         zh:"嗅聞空氣", desc:"抬頭 30° 聞空氣、鼻端上點、微歪頭（AR「伸手」回應）", tier:"P0", frames:"1-45"},
  {id:11, en:"Head_Tilt_L",       zh:"歪頭（左）", desc:"頭向左歪 25° 保持後回正（AR「傾身」回應）", tier:"P0", frames:"1-25"},
  {id:12, en:"Head_Tilt_R",       zh:"歪頭（右）", desc:"頭向右歪 25° 保持後回正（AR「傾身」回應）", tier:"P0", frames:"1-25"},
  {id:13, en:"Play_Bow",          zh:"邀玩鞠躬", desc:"前胸下壓、後軀抬高、尾快搖——犬類標準邀玩姿（AR「蹲下」回應）", tier:"P0", frames:"1-40"},
  {id:14, en:"Paw_Ball",          zh:"拍球", desc:"視線鎖定下方、單前爪向下拍兩次（玩球互動）", tier:"P0", frames:"1-30"},
  {id:15, en:"Spin_Celebrate",    zh:"興奮轉圈", desc:"原地快速轉一圈＋小跳收尾（興奮／慶祝）", tier:"P1", frames:"1-45"},
  {id:16, en:"Body_Shake",        zh:"全身抖毛", desc:"從頭到尾波浪式甩動，力道漸減（觸摸過多／睡醒）", tier:"P1", frames:"1-35"},
  {id:17, en:"Stretch_F",         zh:"伸懶腰", desc:"前肢前伸下壓、後軀抬高伸展後起身（睡醒必接）", tier:"P1", frames:"1-45"},
  {id:18, en:"Head_Nod",          zh:"點頭確認", desc:"點頭兩次（生活提醒完成的模仿回饋）", tier:"P1", frames:"1-20"},
  {id:19, en:"Lick_Hand",         zh:"舔手", desc:"頭前伸、伸舌舔、尾搖（高親密度反應）", tier:"P1", frames:"1-40"},
  {id:20, en:"Sleep_Roll",        zh:"睡中翻身", desc:"睡姿中翻向背側再回原位（睡眠偶發動作）", tier:"P1", frames:"1-50"},
  {id:21, en:"Tail_Wag_Fast",     zh:"快速搖尾（加法層）", desc:"只動尾巴——Unity 以 Avatar Mask 疊在主動作上；單獨播放時身體不動屬正常", tier:"P1", frames:"1-30"},
  {id:22, en:"Ear_Sad_Back",      zh:"委屈折耳（加法層）", desc:"雙耳後折＋頭微低——同為疊加層，身體不動屬正常", tier:"P1", frames:"1-30"},
  {id:23, en:"Spin_Chase",        zh:"原地追尾繞圈", desc:"身體弓成弧、回頭追自己尾巴轉整圈，帶小彈跳（可循環）", tier:"P0", frames:"1-60"},
  {id:24, en:"Beg_Play",          zh:"期待陪玩撒嬌", desc:"邀玩鞠躬扭屁股→往前撲跳→輪流抬爪討玩→再鞠躬（可循環）", tier:"P0", frames:"1-70"},
  {id:25, en:"Hungry_Beg",        zh:"肚子餓討食", desc:"坐立起身、雙前爪舉起、抬頭盯主人、舔嘴（可循環）", tier:"P0", frames:"1-60"},
  {id:27, en:"Walk_AIVideo_Loop", zh:"走路循環（AI 影片對位）", desc:"照 AI 生成的側面走路影片逐格對骨架，20 格一圈（可循環）", tier:"P0", frames:"1-21", method:"video", compare:"media/Walk_AIVideo_Loop.mp4"},
  {id:28, en:"Trot_AIVideo_Loop", zh:"小跑循環（AI 影片對位）", desc:"照 AI 生成的側面小跑影片逐格對骨架，13 格一圈（可循環）", tier:"P0", frames:"1-14", method:"video", compare:"media/Trot_AIVideo_Loop.mp4"},
  {id:29, en:"Run_AIVideo_Loop",  zh:"奔跑循環（AI 影片對位）", desc:"照 AI 生成的側面奔跑影片逐格對骨架，13 格一圈（可循環）；奔跑腿交疊多，腳掌位置最難讀", tier:"P0", frames:"1-14", method:"video", compare:"media/Run_AIVideo_Loop.mp4"},
  {id:30, en:"Eat_AIVideo",       zh:"吃東西（AI 影片對位）", desc:"站著低頭吃地上的東西再抬頭，10 秒一次性動作；頭頸耳嘴為主，腳不動", tier:"P0", frames:"1-239", method:"video", compare:"media/Eat_AIVideo.mp4"},
  {id:31, en:"Drink_AIVideo",     zh:"喝水（AI 影片對位）", desc:"站著低頭喝水再抬頭，10 秒一次性動作；頭頸耳嘴為主，腳不動", tier:"P0", frames:"1-239", method:"video", compare:"media/Drink_AIVideo.mp4"},
  {id:32, en:"BodyShake_AIVideo", zh:"全身抖毛（AI 影片對位）", desc:"站著從頭到尾波浪式甩動 113 格；身體與四肢照側面影片對位，頭左右側滾、耳朵外飛、尾巴甩動是照影片節奏補的甩動層；頭尾接回站姿", tier:"P1", frames:"1-113", method:"video", compare:"media/BodyShake_AIVideo.mp4"},
  {id:26, en:"Sick_Lie",          zh:"不舒服", desc:"蜷縮趴臥、耳貼平、尾內收、淺呼吸帶發抖（可循環）", tier:"P0", frames:"1-90"}
];
const STATUS_OPTS = [
  ["done",      "已製作·待QA"],
  ["qa",        "QA通過"],
  ["confirmed", "確認"],
  ["rework",    "修改中"],
  ["cancelled", "取消"],
  ["todo",      "待製作"]
];
const MILESTONES = [
  "需求分析＋素材盤點＋工單",
  "22 支動畫製作（P0+P1）",
  "QA 逐支驗收",
  "匯出 FBX → Unity 驗證",
  "貓／龍複製此流程",
  "AI 影片對位流程建立（走路循環首測）"
];
const DEFAULT_MILES = [true, true, false, false, false, false];

// 角色清單：live = 已有模型與動畫；planned = 規劃中
const CHARACTERS = [
  {key:"beagle", name:"Beagle 小獵犬", status:"live",    note:"33 段動畫，可預覽"},
  {key:"cat",    name:"貓",            status:"planned", note:"規劃中，還沒有模型"},
  {key:"dragon", name:"龍",            status:"planned", note:"規劃中，還沒有模型"}
];

// 下載區
const DOWNLOADS = [
  {file:"beagle.glb",                      label:"GLB",          who:"網頁、Three.js 用", note:"28 段動畫，2.5 MB"},
  {file:"model/Beagle_HEKA.blend",         label:"Blender 專案", who:"美術直接開來改",    note:"28 段動畫，3.1 MB"},
  {file:"model/Beagle_HEKA.fbx",           label:"FBX",          who:"Unity、UE 匯入",    note:"27 段，還沒有走路循環，13.3 MB"},
  {file:"model/Cartoon_Beagle_Albedo.png", label:"顏色貼圖",     who:"單獨改花色",        note:"PNG 2048 × 2048"}
];

// 生產線五站。status.json 的 queue 每一筆用 stage 指到其中一站。
const STAGES = [["need","提需求"],["video","生影片"],["fit","對骨架"],["qa","待驗收"],["pass","通過"]];

// 跟 Claude 說什麼：點一下複製，貼給 Claude Code 就會動起來
const SPELLS = [
  {t:"做一支新動畫", s:"用 ai-video-to-bones 幫 Beagle 做一支「〈動作，例如：小跑〉」動畫。先給我側面參考圖和影片 Prompt，我生完影片再丟給你。"},
  {t:"影片生好了",   s:"影片生好了，在〈檔案路徑〉。照 ai-video-to-bones 流程做成動畫，放進審片室，狀態標待 QA。"},
  {t:"修某一格",     s:"審片室的 Walk_AIVideo_Loop：第〈幾〉格，〈近前／遠前／近後／遠後〉腳〈太前面／太後面／腳尖翹起來〉。修好後更新審片室。"},
  {t:"更新 QA 狀態", s:"把審片室的〈動畫英文名〉標成〈QA通過／修改中／取消〉，備註：〈一句話〉。更新 status.json 並推上去。"},
  {t:"加新角色",     s:"我要在審片室加一個新角色「〈名稱〉」。模型檔在〈路徑〉（要綁好骨架的 .glb）。先幫我檢查骨架，列出可以直接沿用的動作和要新做的動作。"}
];
