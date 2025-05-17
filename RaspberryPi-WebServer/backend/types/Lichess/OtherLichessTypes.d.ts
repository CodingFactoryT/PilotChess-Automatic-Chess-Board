interface LichessError {
  error: string
}

interface RealTimeTimeControl {
  type: "clock",
  limit: number,
  increment: number,
  show: string
}

interface CorrespondenceTimeControl {
  type: "correspondence",
  daysPerTurn: number
}

interface UnlimitedTimeControl {
  type: "unlimited"
}

type GameSource = "lobby" | "friend" | "ai" | "api" | "tournament" | "position" | "import" | "importlive" | "simul" | "relay" | "pool" | "swiss";
type Color = "white" | "black";

interface EventStatus {
  id: 10 | 20 | 25 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 60,
  name: "created" | "started" | "aborted" | "mate" | "resign" | "stalemate" | "timeout" | "draw" | "outoftime" | "cheat" | "noStart" | "unknownFinish" | "variantEnd",
}

type Speed = "ultraBullet" | "bullet" | "blitz" | "rapid" | "classical" | "correspondence";

type ChallengeStatus = "created" | "offline" | "canceled" | "declined" | "accepted";

type Title = "GM" | "WGM" | "IM" | "WIM" | "FM" | "WFM" | "NM" | "CM" | "WCM" | "WNM" | "LM" | "BOT";

interface ChallengeUser {
  id: string,
  name: string,
  rating: number,
  title: Title | null,
  flair: string,
  patron: boolean
  provisional: boolean,
  online: boolean,
  lag: number
}

type VariantKey = "standard" | "chess960" | "crazyhouse" | "antichess" | "atomic" | "horde" | "kingOfTheHill" | "racingKings" | "threeCheck" | "fromPosition";

interface Variant {
  key: VariantKey
  name: string,
  short: string
}

type DeclineReasonKey = "generic" | "later" | "tooFast" | "tooSlow" | "timeControl" | "rated" | "casual" | "standard" | "variant" | "noBot" | "onlyBot";

interface GameCompat { 
  bot: boolean,
  board: boolean
}