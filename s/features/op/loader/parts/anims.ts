
import {makeAsciiAnim} from "./ascii-anim.js"
import {Content} from "../../../views/types.js"

const hz = 20

export const spinner = makeAsciiAnim(hz, [
	"|",
	"/",
	"-",
	"\\",
])

export const braille = makeAsciiAnim(hz, [
	"⠈",
	"⠐",
	"⠠",
	"⢀",
	"⡀",
	"⠄",
	"⠂",
	"⠁",
])

export const arrow = makeAsciiAnim(hz, [
	"←",
	"↖",
	"↑",
	"↗",
	"→",
	"↘",
	"↓",
	"↙",
])

export const arrow2 = makeAsciiAnim(hz, [
	"⬆️",
	"↗️",
	"➡️",
	"↘️",
	"⬇️",
	"↙️",
	"⬅️",
	"↖️",
])

export const bar = makeAsciiAnim(hz, [
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

export const bar2 = makeAsciiAnim(hz, [
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

export const bar3 = makeAsciiAnim(hz, [
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

export const bar4 = makeAsciiAnim(hz, [
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

export const pie = makeAsciiAnim(hz, [
	"◷",
	"◶",
	"◵",
	"◴",
])

export const cylon = makeAsciiAnim(hz, [
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

export const slider = makeAsciiAnim(hz, [
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

export const scrubber = makeAsciiAnim(hz, [
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

export const pulse = makeAsciiAnim(hz, [
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

export const bin = makeAsciiAnim(hz, [
	"000",
	"100",
	"110",
	"111",
	"011",
	"001",
])

export const binary = makeAsciiAnim(hz, [
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

export const binary2 = makeAsciiAnim(hz, [
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

export const clock = makeAsciiAnim(hz, [
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

export const fistbump = makeAsciiAnim(hz, [
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

export const earth = makeAsciiAnim(4, [
	"🌎",
	"🌏",
	"🌍",
])

export const lock = makeAsciiAnim(4, [
	"🔓",
	"🔒",
])

export const bright = makeAsciiAnim(4, [
	"🔅",
	"🔆",
])

export const speaker = makeAsciiAnim(4, [
	"🔈",
	"🔈",
	"🔉",
	"🔊",
	"🔊",
	"🔉",
])

export const moon = makeAsciiAnim(10, [
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

