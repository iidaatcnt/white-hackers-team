import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Coins,
  Dice5,
  TrendingUp,
  User as UserIcon,
  Bot,
  ChevronRight,
  History,
  Info
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
    { id: 0, name: "Player 1", money: 1000, position: 0, properties: [], isAI: false },
    { id: 1, name: "CPU Logic", money: 1000, position: 0, properties: [], isAI: true },
  ]);
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [lastDice, setLastDice] = useState(0);
  const [logs, setLogs] = useState<string[]>(["ゲームスタート！目標は資産を増やすことです。"]);
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

    // アニメーション用に少しずつ動かす（今回はシンプルに一気でも良いが状態は更新）
    const updatedPlayers = [...players];
    updatedPlayers[currentPlayerIdx].position = nextPos;

    // サラリー（START地点通過）
    if (nextPos < currentPos) {
      updatedPlayers[currentPlayerIdx].money += 200;
      addLog(`${currentPlayer.name} はSTART地点を通過し、200コインを受け取りました。`);
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
      // AIの場合は戦略を実行、プレイヤーの場合はダイアログを出す（今回は自動）
      if (p.money >= price) {
        p.money -= price;
        p.properties.push(tile.id);
        addLog(`${p.name} は ${tile.name} に投資しました（-${price}コイン）`);
      } else {
        addLog(`${p.name} は資金不足で ${tile.name} に投資できませんでした。`);
      }
    } else if (tile.type === 'event') {
      const income = tile.income || 0;
      p.money += income;
      addLog(`${p.name} はイベントで ${income} コイン獲得！`);
    } else if (tile.type === 'risk') {
      const loss = tile.price || 0;
      p.money -= loss;
      addLog(`${p.name} は支払いで ${loss} コイン失いました...`);
    }

    setPlayers(updatedPlayers);

    // 次のターンへ
    setTimeout(() => {
      setCurrentPlayerIdx((prev) => (prev + 1) % players.length);
      setGameState('IDLE');
    }, 1500);
  };

  // AIの自動実行
  useEffect(() => {
    if (gameState === 'IDLE' && !isRolling && currentPlayer.isAI) {
      const timer = setTimeout(() => {
        // 戦略の実行
        const decision = runStrategy(currentPlayer, { players, currentPlayerIndex: currentPlayerIdx, board: BOARD_DATA });
        if (decision.action === 'INVEST' && decision.amount) {
          addLog(`[AI思考] ${currentPlayer.name} は追加投資（${decision.amount}）を検討しています...`);
        }
        rollDice();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [currentPlayerIdx, gameState, isRolling, players]);

  return (
    <div className="min-h-screen w-screen bg-[#0f172a] text-white p-8 font-sans overflow-x-hidden">
      <div className="max-w-6xl mx-auto flex flex-col gap-8">

        {/* Header */}
        <header className="flex justify-between items-center bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg ring-4 ring-orange-500/20">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight">LOGIC VENTURE</h1>
              <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Algotrade Board Game</p>
            </div>
          </div>

          <div className="flex gap-6">
            {players.map((p, idx) => (
              <div key={p.id} className={cn(
                "flex items-center gap-4 px-6 py-3 rounded-2xl border transition-all duration-300",
                currentPlayerIdx === idx ? "bg-white/10 border-white/40 scale-105 shadow-xl" : "bg-transparent border-white/5 opacity-50"
              )}>
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shadow-inner",
                  idx === 0 ? "bg-blue-500" : "bg-purple-500"
                )}>
                  {p.isAI ? <Bot size={20} /> : <UserIcon size={20} />}
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase opacity-40">{p.name}</div>
                  <div className="text-lg font-black flex items-center gap-1.5 tabular-nums">
                    <Coins size={14} className="text-yellow-400" />
                    {p.money.toLocaleString()}
                  </div>
                </div>
                {currentPlayerIdx === idx && (
                  <motion.div layoutId="active-indicator" className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        </header>

        {/* Main Game Area */}
        <div className="flex gap-8 items-start">

          {/* Board */}
          <div className="flex-1 grid grid-cols-4 gap-4 p-4 bg-white/5 rounded-[40px] border border-white/10 shadow-inner relative">
            {BOARD_DATA.map((tile, i) => {
              // プレイヤーの駒を表示
              const playersOnTile = players.filter(p => p.position === i);

              return (
                <div
                  key={tile.id}
                  className="aspect-square rounded-3xl p-4 flex flex-col justify-between relative overflow-hidden group border border-white/5 transition-all hover:border-white/20 hover:bg-white/5"
                  style={{ backgroundColor: `${tile.color}15` }}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-black opacity-30">{String(tile.id).padStart(2, '0')}</span>
                    {tile.price && (
                      <span className="bg-black/40 px-2 py-0.5 rounded-full text-[9px] font-black backdrop-blur-sm">
                        {tile.price}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-black leading-tight line-clamp-2">{tile.name}</div>
                    {tile.income && <div className="text-[9px] font-bold text-green-400">+{tile.income} / turn</div>}
                  </div>

                  <div className="h-1.5 w-full rounded-full bg-white/5 mt-2 overflow-hidden">
                    <div className="h-full" style={{ backgroundColor: tile.color, width: '100%' }} />
                  </div>

                  {/* Player Tokens */}
                  <div className="absolute inset-0 flex items-center justify-center gap-1 pointer-events-none">
                    <AnimatePresence>
                      {playersOnTile.map((p) => (
                        <motion.div
                          key={p.id}
                          layoutId={`token-${p.id}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: "spring", damping: 15, stiffness: 300 }}
                          className={cn(
                            "w-8 h-8 rounded-full border-2 border-white shadow-2xl flex items-center justify-center z-10",
                            p.id === 0 ? "bg-blue-500" : "bg-purple-500"
                          )}
                        >
                          {p.isAI ? <Bot size={14} /> : <UserIcon size={14} />}
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sidebar */}
          <div className="w-80 flex flex-col gap-6 shrink-0">

            {/* Control Panel */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 flex flex-col items-center gap-6 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5 italic text-[80px] font-black select-none pointer-events-none">
                {lastDice || '?'}
              </div>

              <div className="w-24 h-24 bg-gradient-to-br from-white/10 to-transparent rounded-[32px] border border-white/20 flex items-center justify-center group cursor-pointer shadow-inner">
                <motion.div
                  animate={isRolling ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : {}}
                  transition={isRolling ? { duration: 0.5, repeat: Infinity } : { duration: 0.3 }}
                >
                  <Dice5 size={48} className={cn("transition-colors", isRolling ? "text-yellow-400" : "text-white/80 group-hover:text-white")} />
                </motion.div>
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-xs font-black uppercase text-white/40 tracking-widest">
                  {currentPlayer.isAI ? "AI Thinking..." : "Your Turn"}
                </h3>
                <p className="text-lg font-black">{currentPlayer.name}</p>
              </div>

              <button
                onClick={rollDice}
                disabled={gameState !== 'IDLE' || isRolling || currentPlayer.isAI}
                className={cn(
                  "w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed",
                  "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                )}
              >
                サイコロを振る <ChevronRight size={18} />
              </button>
            </div>

            {/* History Logs */}
            <div className="flex-1 bg-white/5 border border-white/10 rounded-[32px] p-6 flex flex-col gap-4 shadow-xl">
              <div className="flex items-center gap-2 px-2">
                <History size={14} className="text-white/40" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Activity Log</span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-none text-[11px] font-bold leading-relaxed">
                {logs.map((log, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-3 bg-white/5 rounded-xl border-l-2 border-blue-500/50"
                  >
                    {log}
                  </motion.div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Footer Info */}
        <footer className="flex justify-between items-center text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 border border-white/10 px-3 py-1.5 rounded-full">
              <Info size={12} />
              <span>Logic Venture v0.1.0</span>
            </div>
          </div>
          <div className="flex gap-8">
            <span className="hover:text-white/40 transition-colors cursor-pointer">Documentation</span>
            <span className="hover:text-white/40 transition-colors cursor-pointer">Strategy API</span>
            <span className="hover:text-white/40 transition-colors cursor-pointer">Open Source</span>
          </div>
        </footer>

      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  )
}
