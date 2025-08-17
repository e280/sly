
import {AsciiAnim} from "./ascii-anim.js"
import {Content} from "../../../views/types.js"

export function ascii(hz: number, frames: string[]): () => Content {
	return () => AsciiAnim({hz, frames})
}

const hz = 20

export const spinner = ascii(hz, [
	"|",
	"/",
	"-",
	"\\",
])

export const braille = ascii(hz, [
	"⠈",
	"⠐",
	"⠠",
	"⢀",
	"⡀",
	"⠄",
	"⠂",
	"⠁",
])

export const aesthetic = ascii(hz, [
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

export const aesthetic2 = ascii(hz, [
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

export const aesthetic3 = ascii(hz, [
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

export const clock = ascii(hz, [
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

export const fistbump = ascii(hz, [
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

export const pie = ascii(hz, [
	"◷",
	"◶",
	"◵",
	"◴",
])

export const cylon = ascii(hz, [
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

export const slider = ascii(hz, [
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

export const scrubber = ascii(hz, [
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

export const pulse = ascii(hz, [
	".....",
	".....",
	"..:..",
	".:::.",
	".:::.",
	":::::",
	":::::",
	".:::.",
	".:::.",
	"..:..",
])

export const binary = ascii(hz, [
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

