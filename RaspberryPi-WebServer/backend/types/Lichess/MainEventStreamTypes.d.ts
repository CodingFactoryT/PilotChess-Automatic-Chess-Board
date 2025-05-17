
type MainEventStreamEvent = GameStartEvent | GameFinishEvent | ChallengeEvent | ChallengeCanceledEvent | ChallengeDeclinedEvent;

interface GameStartEvent {
  type: "gameStart",
  game: GameEventInfo
}

interface GameFinishEvent {
  type: "gameFinish",
  game: GameEventInfo
}

interface ChallengeEvent { 
  type: "challenge",
  challenge: ChallengeJson,
  compat: GameCompat,
}

interface ChallengeCanceledEvent {
  type: "challengeCanceled",
  challenge: ChallengeJson
}

interface ChallengeDeclinedEvent {
  type: "challengeDeclined",
  challenge: ChallengeDeclinedJson
}

interface GameEventInfo {
  fullId: string,
  gameId: string,
  fen: string,
  color: Color
  lastMove: string,
  source: GameSource
  status: EventStatus
  variant: {
    key: string,
    name: string
  },
  speed: Speed,
  perf: string,
  rated: boolean,
  hasMoved: boolean,
  opponent: {
    id: string,
    username: string,
    rating: number
  },
  isMyTurn: boolean,
  secondsLeft: number,
  compat: GameCompat
  id: string
}

interface ChallengeJson {
  id: string,
  url: string,
  status: ChallengeStatus,
  challenger: ChallengeUser,
  destUser: ChallengeUser | null,
  variant: Variant,
  rated: boolean,
  speed: Speed
  timeControl: RealTimeTimeControl | CorrespondenceTimeControl | UnlimitedTimeControl,
  color: Color | "random",
  finalColor: Color,
  perf: {
    icon: string,
    name: string,
  },
  direction: "in" | "out",
  initialFen: string,
}

interface ChallengeDeclinedJson {
  declineReason: string,
  declineReasonKey: DeclineReasonKey,
  id: string,
  url: string,
  status: ChallengeStatus,
  challenger: ChallengeUser,
  destUser: ChallengeUser | null,
  variant: Variant,
  rated: boolean,
  speed: Speed,
  timeControl: RealTimeTimeControl | CorrespondenceTimeControl | UnlimitedTimeControl,
  color: Color | "random",
  finalColor: Color,
  perf: {
    icon: string,
    name: string
  },
  direction: "in" | "out",
  initialFen: string
}