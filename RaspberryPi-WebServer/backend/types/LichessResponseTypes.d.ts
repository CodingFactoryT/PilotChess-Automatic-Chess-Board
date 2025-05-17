interface GameFullEvent {
  id: string,
  variant: {
    key: string,
    name: string,
    short: string
  },
  speed: string,
  perf: {
    name: string
  },
  rated: string,
  createdAt: string,
  white: {
    id: string,
    name: string,
    string: string,
    rating: string
  },
  black: {
    id: string,
    name: string,
    string: string,
    rating: string
  },
  initialFen: string,
  clock: {
    initial: string,
    increment: string
  },
  type: "gameFull",
  state: {
    type: string,
    moves: string,
    wtime: string,
    btime: string,
    winc: string,
    binc: string,
    status: string
  }
}

interface GameStateEvent {
  type: "gameState",
  moves: string,
  wtime: string,
  btime: string,
  winc: string,
  binc: string,
  wdraw: string,
  bdraw: string,
  wtakeback: string,
  btakeback: string,
  status: string
}

interface ChatLineEvent {
  type: "chatLine",
  username: string,
  text: string,
  room: string
}

interface OpponentGoneEvent {
  type: "opponentGone",
  gone: string,
  claimWinInSeconds: string
}

interface LichessError {
  error: string
}

type GameStreamEvent = GameFullEvent | GameStateEvent | ChatLineEvent | OpponentGoneEvent;

interface GameStartEvent {
  type: "gameStart",
  game: {
    fullId: string,
    gameId: string,
    fen: string,
    color: "white" | "black",
    lastMove: string,
    source: string,
    status: {
      id: string,
      name: string
    },
    variant: {
      key: string,
      name: string
    },
    speed: string,
    perf: string,
    rated: string,
    hasMoved: string,
    opponent: {
      id: string,
      username: string,
      rating: string
    },
    isMyTurn: string,
    secondsLeft: string,
    compat: {
      bot: string,
      board: string
    },
    id: string
  }
}

interface GameFinishEvent {
  type: "gameFinish",
  game: {
    fullId: string,
    gameId: string,
    fen: string,
    color: "white" | "black",
    lastMove: string,
    source: string,
    status: {
    id: string,
    name: string
    },
    variant: {
      key: string,
      name: string
    },
    speed: string,
    perf: string,
    rated: string,
    hasMoved: string,
    opponent: {
    id: string,
    username: string,
    rating: string
    },
    isMyTurn: string,
    secondsLeft: string,
    compat: {
    bot: string,
    board: string
    },
    id: string
  }
}

interface ChallengeEvent { 
  type: "challenge",
  challenge: {
    id: string,
    url: string,
    status: string,
    challenger: {
      id: string,
      name: string,
      rating: string,
      title: string,
      provisional: string,
      online: string,
      lag: string
    },
    destUser: {
      id: string,
      name: string,
      rating: string,
      title: string,
      provisional: string,
      online: string,
      lag: string
    },
    variant: {
      key: string,
      name: string,
      short: string
    },
    rated: string,
    speed: string,
    timeControl: {
      type: string,
      limit: string,
      increment: string,
      show: string
    },
    color: string,
    finalColor: "black" | "white",
    perf: {
      icon: string,
      name: string
    },
    direction: string
  }
  compat: {
    bot: string,
    board: string
  } 
}

interface ChallengeCanceledEvent {
  type: "challengeCanceled",
  challenge: {
    id: string,
    url: string,
    status: string,
    challenger: {
      id: string,
      name: string,
      rating: string,
      title: string,
      provisional: string,
      online: string,
      lag: string
    },
    destUser: {
      id: string,
      name: string,
      rating: string,
      title: string,
      provisional: string,
      online: string,
      lag: string
    },
    variant: {
      key: string,
      name: string,
      short: string
    },
    rated: string,
    speed: string,
    timeControl: {
      type: string,
      limit: string,
      increment: string,
      show: string
    },
    color: string,
    finalColor: string,
    perf: {
      icon: string,
      name: string
    },
    direction: string
  }
}

interface ChallengeDeclinedEvent {
  type: "challengeDeclined",
  challenge: {
    id: string,
    url: string,
    status: string,
    challenger: {
      id: string,
      name: string,
      rating: string,
      title: string,
      provisional: string,
      online: string,
      lag: string
    },
    destUser: {
      id: string,
      name: string,
      rating: string,
      title: string,
      provisional: string,
      online: string,
      lag: string
    },
    variant: {
      key: string,
      name: string,
      short: string
    },
    rated: string,
    speed: string,
    timeControl: {
      type: string,
      limit: string,
      increment: string,
      show: string
    },
    color: string,
    finalColor: string,
    perf: {
      icon: string,
      name: string
    },
    direction: string,
    declineReason: string,
    declineReasonKey: string
  }
}

type MainEventStreamEvent = GameStartEvent | GameFinishEvent | ChallengeEvent | ChallengeCanceledEvent | ChallengeDeclinedEvent;