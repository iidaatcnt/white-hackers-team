import type { BoardTile } from './strategies';

export const BOARD_DATA: BoardTile[] = [
    { id: 0, name: "TEAM CENTER", type: 'start', color: '#0ea5e9' },
    { id: 1, name: "ITインフラ投資", type: 'investment', price: 200, income: 50, color: '#38bdf8' },
    { id: 2, name: "研究助成金", type: 'event', income: 100, color: '#10b981' },
    { id: 3, name: "データセンター", type: 'investment', price: 500, income: 120, color: '#312e81' },
    { id: 4, name: "システム保守費", type: 'risk', price: 50, color: '#ef4444' },
    { id: 5, name: "AIサーバー増設", type: 'investment', price: 300, income: 80, color: '#38bdf8' },
    { id: 6, name: "特許ライセンス料", type: 'event', income: 300, color: '#10b981' },
    { id: 7, name: "クラウド事業", type: 'investment', price: 400, income: 200, color: '#6366f1' },
    { id: 8, name: "セキュリティ更新", type: 'risk', price: 100, color: '#ef4444' },
    { id: 9, name: "サイバー保険", type: 'investment', price: 600, income: 150, color: '#312e81' },
    { id: 10, name: "アップグレード", type: 'event', income: 50, color: '#10b981' },
    { id: 11, name: "TEAM EXTENSION", type: 'start', color: '#0ea5e9' },
];
