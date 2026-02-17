import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Cpu,
  Search,
  X,
  Coins,
  Shield,
  Clock,
  Hash
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- IMPORT DE L'API CONNECTÉE AU BACKEND JAVA ---
import { apiAffiche } from "./api";

// --- CONFIGURATION ANIMATIONS ---
const blockVariants = {
  center: { x: 0, scale: 1, opacity: 1, zIndex: 10, filter: "blur(0px)" },
  left: { x: -320, scale: 0.8, opacity: 0.3, zIndex: 5, filter: "blur(1px)" },
  right: { x: 320, scale: 0.8, opacity: 0.3, zIndex: 5, filter: "blur(1px)" },
  hiddenLeft: { x: -500, scale: 0.5, opacity: 0, zIndex: 0 },
  hiddenRight: { x: 500, scale: 0.5, opacity: 0, zIndex: 0 },
};

const App = () => {
  // --- ÉTATS ---
  const [blocks, setBlocks] = useState([]); // On démarre avec un tableau vide, Java va le remplir !
  const [mempool, setMempool] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTx, setSelectedTx] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);

  // --- CHARGEMENT AUTOMATIQUE DE LA BLOCKCHAIN ---
  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await apiAffiche.getBlockChain(); // Appel de la route /all
        const javaBlocks = response.data;

        if (javaBlocks && javaBlocks.length > 0) {
          // On formate les données de Java pour React
          const formattedBlocks = javaBlocks.map((javaBlock, index) => {
            // Jackson (Spring Boot) peut mettre des majuscules ou minuscules, on sécurise :
            const header = javaBlock.blockHeader || javaBlock.BlockHeader;
            const body = javaBlock.blockBody || javaBlock.BlockBody;
            const txList = body?.transactionList || body?.TransactionList || [];

            return {
              index: index,
              hash: `BLOCK_HASH_N°${index}`, // Placeholder pour le hash du bloc actuel
              prevHash: header?.hashPre || header?.HashPre || "0000000000000000",
              merkleRoot: header?.merkleRoot || header?.MerkleRoot,
              timestamp: header?.timeStamp || header?.TimeStamp,
              nonce: header?.nonce || header?.Nonce,
              transactions: txList,
              data: `Transactions: ${txList.length}`,
            };
          });

          // Si c'est le premier chargement ou si un nouveau bloc est arrivé, on met à jour
          setBlocks((prevBlocks) => {
            if (prevBlocks.length !== formattedBlocks.length) {
              // Optionnel : on déplace la caméra sur le tout dernier bloc miné
              setCurrentIndex(formattedBlocks.length - 1);
            }
            return formattedBlocks;
          });
        }
      } catch (error) {
        console.error("Erreur Backend: Impossible de charger la blockchain.", error);
      }
    };

    // 1. On charge la blockchain immédiatement à l'ouverture de la page
    fetchBlockchain();

    // 2. On interroge le serveur Java toutes les 10 secondes pour vérifier les nouveautés
    const interval = setInterval(fetchBlockchain, 10000);

    return () => clearInterval(interval);
  }, []);

  // Simulation Mempool (Barre de gauche)
  useEffect(() => {
    const interval = setInterval(() => {
      const newTx = {
        id: `tx_${Math.floor(Math.random() * 10000)}`,
        from: `bc1q${Math.random().toString(36).substring(7)}`,
        to: `bc1q${Math.random().toString(36).substring(7)}`,
        amount: (Math.random() * 2).toFixed(4),
        fees: (Math.random() * 0.001).toFixed(6),
      };
      setMempool((prev) => [newTx, ...prev].slice(0, 10));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const moveNext = () => currentIndex < blocks.length - 1 && setCurrentIndex(currentIndex + 1);
  const movePrev = () => currentIndex > 0 && setCurrentIndex(currentIndex - 1);

  const handleSearch = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;
    const foundIndex = blocks.findIndex((b) => b.index.toString() === term);

    if (foundIndex !== -1) {
      setCurrentIndex(foundIndex);
      setSearchTerm("");
    } else {
      alert("Bloc introuvable !");
    }
  };

  const getBlockPosition = (index) => {
    if (index === currentIndex) return "center";
    if (index === currentIndex - 1) return "left";
    if (index === currentIndex + 1) return "right";
    return index < currentIndex ? "hiddenLeft" : "hiddenRight";
  };

  return (
      <div className="flex h-screen bg-slate-900 text-white overflow-hidden font-sans">
        {/* 1. SIDEBAR : MEMPOOL */}
        <aside className="w-1/4 border-r border-slate-700 bg-slate-800/50 p-6 flex flex-col z-20">
          <div className="flex items-center gap-2 mb-6 text-yellow-500 font-black italic">
            <Cpu size={24} />
            <h2 className="text-xl uppercase tracking-widest">Mempool Live</h2>
          </div>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence initial={false}>
              {mempool.map((tx) => (
                  <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      onClick={() => setSelectedTx(tx)}
                      className="p-3 bg-slate-800 border border-slate-700 rounded-xl hover:border-yellow-500/50 cursor-pointer transition-all group"
                  >
                    <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-mono font-bold text-yellow-600 bg-yellow-600/10 px-2 py-0.5 rounded">
                    {tx.id}
                  </span>
                      <span className="text-sm font-bold text-white">
                    {tx.amount} BTC
                  </span>
                    </div>
                    <div className="space-y-1.5 border-t border-slate-700/50 pt-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[9px] text-slate-500 font-bold w-7">FROM:</span>
                        <span className="text-[9px] font-mono text-slate-400 truncate">{tx.from}</span>
                      </div>
                      <div className="flex items-center gap-2 overflow-hidden">
                        <span className="text-[9px] text-slate-500 font-bold w-7">TO:</span>
                        <span className="text-[9px] font-mono text-slate-400 truncate">{tx.to}</span>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </aside>

        {/* 2. SECTION PRINCIPALE */}
        <main className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden">
          {/* HEADER & RECHERCHE */}
          <div className="z-20 text-center mb-6 w-full">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Database className="text-blue-400" size={36} />
              <h1 className="text-4xl font-black tracking-tighter text-blue-50 uppercase italic">
                Blockchain Explorer
              </h1>
            </div>

            <form onSubmit={handleSearch} className="flex w-96 mx-auto group shadow-2xl mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="Rechercher un index..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-l-2xl py-3.5 pl-12 pr-4 outline-none focus:border-blue-500 text-sm transition-all"
                />
              </div>
              <button className="bg-blue-600 hover:bg-blue-500 px-6 rounded-r-2xl font-black text-sm uppercase tracking-widest transition-colors">
                Find
              </button>
            </form>

            {/* L'ancien bouton "Générer un Bloc" a été supprimé ici ! */}
            <div className="text-slate-500 text-sm flex items-center justify-center gap-2 animate-pulse mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div> En attente de nouveaux blocs automatiques...
            </div>
          </div>

          {/* 3. CARROUSEL DYNAMIQUE */}
          <div className="relative w-full h-96 flex items-center justify-center">
            {blocks.length === 0 ? (
                <div className="text-slate-500 font-mono text-lg animate-pulse">Chargement de la blockchain...</div>
            ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  {blocks.map((block, i) => {
                    const pos = getBlockPosition(i);
                    if (pos.includes("hidden") && Math.abs(i - currentIndex) > 1) return null;

                    return (
                        <motion.div
                            key={block.index}
                            variants={blockVariants}
                            animate={pos}
                            initial={pos.includes("Left") ? "hiddenLeft" : "hiddenRight"}
                            exit={pos.includes("Left") ? "hiddenLeft" : "hiddenRight"}
                            transition={{ type: "spring", stiffness: 200, damping: 25 }}
                            onClick={() => pos === "center" && setSelectedBlock(block)}
                            className={`absolute w-85 p-8 rounded-[2.5rem] border shadow-2xl transition-all ${
                                pos === "center"
                                    ? "bg-gradient-to-br from-blue-600 to-indigo-900 border-blue-300 cursor-pointer hover:scale-105 active:scale-95"
                                    : "bg-slate-800 border-slate-700"
                            }`}
                        >
                          <div className="font-mono text-[10px] truncate mb-6 opacity-30 bg-black/30 p-2 rounded tracking-widest">
                            {block.hash}
                          </div>

                          <div className={`font-black leading-none transition-all duration-500 ${pos === "center" ? "text-3xl text-white" : "text-sm text-slate-700"}`}>
                            BLOCK INDEX # {block.index}
                          </div>

                          {pos === "center" && (
                              <motion.div
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between"
                              >
                        <span className="text-[10px] uppercase font-bold text-blue-300 animate-pulse flex items-center gap-2">
                          <Shield size={12} /> Inspect Header
                        </span>
                                <span className="text-[10px] font-mono text-blue-200/50">v1.0.4</span>
                              </motion.div>
                          )}
                        </motion.div>
                    );
                  })}
                </AnimatePresence>
            )}
          </div>

          {/* NAVIGATION BASSE */}
          <div className="mt-8 flex gap-14 z-20">
            <button
                onClick={movePrev}
                disabled={currentIndex === 0 || blocks.length === 0}
                className="p-5 rounded-full bg-slate-800 hover:bg-blue-600 disabled:opacity-5 border border-slate-700 shadow-xl transition-all active:scale-90"
            >
              <ArrowLeft size={32} />
            </button>
            <button
                onClick={moveNext}
                disabled={currentIndex === blocks.length - 1 || blocks.length === 0}
                className="p-5 rounded-full bg-slate-800 hover:bg-blue-600 disabled:opacity-5 border border-slate-700 shadow-xl transition-all active:scale-90"
            >
              <ArrowRight size={32} />
            </button>
          </div>
        </main>

        {/* --- MODALE TRANSACTION (Mempool) --- */}
        <AnimatePresence>
          {selectedTx && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedTx(null)}
              >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9 }}
                    className="bg-slate-800 border border-slate-600 p-8 rounded-3xl w-full max-w-lg shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                >
                  <button onClick={() => setSelectedTx(null)} className="absolute top-6 right-6 text-slate-400 hover:text-white">
                    <X size={24} />
                  </button>
                  <h3 className="text-2xl font-black text-yellow-500 mb-8 flex items-center gap-3 italic uppercase tracking-tighter">
                    <Coins size={28} /> Tx Details
                  </h3>
                  <div className="space-y-5">
                    <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                      <label className="text-[10px] uppercase text-slate-500 font-bold mb-1 block">Hash ID</label>
                      <div className="font-mono text-xs text-white break-all">{selectedTx.id}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <label className="text-[10px] text-blue-400 font-bold block mb-1">Sender</label>
                        <div className="font-mono text-[10px] text-slate-300 truncate">{selectedTx.from}</div>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                        <label className="text-[10px] text-green-400 font-bold block mb-1">Receiver</label>
                        <div className="font-mono text-[10px] text-slate-300 truncate">{selectedTx.to}</div>
                      </div>
                    </div>
                    <div className="bg-yellow-500/5 p-5 rounded-xl border border-yellow-500/20 flex justify-between items-center">
                      <div>
                        <label className="text-[10px] text-yellow-600 font-bold block uppercase">Amount</label>
                        <div className="text-2xl font-black text-white">{selectedTx.amount} <span className="text-sm text-yellow-500">BTC</span></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>

        {/* --- MODALE HEADER DU BLOC (Avec Vraies Transactions Java) --- */}
        <AnimatePresence>
          {selectedBlock && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-xl flex items-center justify-center z-50 p-4"
                  onClick={() => setSelectedBlock(null)}
              >
                <motion.div
                    initial={{ scale: 0.8, rotateX: 15 }}
                    animate={{ scale: 1, rotateX: 0 }}
                    exit={{ scale: 0.8 }}
                    className="bg-slate-900 border border-blue-500/30 p-10 rounded-[3rem] w-full max-w-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)] relative max-h-[90vh] overflow-y-auto custom-scrollbar"
                    onClick={(e) => e.stopPropagation()}
                >
                  <button
                      onClick={() => setSelectedBlock(null)}
                      className="absolute top-8 right-8 text-slate-500 hover:text-white sticky"
                  >
                    <X size={28} />
                  </button>
                  <h3 className="text-3xl font-black text-blue-500 mb-10 flex items-center gap-4 uppercase italic tracking-tighter">
                    <Shield size={36} /> Block Header #{selectedBlock.index}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="md:col-span-2 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Merkle Root</label>
                      <div className="font-mono text-[10px] text-slate-300 break-all">{selectedBlock.merkleRoot}</div>
                    </div>

                    <div className="md:col-span-2 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                      <label className="text-[10px] uppercase font-bold text-slate-500 mb-1 block">Previous Hash</label>
                      <div className="font-mono text-[10px] text-slate-500 break-all">{selectedBlock.prevHash}</div>
                    </div>

                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Clock size={18} /> <span className="text-xs font-bold">Time</span>
                      </div>
                      <div className="text-sm font-mono text-white">
                        {selectedBlock.timestamp ? selectedBlock.timestamp : "Inconnu"}
                      </div>
                    </div>

                    <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700 flex justify-between items-center">
                      <div className="flex items-center gap-3 text-slate-400">
                        <Cpu size={18} /> <span className="text-xs font-bold">Nonce</span>
                      </div>
                      <div className="text-sm font-mono text-yellow-500 font-bold">{selectedBlock.nonce}</div>
                    </div>
                  </div>

                  {/* LISTE DES TRANSACTIONS RÉELLES DE JAVA */}
                  <div className="bg-blue-600/10 p-5 rounded-xl border border-blue-500/20">
                    <label className="text-[10px] text-blue-400 font-bold block mb-3 uppercase flex justify-between">
                      <span>Transactions ({selectedBlock.transactions.length})</span>
                    </label>

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {selectedBlock.transactions.map((tx, idx) => {
                        // Sécurité pour la casse des variables selon Jackson
                        const sender = tx.expediteur || tx.Expediteur;
                        const receiver = tx.destinataire || tx.Destinataire;
                        const amount = tx.quantite || tx.Quantite;

                        return (
                            <div key={idx} className="flex justify-between items-center bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
                              <div className="flex flex-col w-[40%]">
                                <span className="text-[8px] text-slate-500 font-bold">FROM</span>
                                <span className="text-[10px] font-mono text-slate-300 truncate">{sender}</span>
                              </div>
                              <div className="flex flex-col w-[40%]">
                                <span className="text-[8px] text-slate-500 font-bold">TO</span>
                                <span className="text-[10px] font-mono text-slate-300 truncate">{receiver}</span>
                              </div>
                              <div className="flex flex-col items-end w-[20%]">
                                <span className="text-[8px] text-slate-500 font-bold">AMOUNT</span>
                                <span className="text-xs font-bold text-yellow-500">{amount ? amount.toFixed(2) : 0}</span>
                              </div>
                            </div>
                        );
                      })}

                      {selectedBlock.transactions.length === 0 && (
                          <div className="text-sm text-slate-500 italic text-center py-4">Aucune transaction dans ce bloc</div>
                      )}
                    </div>
                  </div>

                </motion.div>
              </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
};

export default App;