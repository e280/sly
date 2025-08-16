
import {makeAsciiLoader} from "./parts/ascii-loader.js";

const hz = 15

export const loady = {
	cylon: makeAsciiLoader(hz, [
		"=----",
		"-=---",
		"--=--",
		"---=-",
		"----=",
		"-----",
		"-----",
	]),

	dots: makeAsciiLoader(hz, [
		":....",
		"::...",
		".::..",
		"..::.",
		"...::",
		"....:",
		".....",
		".....",
	]),

	binary: makeAsciiLoader(hz, [
		"01111",
		"10111",
		"11011",
		"11101",
		"11110",
		"11111",
		"11111",
	]),
}

