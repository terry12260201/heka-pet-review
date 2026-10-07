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
