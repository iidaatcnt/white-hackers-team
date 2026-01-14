
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


// ========================================================================
// 🛡️ WHITE HACKERS TEAM - STRATEGY ENGINE
// ========================================================================
// ここは君たちの「知能」を組み込む場所だ。
// 自分のキャラクターがどのように判断し、行動するかをプログラムしよう！
// ========================================================================

export const runStrategy = (player: PlayerState, _gameState: GameState) => {

    // 【ミッション 1】
    // 今のロジックは「1000コイン以上持っていたら、500コイン投資する」というものだ。
    // これでは、投資した直後に一気にお金が減ってしまうリスクがある。
    // 
    // Q: 「全財産の50%だけ投資する」というロジックに変えるには、どう書けばいいだろう？

    if (player.money >= 1000) {
        // [ヒント] player.money * 0.5 と書いてみよう
        return {
            action: 'INVEST',
            amount: 500,
            reason: "十分な資金（1000コイン以上）を確保しているため、投資を実行。"
        };
    }

    // 【ミッション 2】
    // 何もアクションを起こさない時の判断も重要だ。
    return {
        action: 'NONE',
        reason: "現在はリソースを温存し、次のチャンスを待機中。"
    };
};
