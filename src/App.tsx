import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Dice5,
  Terminal,
  Cpu,
  User as UserIcon,
  Bot,
  ChevronRight,
  Activity,
  Zap,
  Lock,
  Database
} from 'lucide-react'
import { BOARD_DATA } from './constants'
import { runStrategy } from './strategies'
import type { PlayerState, BoardTile } from './strategies'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export default function App() {
  const [players, setPlayers] = useState<PlayerState[]>([
    { id: 0, name: "Hacker White", money: 1000, position: 0, properties: [], isAI: false },
    { id: 1, name: "S-Lab AI", money: 1000, position: 0, properties: [], isAI: true },
  ]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [lastDice, setLastDice] = useState(0);
  const [logs, setLogs] = useState<string[]>(["システム起動。ホワイトハッカー・トレーニングを開始します。"]);
  const [gameState, setGameState] = useState<'IDLE' | 'MOVING' | 'EVENT'>('IDLE');

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const currentPlayer = players[currentPlayerIdx];

  const rollDice = useCallback(() => {
    if (gameState !== 'IDLE' || isRolling) return;

    setIsRolling(true);
    const dice = Math.floor(Math.random() * 6) + 1;
    setLastDice(dice);

    setTimeout(() => {
      setIsRolling(false);
      setGameState('MOVING');
      movePlayer(dice);
    }, 800);
  }, [gameState, isRolling]);

  const movePlayer = (steps: number) => {
    let currentPos = currentPlayer.position;
    const nextPos = (currentPos + steps) % BOARD_DATA.length;

    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIdx].position = nextPos;

    // START地点通過（リソース補給）
    if (nextPos < currentPos) {
      updatedPlayers[currentPlayerIdx].money += 200;
      addLog(`[System] ${currentPlayer.name} がリサーチ拠点を通過。200コインを補給。`);
    }

    setPlayers(updatedPlayers);
    setGameState('EVENT');
    handleTileEvent(BOARD_DATA[nextPos], updatedPlayers);
  };

  const handleTileEvent = (tile: BoardTile, currentPlayers: PlayerState[]) => {
    const updatedPlayers = [...currentPlayers];
    const p = updatedPlayers[currentPlayerIdx];

    if (tile.type === 'investment') {
      const price = tile.price || 0;

      // ここは本来ダイアログを出すべきですが、デモとして自動購入
      if (p.money >= price) {
        p.money -= price;
        p.properties.push(tile.id);
        addLog(`[Security] ${p.name} が ${tile.name} の権限を取得（-${price}コイン）`);
      } else {
        addLog(`[Alert] 資金不足のため ${tile.name} を取得できませんでした。`);
      }
    } else if (tile.type === 'event') {
      const income = tile.income || 0;
      p.money += income;
      addLog(`[Resource] イベント検知：${tile.name} により ${income} コイン獲得。`);
    } else if (tile.type === 'risk') {
      const loss = tile.price || 0;
      p.money -= loss;
      addLog(`[Warning] 脆弱性対応：${tile.name} により ${loss} コインを消費。`);
    }

    setPlayers(updatedPlayers);

    setTimeout(() => {
      setCurrentPlayerIdx((prev) => (prev + 1) % players.length);
      setGameState('IDLE');
    }, 1500);
  };

  // AIの自動実行プロセス
  useEffect(() => {
    if (gameState === 'IDLE' && !isRolling && currentPlayer.isAI) {
      const timer = setTimeout(() => {
        // AIの戦略を実行（生徒がここをカスタマイズする）
        const decision = runStrategy(currentPlayer, { players, currentPlayerIndex: currentPlayerIdx, board: BOARD_DATA });
        if (decision.action === 'INVEST') {
          // 将来的に手動判断と切り替えるためのトリガー
        }
        rollDice();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIdx, gameState, isRolling, players]);

  return (
    <div className="min-h-screen w-screen bg-[#f8fafc] text-slate-900 p-8 font-sans overflow-x-hidden selection:bg-sky-100">
      <div className="max-w-6xl mx-auto flex flex-col gap-6">

        {/* Header - White Hacker S-Lab Branding */}
        <header className="flex justify-between items-center bg-white border-2 border-slate-200 p-6 rounded-3xl shadow-xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-sky-500 rounded-2xl shadow-lg ring-4 ring-sky-500/10">
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-800">WHITE HACKERS TEAM</h1>
              <div className="flex items-center gap-2">
                <span className="bg-sky-100 text-sky-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">SHIROI CITY HQ</span>
                <span className="text-slate-300 font-bold text-[10px]">v1.0.0-BETA</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {players.map((p, idx) => (
              <div key={p.id} className={cn(
                "flex items-center gap-4 px-5 py-3 rounded-2xl border-2 transition-all duration-500",
                currentPlayerIdx === idx ? "bg-sky-50 border-sky-500 scale-105 shadow-md" : "bg-white border-slate-100 opacity-60"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shadow-sm",
                  idx === 0 ? "bg-slate-800 text-white" : "bg-sky-100 text-sky-500"
                )}>
                  {p.isAI ? <Bot size={20} /> : <UserIcon size={20} />}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase text-slate-400">{p.name}</div>
                  <div className="text-lg font-black flex items-center gap-1.5 tabular-nums text-slate-700">
                    <span className="text-sky-500">₵</span>
                    {p.money.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </header>

        {/* Main Interface */}
        <div className="flex gap-6 items-start">

          {/* Simulation Board */}
          <div className="flex-1 grid grid-cols-4 gap-4 p-6 bg-white rounded-[40px] border-2 border-slate-100 shadow-2xl relative">
            {BOARD_DATA.map((tile, i) => {
              const playersOnTile = players.filter(p => p.position === i);

              return (
                <div
                  key={tile.id}
                  className="aspect-square rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden group border-2 border-transparent transition-all hover:border-sky-200 hover:shadow-lg"
                  style={{ backgroundColor: `${tile.color}08` }}
                >
                  <div className="flex justify-between items-start">
                    <div className="w-6 h-6 rounded-lg bg-white shadow-sm flex items-center justify-center border border-slate-100">
                      <span className="text-[10px] font-black text-slate-300">{i}</span>
                    </div>
                    {tile.type === 'investment' && <Database size={14} className="text-slate-200" />}
                    {tile.type === 'risk' && <Lock size={14} className="text-rose-200" />}
                    {tile.type === 'event' && <Zap size={14} className="text-amber-200" />}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[12px] font-black text-slate-700 leading-tight">{tile.name}</div>
                    {tile.price && <div className="text-[10px] font-bold text-slate-400">COST: {tile.price}</div>}
                  </div>

                  <div className="h-1 w-full rounded-full bg-slate-100 mt-2">
                    <div className="h-full rounded-full" style={{ backgroundColor: tile.color, width: '100%' }} />
                  </div>

                  {/* Visual Tokens */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
                    <AnimatePresence>
                      {playersOnTile.map((p) => (
                        <motion.div
                          key={p.id}
                          layoutId={`token-${p.id}`}
                          initial={{ scale: 0, y: 20 }}
                          animate={{ scale: 1, y: 0 }}
                          className={cn(
                            "w-10 h-10 rounded-xl border-4 border-white shadow-xl flex items-center justify-center z-10",
                            p.id === 0 ? "bg-slate-800 text-white" : "bg-sky-500 text-white"
                          )}
                        >
                          {p.isAI ? <Bot size={18} /> : <UserIcon size={18} />}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* S-Lab Console */}
          <div className="w-80 flex flex-col gap-6 shrink-0">

            {/* Action Module */}
            <div className="bg-slate-800 text-white rounded-[32px] p-8 flex flex-col items-center gap-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl" />

              <div className="w-20 h-20 bg-white/5 rounded-3xl border-2 border-white/10 flex items-center justify-center shadow-inner relative">
                <motion.div animate={isRolling ? { rotate: 360 } : {}} transition={isRolling ? { duration: 0.5, repeat: Infinity, ease: "linear" } : {}}>
                  <Dice5 size={40} className={cn(isRolling ? "text-sky-400" : "text-white/60")} />
                </motion.div>
                {!isRolling && lastDice > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center text-2xl font-black text-sky-400"
                  >
                    {lastDice}
                  </motion.div>
                )}
              </div>

              <div className="text-center">
                <p className="text-[10px] font-black text-sky-400 uppercase tracking-[0.2em] mb-1">Analyzer Target</p>
                <p className="text-lg font-black tracking-tight">{currentPlayer.name}</p>
              </div>

              <button
                onClick={rollDice}
                disabled={gameState !== 'IDLE' || isRolling || currentPlayer.isAI}
                className="w-full py-4 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-700 text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                DEPLOY DICE <ChevronRight size={18} />
              </button>
            </div>

            {/* Terminal Output */}
            <div className="flex-1 bg-white border-2 border-slate-100 rounded-[32px] p-6 flex flex-col gap-4 shadow-lg overflow-hidden">
              <div className="flex items-center gap-2 px-1 border-b border-slate-50 pb-3">
                <Terminal size={14} className="text-slate-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Console</span>
                <div className="ml-auto flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-slate-100" />
                  <div className="w-2 h-2 rounded-full bg-slate-100" />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide text-[11px] font-bold text-slate-600">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-slate-50 rounded-xl border-l-4 border-sky-400"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* System Footer */}
        <footer className="px-6 flex justify-between items-center text-[11px] font-black text-slate-300 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Activity size={12} className="text-sky-400" />
              <span>Network Status: Stable</span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-200" />
            <span>© 2026 WHITE HACKERS TEAM</span>
          </div>
          <div className="flex gap-6">
            <span className="text-slate-400">SHIROI-CITY.PROTOCOL</span>
            <div className="flex items-center gap-1.5 text-sky-500 cursor-pointer hover:underline">
              <Cpu size={12} />
              <span>View Source</span>
            </div>
          </div>
        </footer>

      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  )
}
