# 素材包 114 支：中文名、分類、照護情境適用度（yes 可直接用／maybe 視情境／no 不建議）
import re
CAT = {'idle':'待機','move':'移動','turn':'轉身','jump':'跳躍','lie':'趴臥睡眠','sit':'坐','eat':'吃喝','life':'生活小事',
       'social':'互動','crouch':'蹲伏潛行','swim':'游泳','fight':'攻擊受擊'}
DIR = {'F':'向前','B':'後退','L':'左轉弧','R':'右轉弧','BL':'左後','BR':'右後'}
FIX = {
 'A_Pose':('A 字基準姿勢','idle','no'),
 'Idle_1':('待機－喘氣張望','idle','yes'),'Idle_2':('待機－看向前方','idle','yes'),'Idle_3':('待機－伏低張望','idle','yes'),'Idle_4':('低頭嗅聞地面','idle','yes'),
 'Idle_5_start':('前伏邀玩－開始','idle','yes'),'Idle_5_loop':('前伏邀玩－循環','idle','yes'),'Idle_5_end':('前伏邀玩－結束','idle','yes'),
 'Idle_6':('抬頭聞空氣','idle','yes'),'Idle_7':('四處張望（長版）','idle','yes'),
 'Bark':('吠叫','social','maybe'),
 'Pick_up':('叼起東西','life','yes'),'Pick_up_idle':('叼著東西待機','life','yes'),'Put_down':('放下東西','life','yes'),
 'Digging_start':('挖洞－開始','life','maybe'),'Digging_loop':('挖洞－循環','life','maybe'),'Digging_end':('挖洞－結束','life','maybe'),
 'Scratching':('後腳抓癢','life','yes'),'Pissing':('抬腳尿尿','life','no'),'Defecate':('大便','life','no'),
 'EatDrink_start':('低頭靠近碗','eat','yes'),'Eat_loop':('吃飯－循環','eat','yes'),'Drink_loop':('喝水－循環','eat','yes'),
 'Eat_tear':('撕咬食物','eat','maybe'),'EatDrink_end':('吃完抬頭','eat','yes'),
 'Sitting_start':('坐下','sit','yes'),'Sitting_loop_1':('坐著－循環 1','sit','yes'),'Sitting_loop_2':('坐著－循環 2','sit','yes'),'Sitting_end':('站起來','sit','yes'),
 'Lie_start':('趴下（放鬆側腿）','lie','yes'),'Lie_loop_1':('放鬆趴－循環 1','lie','yes'),'Lie_loop_2':('放鬆趴－循環 2','lie','yes'),'Lie_end':('放鬆趴起身','lie','yes'),
 'Lie_belly_start':('趴下（肚子貼地）','lie','yes'),'Lie_belly_loop_1':('趴著－循環 1','lie','yes'),'Lie_belly_loop_2':('趴著－循環 2','lie','yes'),'Lie_belly_end':('趴著起身','lie','yes'),
 'Lie_belly_sleep_start':('趴著入睡','lie','yes'),'Lie_belly_sleep':('趴睡－循環','lie','yes'),'Lie_belly_sleep_end':('趴睡醒來','lie','yes'),
 'Lie_Sleep_start':('蜷睡入睡','lie','yes'),'Lie_Sleep_loop':('蜷睡－循環','lie','yes'),'Lie_Sleep_end':('蜷睡醒來','lie','yes'),
 'Crouch_Idle_start':('伏低警戒－開始','crouch','maybe'),'Crouch_Idle_loop_1':('伏低警戒－循環 1','crouch','maybe'),'Crouch_Idle_loop_2':('伏低警戒－循環 2','crouch','maybe'),'Crouch_Idle_end':('伏低警戒－結束','crouch','maybe'),
 'Attack_Bite':('撲咬','fight','no'),'Attack_Bite_IP':('撲咬（原地）','fight','no'),'Attack_F':('攻擊－前','fight','no'),'Attack_J':('跳撲攻擊','fight','no'),
 'Attack_L':('攻擊－左','fight','no'),'Attack_R':('攻擊－右','fight','no'),
 'Hit_B':('被打－後','fight','no'),'Hit_F':('被打－前','fight','no'),'Hit_M':('被打－中','fight','no'),'Death_L':('倒下－左','fight','no'),'Death_R':('倒下－右','fight','no'),
 'Fall':('掉落中','jump','maybe'),'Swim_idle':('游泳待機','swim','maybe'),'Swim_enter_IP':('下水','swim','maybe'),
 'Turn_L_IP':('左轉 90°','turn','yes'),'Turn_R_IP':('右轉 90°','turn','yes'),'Turn_L180_IP':('左轉 180°','turn','yes'),'Turn_R180_IP':('右轉 180°','turn','yes'),
 'Crouch_turn_L_IP':('伏低左轉','crouch','maybe'),'Crouch_turn_R_IP':('伏低右轉','crouch','maybe'),
 'JumpStart_Up':('起跳（抬頭往上）','jump','yes'),'JumpStart_F_IP':('起跳（往前）','jump','yes'),'JumpStart_Place':('起跳（原地）','jump','yes'),'JumpStart_Down_IP':('往下跳','jump','yes'),
 'JumpAir_Up':('空中（往上）','jump','yes'),'JumpAir_Up_F':('空中（往上前傾）','jump','yes'),'JumpAir_high':('空中（高）','jump','yes'),'JumpAir_high_F':('空中（高前傾）','jump','yes'),
 'JumpAir_low':('空中（低）','jump','yes'),'JumpAir_low_F':('空中（低前傾）','jump','yes'),'JumpAir_Horiz':('空中（水平）','jump','yes'),
 'JumpLand':('落地','jump','yes'),'JumpLand_F_IP':('落地（往前）','jump','yes'),'JumpLand_Place':('落地（原地）','jump','yes'),'JumpUp_End_IP':('跳上去爬上收尾','jump','yes'),
 'Jump_F_IP':('往前跳（完整）','jump','yes'),'Jump_Place_IP':('原地跳（完整）','jump','yes'),'Jump_Run_IP':('邊跑邊跳','jump','yes'),
}
GAIT = {'Walk':('走路','move','yes'),'Trot':('小跑','move','yes'),'Run':('跑步','move','yes'),'RunFast':('衝刺','move','yes'),
        'Crouch':('伏低前進','crouch','maybe'),'Swim':('游泳','swim','maybe')}
def describe(name):
    if name in FIX: return FIX[name]
    m = re.match(r'(Walk|Trot|RunFast|Run|Crouch|Swim)_(Turn_)?(BL|BR|F|B|L|R)_IP$', name)
    if m:
        zh, cat, use = GAIT[m.group(1)]
        d = DIR[m.group(3)]
        if m.group(2): d = '原地' + ('左' if m.group(3)=='L' else '右') + '轉'
        return (f'{zh}－{d}', cat, use)
    raise KeyError(name)
