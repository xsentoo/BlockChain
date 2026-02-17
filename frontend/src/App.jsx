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
  Wallet,
  Send,
  Lock,
  LogOut,
  PlusCircle, // Nouveau !
  Copy        // Nouveau !
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiAffiche } from "./api";

const blockVariants = {
  center: { x: 0, scale: 1, opacity: 1, zIndex: 10, filter: "blur(0px)" },
  left: { x: -320, scale: 0.8, opacity: 0.3, zIndex: 5, filter: "blur(1px)" },
  right: { x: 320, scale: 0.8, opacity: 0.3, zIndex: 5, filter: "blur(1px)" },
  hiddenLeft: { x: -500, scale: 0.5, opacity: 0, zIndex: 0 },
  hiddenRight: { x: 500, scale: 0.5, opacity: 0, zIndex: 0 },
};

const App = () => {
  // --- ÉTATS BLOCKCHAIN ---
  const [blocks, setBlocks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBlock, setSelectedBlock] = useState(null);

  // --- ÉTATS SÉCURITÉ & WALLET ---
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("azerty");
  const [destinataire, setDestinataire] = useState("");
  const [montant, setMontant] = useState("");
  const [notification, setNotification] = useState("");

  // NOUVEAU : Solde du joueur et adresse de test
  const [solde, setSolde] = useState(0);
  const adresseTest = "bc1q9x3j7zwyt4d5g8p2m6vhkq9x3j7z"; // Fausse adresse pour tester

  // --- CHARGEMENT AUTOMATIQUE ---
  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await apiAffiche.getBlockChain();
        const javaBlocks = response.data;

        if (javaBlocks && javaBlocks.length > 0) {
          const formattedBlocks = javaBlocks.map((javaBlock, index) => {
            const header = javaBlock.blockHeader || javaBlock.BlockHeader;
            const body = javaBlock.blockBody || javaBlock.BlockBody;
            const txList = body?.transactionList || body?.TransactionList || [];

            return {
              index: index,
              hash: `BLOCK_HASH_N°${index}`,
              prevHash: header?.hashPre || header?.HashPre || "0000000000000000",
              merkleRoot: header?.merkleRoot || header?.MerkleRoot,
              timestamp: header?.timeStamp || header?.TimeStamp,
              nonce: header?.nonce || header?.Nonce,
              transactions: txList,
            };
          });

          setBlocks((prevBlocks) => {
            if (prevBlocks.length !== formattedBlocks.length) {
              setCurrentIndex(formattedBlocks.length - 1);
            }
            return formattedBlocks;
          });
        }
      } catch (error) {
        console.error("Erreur Backend", error);
      }
    };

    fetchBlockchain();
    const interval = setInterval(fetchBlockchain, 10000);
    return () => clearInterval(interval);
  }, []);

  // --- FONCTIONS WALLET & SÉCURITÉ ---
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await apiAffiche.login(username, password);
      setToken(res.data);
      afficherNotification("Connexion réussie !");
    } catch (err) {
      afficherNotification("Identifiants incorrects ❌");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setSolde(0); // On remet le solde à zéro à la déconnexion
    afficherNotification("Déconnexion réussie");
  };

  const handleAjouterFonds = () => {
    setSolde(solde + 50); // Ajoute 50 faux BTC
    afficherNotification("+ 50 BTC ajoutés (Mode Test)");
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(adresseTest);
    setDestinataire(adresseTest); // Colle l'adresse directement dans l'input !
    afficherNotification("Adresse copiée et collée !");
  };

  const handleSendTransaction = async (e) => {
    e.preventDefault();
    if (!destinataire || !montant) return;

    const montantNum = parseFloat(montant);

    // Vérification du solde !
    if (montantNum > solde) {
      afficherNotification("Fonds insuffisants ! ❌");
      return;
    }

    try {
      const res = await apiAffiche.creerTransaction(token, destinataire, montantNum);
      afficherNotification(res.data);
      setSolde(solde - montantNum); // On déduit l'argent du solde
      setDestinataire("");
      setMontant("");
    } catch (err) {
      afficherNotification("Erreur de transaction ❌");
    }
  };

  const afficherNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(""), 4000);
  };

  // --- NAVIGATION ---
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

        {/* 1. SIDEBAR : LE WALLET */}
        <aside className="w-1/4 border-r border-slate-700 bg-slate-800/50 p-6 flex flex-col z-20">
          <div className="flex items-center gap-3 mb-8 text-blue-400 font-black italic">
            <Wallet size={28} />
            <h2 className="text-2xl uppercase tracking-widest">Mon Wallet</h2>
          </div>

          {/* Espace de Notification */}
          <div className="h-12 mb-2">
            <AnimatePresence>
              {notification && (
                  <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="p-3 text-xs font-bold text-center bg-blue-600/20 text-blue-300 border border-blue-500/30 rounded-xl"
                  >
                    {notification}
                  </motion.div>
              )}
            </AnimatePresence>
          </div>

          {!token ? (
              // FORMULAIRE DE CONNEXION
              <form onSubmit={handleLogin} className="flex flex-col gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
                <h3 className="text-sm font-bold text-slate-400 flex items-center gap-2 mb-2 uppercase tracking-widest">
                  <Lock size={16}/> Authentification
                </h3>
                <input
                    className="bg-slate-800 p-3.5 rounded-xl border border-slate-600 text-sm outline-none focus:border-blue-500 transition-colors"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    className="bg-slate-800 p-3.5 rounded-xl border border-slate-600 text-sm outline-none focus:border-blue-500 transition-colors"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-xl font-black uppercase tracking-widest transition-all text-sm mt-2">
                  Connexion
                </button>
              </form>
          ) : (
              // ESPACE CONNECTÉ
              <div className="flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">

                {/* AFFICHAGE DU SOLDE */}
                <div className="bg-gradient-to-br from-blue-900 to-slate-800 border border-blue-500/30 p-5 rounded-2xl mb-4 shadow-lg text-center relative overflow-hidden">
                  <div className="text-[10px] text-blue-300 font-bold uppercase tracking-widest mb-1">Solde Disponible</div>
                  <div className="text-4xl font-black text-white">{solde.toFixed(2)} <span className="text-lg text-blue-400">BTC</span></div>

                  {/* BOUTON FAUCET */}
                  <button onClick={handleAjouterFonds} className="mt-4 w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 p-2 rounded-xl text-xs font-bold flex justify-center items-center gap-2 text-slate-300 transition-colors">
                    <PlusCircle size={14} className="text-green-400"/> Recevoir fonds (Testnet)
                  </button>
                </div>

                {/* AIDE : ADRESSE DE TEST */}
                <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl mb-6 flex flex-col gap-2">
                  <div className="text-[10px] text-yellow-500 font-bold uppercase">Adresse de test (Bob)</div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] font-mono text-slate-300 truncate bg-slate-900 p-2 rounded-lg flex-1">
                      {adresseTest}
                    </div>
                    <button onClick={handleCopyAddress} title="Copier et Coller" className="bg-yellow-600 hover:bg-yellow-500 p-2 rounded-lg text-white transition-colors">
                      <Copy size={14} />
                    </button>
                  </div>
                </div>

                {/* FORMULAIRE DE TRANSACTION */}
                <form onSubmit={handleSendTransaction} className="flex flex-col gap-4 bg-slate-900/50 p-6 rounded-2xl border border-slate-700 shadow-xl">
                  <h3 className="text-sm font-black text-blue-400 flex items-center gap-2 mb-2 uppercase tracking-widest">
                    <Send size={16}/> Envoyer
                  </h3>
                  <input
                      className="bg-slate-800 p-3.5 rounded-xl border border-slate-600 text-sm outline-none focus:border-blue-500 font-mono transition-colors"
                      placeholder="Adresse du destinataire"
                      value={destinataire}
                      onChange={(e) => setDestinataire(e.target.value)}
                  />
                  <div className="relative">
                    <input
                        type="number"
                        step="0.01"
                        className="w-full bg-slate-800 p-3.5 rounded-xl border border-slate-600 text-sm outline-none focus:border-blue-500 font-mono transition-colors"
                        placeholder="Montant"
                        value={montant}
                        onChange={(e) => setMontant(e.target.value)}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500">BTC</span>
                  </div>
                  <button type="submit" className="bg-blue-600 hover:bg-blue-500 p-3.5 rounded-xl font-black uppercase tracking-widest transition-all text-xs mt-2 flex justify-center items-center gap-2">
                    <Shield size={14} /> Signer & Envoyer
                  </button>
                </form>

                <button onClick={handleLogout} className="mt-6 mb-4 flex items-center justify-center gap-2 text-slate-500 hover:text-red-400 p-4 text-sm font-bold transition-colors">
                  <LogOut size={18}/> Se Déconnecter
                </button>
              </div>
          )}
        </aside>

        {/* 2. SECTION PRINCIPALE */}
        <main className="flex-1 flex flex-col items-center justify-center p-10 relative overflow-hidden">
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

            <div className="text-slate-500 text-sm flex items-center justify-center gap-2 animate-pulse mt-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div> Réception automatique des blocs activée...
            </div>
          </div>

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
                                <span className="text-[10px] font-mono text-blue-200/50">v1.2</span>
                              </motion.div>
                          )}
                        </motion.div>
                    );
                  })}
                </AnimatePresence>
            )}
          </div>

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

        {/* --- MODALE HEADER DU BLOC --- */}
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

                  {/* LISTE DES TRANSACTIONS */}
                  <div className="bg-blue-600/10 p-5 rounded-xl border border-blue-500/20">
                    <label className="text-[10px] text-blue-400 font-bold block mb-3 uppercase flex justify-between">
                      <span>Transactions ({selectedBlock.transactions.length})</span>
                    </label>

                    <div className="max-h-40 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                      {selectedBlock.transactions.map((tx, idx) => {
                        const sender = tx.expediteur || tx.Expediteur;
                        const receiver = tx.destinataire || tx.Destinataire;
                        const amount = tx.quantite || tx.Quantite;
                        const signature = tx.signatureTx || tx.SignatureTx;

                        return (
                            <div key={idx} className="flex flex-col bg-slate-900/80 p-3 rounded-lg border border-slate-700/50">
                              <div className="flex justify-between items-center mb-2">
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
                              {signature && (
                                  <div className="border-t border-slate-700/50 pt-2 mt-1">
                                    <span className="text-[8px] text-green-500 font-bold uppercase block mb-1">✓ Signature RSA Valide</span>
                                    <span className="text-[8px] font-mono text-slate-500 truncate block">{signature}</span>
                                  </div>
                              )}
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