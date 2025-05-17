
type GameStreamEvent = GameFullEvent | GameStateEvent | ChatLineEvent | OpponentGoneEvent;

interface GameFullEvent {
  type: "gameFull",
  id: string,
  variant: Variant,
  clock: {
    initial: number,
    increment: number
  },
  speed: Speed,
  perf: {
    name: string
  },
  rated: boolean,
  createdAt: number,
  white: GameEventPlayer,
  black: GameEventPlayer,
  initialFen: string,
  state: GameStateEvent
  tournamentId: string,
}

interface GameStateEvent {
  type: "gameState",
  moves: string,
  wtime: number,
  btime: number,
  winc: number,
  binc: number,
  status: GameStatus,
  winner: string,
  wdraw: boolean,
  bdraw: boolean,
  wtakeback: boolean,
  btakeback: boolean,
}

interface ChatLineEvent {
  type: "chatLine",
  room: "player" | "spectator",
  username: string,
  text: string,
}

interface OpponentGoneEvent {
  type: "opponentGone",
  gone: boolean,
  claimWinInSeconds: number,
}

interface GameEventPlayer {
  aiLevel: number,
  id: string,
  name: string,
  title: Title | null
  rating: number,
  provisional: boolean,
}

type GameStatus =  | "created" | "started" | "aborted" | "mate" | "resign" | "stalemate" | "timeout" | "draw" | "outoftime" | "cheat" | "noStart" | "unknownFinish" | "variantEnd";
