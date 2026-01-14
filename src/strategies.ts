
export interface PlayerState {
    id: number;
    name: string;
    money: number;
    position: number;
    properties: number[];
    isAI: boolean;
}

export interface GameState {
    players: PlayerState[];
    currentPlayerIndex: number;
    board: BoardTile[];
}

export type BoardTile = {
    id: number;
    name: string;
    type: 'start' | 'investment' | 'event' | 'risk';
    price?: number;
    income?: number;
    color?: string;
};

// 生徒が書き換えるための戦略関数
export const runStrategy = (player: PlayerState, _gameState: GameState) => {
    // ここにロジックを自由に書いてもらう
    // 例: お金が1000円以上あれば、投資する
    if (player.money >= 1000) {
        return { action: 'INVEST', amount: 500 };
    }
    return { action: 'NONE' };
};
