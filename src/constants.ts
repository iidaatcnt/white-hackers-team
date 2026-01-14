import type { BoardTile } from './strategies';

export const BOARD_DATA: BoardTile[] = [
    { id: 0, name: "START", type: 'start', color: '#10b981' },
    { id: 1, name: "IT企業株", type: 'investment', price: 200, income: 50, color: '#3b82f6' },
    { id: 2, name: "臨時ボーナス", type: 'event', income: 100, color: '#f59e0b' },
    { id: 3, name: "不動産投資", type: 'investment', price: 500, income: 120, color: '#8b5cf6' },
    { id: 4, name: "給食費支払い", type: 'risk', price: 50, color: '#ef4444' },
    { id: 5, name: "AIベンチャー", type: 'investment', price: 300, income: 80, color: '#3b82f6' },
    { id: 6, name: "宝くじ当選", type: 'event', income: 300, color: '#f59e0b' },
    { id: 7, name: "仮想通貨", type: 'investment', price: 400, income: 200, color: '#ec4899' },
    { id: 8, name: "スマホ代", type: 'risk', price: 100, color: '#ef4444' },
    { id: 9, name: "カフェ経営", type: 'investment', price: 600, income: 150, color: '#8b5cf6' },
    { id: 10, name: "GOAL直前!", type: 'event', income: 50, color: '#f59e0b' },
    { id: 11, name: "GOAL", type: 'start', color: '#10b981' },
];
