
import {makeAsciiAnim} from "./ascii-anim.js"
import {Content} from "../../../views/types.js"

const fast = 20
const mid = 10
const slow = 4

export const spinner = makeAsciiAnim(fast, [
	"|",
	"/",
	"-",
	"\\",
])

export const braille = makeAsciiAnim(fast, [
	"⠈",
	"⠐",
	"⠠",
	"⢀",
	"⡀",
	"⠄",
	"⠂",
	"⠁",
])

export const arrow = makeAsciiAnim(fast, [
	"⬆️",
	"↗️",
	"➡️",
	"↘️",
	"⬇️",
	"↙️",
	"⬅️",
	"↖️",
])

export const bar = makeAsciiAnim(fast, [
	"▰▱▱▱▱",
	"▰▱▱▱▱",
	"▱▰▱▱▱",
	"▱▱▰▱▱",
	"▱▱▱▰▱",
	"▱▱▱▱▰",
	"▱▱▱▱▰",
	"▱▱▱▰▱",
	"▱▱▰▱▱",
	"▱▰▱▱▱",
])

export const bar2 = makeAsciiAnim(fast, [
	"▱▱▰▱▱",
	"▱▱▱▰▱",
	"▱▱▱▰▰",
	"▱▱▱▰▰",
	"▱▱▱▱▰",
	"▱▱▱▱▰",
	"▱▱▱▱▰",
	"▱▱▱▰▰",
	"▱▱▱▰▰",
	"▱▱▱▰▱",
	"▱▱▰▱▱",
	"▱▰▱▱▱",
	"▰▰▱▱▱",
	"▰▰▱▱▱",
	"▰▱▱▱▱",
	"▰▱▱▱▱",
	"▰▱▱▱▱",
	"▰▰▱▱▱",
	"▰▰▱▱▱",
	"▱▰▱▱▱",
])

export const bar3 = makeAsciiAnim(fast, [
	"▰▱▱▱▱",
	"▰▱▱▱▱",
	"▰▰▱▱▱",
	"▰▰▰▱▱",
	"▱▰▰▰▱",
	"▱▱▰▰▰",
	"▱▱▱▰▰",
	"▱▱▱▱▰",
	"▱▱▱▱▰",
	"▱▱▱▰▰",
	"▱▱▰▰▰",
	"▱▰▰▰▱",
	"▰▰▰▱▱",
	"▰▰▱▱▱",
])

export const bar4 = makeAsciiAnim(fast, [
	"▱▱▱▱▱",
	"▱▱▱▱▱",
	"▰▱▱▱▱",
	"▰▰▱▱▱",
	"▰▰▰▱▱",
	"▰▰▰▰▱",
	"▰▰▰▰▰",
	"▰▰▰▰▰",
	"▱▰▰▰▰",
	"▱▱▰▰▰",
	"▱▱▱▰▰",
	"▱▱▱▱▰",
])

export const block = makeAsciiAnim(fast, [
	"▁▁▁▁▁",
	"▁▁▁▁▁",
	"█▁▁▁▁",
	"██▁▁▁",
	"███▁▁",
	"████▁",
	"█████",
	"█████",
	"▁████",
	"▁▁███",
	"▁▁▁██",
	"▁▁▁▁█",
])

export const block2 = makeAsciiAnim(fast, [
	"█▁▁▁▁",
	"█▁▁▁▁",
	"██▁▁▁",
	"███▁▁",
	"████▁",
	"█████",
	"█████",
	"▁████",
	"▁▁███",
	"▁▁▁██",
	"▁▁▁▁█",
	"▁▁▁▁█",
	"▁▁▁██",
	"▁▁███",
	"▁████",
	"█████",
	"█████",
	"████▁",
	"███▁▁",
	"██▁▁▁",
])

export const runner = makeAsciiAnim(slow, [
	"🚶",
	"🏃",
])

export const pie = makeAsciiAnim(mid, [
	"◷",
	"◶",
	"◵",
	"◴",
])

export const cylon = makeAsciiAnim(fast, [
	"=----",
	"-=---",
	"--=--",
	"---=-",
	"----=",
	"----=",
	"---=-",
	"--=--",
	"-=---",
	"=----",
])

