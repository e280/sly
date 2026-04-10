
import {Wait} from "./type.js"

export const isWaitPending = (wait: Wait<unknown>) => !wait.done
export const isWaitDone = (wait: Wait<unknown>) => wait.done
export const isWaitOk = (wait: Wait<unknown>) => wait.done && wait.ok
export const isWaitErr = (wait: Wait<unknown>) => wait.done && !wait.ok