export const slider = makeAsciiAnim(fast, [
	"o----",
	"-o---",
	"--o--",
	"---o-",
	"----o",
	"----o",
	"---o-",
	"--o--",
	"-o---",
	"o----",
])

export const brackets = makeAsciiAnim(mid, [
	"[   ]",
	"[   ]",
	"[=  ]",
	"[== ]",
	"[===]",
	"[ ==]",
	"[  =]",
])

export const brackets2 = makeAsciiAnim(mid, [
	"[   ]",
	"[   ]",
	"[=  ]",
	"[== ]",
	"[===]",
	"[ ==]",
	"[  =]",
	"[   ]",
	"[   ]",
	"[  =]",
	"[ ==]",
	"[===]",
	"[== ]",
	"[=  ]",
])

export const dots = makeAsciiAnim(mid, [
	"   ",
	"   ",
	".  ",
	".. ",
	"...",
	" ..",
	"  .",
])

export const dots2 = makeAsciiAnim(fast, [
	".  ",
	".  ",
	".. ",
	"...",
	" ..",
	"  .",
	"  .",
	" ..",
	"...",
	".. ",
])

export const wave = makeAsciiAnim(fast, [
	".....",
	".....",
	":....",
	"::...",
	":::..",
	"::::.",
	":::::",
	":::::",
	".::::",
	"..:::",
	"...::",
	"....:",
])

export const wavescrub = makeAsciiAnim(fast, [
	":....",
	":....",
	"::...",
	".::..",
	"..::.",
	"...::",
	"....:",
	"....:",
	"...::",
	"..::.",
	".::..",
	"::...",
])

export const wavepulse = makeAsciiAnim(fast, [
	".....",
	".....",
	"..:..",
	".:::.",
	".:::.",
	":::::",
	":::::",
	"::.::",
	":...:",
])

export const wavepulse2 = makeAsciiAnim(fast, [
	".....",
	".....",
	"..:..",
	".:::.",
	".:::.",
	":::::",
	":::::",
	"::.::",
	":...:",
	".....",
	".....",
	":...:",
	"::.::",
	":::::",
	":::::",
	".:::.",
	".:::.",
	"..:..",
])

export const bin = makeAsciiAnim(fast, [
	"000",
	"100",
	"110",
	"111",
	"011",
	"001",
])

export const binary = makeAsciiAnim(fast, [
	"11111",
	"01111",
	"00111",
	"10011",
	"11001",
	"01100",
	"00110",
	"10011",
	"11001",
	"11100",
	"11110",
])

export const binary2 = makeAsciiAnim(fast, [
	"11111",
	"01111",
	"10111",
	"11011",
	"11101",
	"11110",
	"11111",
	"11110",
	"11101",
	"11011",
	"10111",
	"01111",
])

export const pulseblue = makeAsciiAnim(slow, [
	"🔹",
	"🔵",
])

export const kiss = makeAsciiAnim(mid, [
	"🙂",
	"🙂",
	"😗",
	"😙",
	"😘",
	"😘",
	"😙",
])

export const clock = makeAsciiAnim(fast, [
	"🕐",
	"🕑",
	"🕒",
	"🕓",
	"🕔",
	"🕕",
	"🕖",
	"🕗",
	"🕘",
	"🕙",
	"🕚",
	"🕛",
])

export const fistbump = makeAsciiAnim(fast, [
	"🤜    🤛",
	"🤜    🤛",
	"🤜    🤛",
	" 🤜  🤛 ",
	"  🤜🤛  ",
	"  🤜🤛  ",
	" 🤜💥🤛 ",
	"🤜 💥 🤛",
	"🤜 ✨ 🤛",
	"🤜 ✨ 🤛",
])

export const earth = makeAsciiAnim(slow, [
	"🌎",
	"🌏",
	"🌍",
])

export const lock = makeAsciiAnim(slow, [
	"🔓",
	"🔒",
])

export const bright = makeAsciiAnim(slow, [
	"🔅",
	"🔆",
])

export const speaker = makeAsciiAnim(slow, [
	"🔈",
	"🔈",
	"🔉",
	"🔊",
	"🔊",
	"🔉",
])

export const moon = makeAsciiAnim(mid, [
	"🌑",
	"🌑",
	"🌑",
	"🌘",
	"🌗",
	"🌖",
	"🌕",
	"🌔",
	"🌓",
	"🌒",
])

