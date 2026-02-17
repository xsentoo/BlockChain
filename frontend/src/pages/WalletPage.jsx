import React, { useState, useEffect, useCallback } from "react";
import {
  Wallet,
  Plus,
  Send,
  Shield,
  CheckCircle,
  XCircle,
  X,
  Copy,
  RefreshCw,
  Eye,
  CreditCard,
  ArrowUpRight,
  Key,
  FileSignature,
  ChevronDown,
  ChevronUp,
  Droplets,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { apiWallet } from "../api";

const WalletPage = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showSignSection, setShowSignSection] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState(null);
  const [toast, setToast] = useState(null);

  // Create wallet form
  const [newLabel, setNewLabel] = useState("");

  // Send funds form
  const [sendFrom, setSendFrom] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [sendAmount, setSendAmount] = useState("");
  const [sendFees, setSendFees] = useState("");

  // Sign form
  const [signAddress, setSignAddress] = useState("");
  const [signDestinataire, setSignDestinataire] = useState("");
  const [signQuantite, setSignQuantite] = useState("");
  const [signResult, setSignResult] = useState(null);

  // Verify form
  const [verifyPublicKey, setVerifyPublicKey] = useState("");
  const [verifyExpediteur, setVerifyExpediteur] = useState("");
  const [verifyDestinataire, setVerifyDestinataire] = useState("");
  const [verifyQuantite, setVerifyQuantite] = useState("");
  const [verifySignature, setVerifySignature] = useState("");
  const [verifyResult, setVerifyResult] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast("Copié dans le presse-papiers !");
  };

  // ========== FETCH WALLETS ==========
  const fetchWallets = useCallback(async () => {
    try {
      const res = await apiWallet.getAll();
      setWallets(res.data);
    } catch (err) {
      console.error("Fetch wallets error:", err);
    }
  }, []);

  useEffect(() => {
    fetchWallets();
  }, [fetchWallets]);

  // ========== CREATE WALLET ==========
  const handleCreateWallet = async () => {
    if (!newLabel.trim()) return showToast("Veuillez entrer un nom", "error");
    setLoading(true);
    try {
      await apiWallet.create(newLabel.trim());
      showToast(`Wallet "${newLabel}" créé avec succès !`);
      setNewLabel("");
      setShowCreateModal(false);
      await fetchWallets();
    } catch (err) {
      console.error("Erreur création wallet:", err);
      if (err.response) {
        // Le backend a répondu avec une erreur (4xx, 5xx)
        showToast(err.response.data?.error || `Erreur serveur: ${err.response.status}`, "error");
      } else if (err.request) {
        // La requête a été faite mais pas de réponse (Network Error)
        showToast("Impossible de contacter le serveur (Network Error). Vérifiez que le backend Java tourne sur le port 8080.", "error");
      } else {
        // Autre erreur
        showToast(err.message || "Erreur création wallet", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // ========== FAUCET ==========
  const handleFaucet = async (address) => {
    setLoading(true);
    try {
      const res = await apiWallet.faucet(address, 1.0);
      showToast(res.data.message || "1 BTC crédité !");
      await fetchWallets();
    } catch (err) {
      showToast(err.response?.data?.error || "Erreur faucet", "error");
    } finally {
      setLoading(false);
    }
  };

  // ========== SEND FUNDS ==========
  const handleSendFunds = async () => {
    if (!sendFrom || !sendTo || !sendAmount) {
      return showToast("Remplissez tous les champs", "error");
    }
    setLoading(true);
    try {
      const fees = sendFees ? parseFloat(sendFees) : 0;
      const res = await apiWallet.send(sendFrom, sendTo, parseFloat(sendAmount), fees);
      showToast(res.data.message || "Transaction ajoutée au mempool !");
      setSendFrom("");
      setSendTo("");
      setSendAmount("");
      setSendFees("");
      setShowSendModal(false);
      await fetchWallets();
    } catch (err) {
      showToast(err.response?.data?.error || "Erreur envoi de fonds", "error");
    } finally {
      setLoading(false);
    }
  };

  // ========== SIGN TRANSACTION ==========
  const handleSign = async () => {
    if (!signAddress || !signDestinataire || !signQuantite) {
      return showToast("Remplissez tous les champs", "error");
    }
    setLoading(true);
    try {
      const res = await apiWallet.sign(
        signAddress,
        signDestinataire,
        parseFloat(signQuantite)
      );
      setSignResult(res.data);
      showToast("Transaction signée avec succès !");
    } catch (err) {
      showToast(err.response?.data?.error || "Erreur signature", "error");
    } finally {
      setLoading(false);
    }
  };

  // ========== VERIFY SIGNATURE ==========
  const handleVerify = async () => {
    if (!verifyPublicKey || !verifyExpediteur || !verifyDestinataire || !verifyQuantite || !verifySignature) {
      return showToast("Remplissez tous les champs", "error");
    }
    setLoading(true);
    try {
      const res = await apiWallet.verify(
        verifyPublicKey,
        verifyExpediteur,
        verifyDestinataire,
        parseFloat(verifyQuantite),
        verifySignature
      );
      setVerifyResult(res.data.valide);
      showToast(res.data.valide ? "Signature valide ✓" : "Signature invalide ✗", res.data.valide ? "success" : "error");
    } catch (err) {
      showToast(err.response?.data?.error || "Erreur vérification", "error");
    } finally {
      setLoading(false);
    }
  };

  // ========== TRUNCATE HELPER ==========
  const truncate = (str, len = 12) => {
    if (!str) return "";
    if (str.length <= len * 2) return str;
    return str.substring(0, len) + "..." + str.substring(str.length - len);
  };

  return (
    <div className="page-container">
      {/* ========== HEADER ========== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "2rem",
        }}
      >
        <div className="page-header" style={{ marginBottom: 0 }}>
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "var(--radius-md)",
              background: "var(--gradient-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 20px rgba(99, 102, 241, 0.3)",
            }}
          >
            <Wallet size={22} color="white" />
          </div>
          <h1 className="page-title">Wallet Manager</h1>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            className="btn-secondary"
            onClick={() => fetchWallets()}
          >
            <RefreshCw size={14} /> Refresh
          </button>
          <button
            className="btn-primary"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus size={16} /> Nouveau Wallet
          </button>
          <button
            className="btn-success"
            onClick={() => setShowSendModal(true)}
          >
            <Send size={16} /> Envoyer
          </button>
        </div>
      </div>

      {/* ========== STATS ROW ========== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div className="stat-card">
          <span className="stat-label">Total Wallets</span>
          <span
            className="stat-value"
            style={{
              background: "var(--gradient-primary)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {wallets.length}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Balance Totale</span>
          <span
            className="stat-value"
            style={{ color: "var(--accent-green)" }}
          >
            {wallets.reduce((acc, w) => acc + (w.balance || 0), 0).toFixed(4)}{" "}
            <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>BTC</span>
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Cryptographie</span>
          <span className="stat-value" style={{ fontSize: "1rem", color: "var(--accent-purple)" }}>
            ECDSA secp256r1
          </span>
        </div>
      </div>

      {/* ========== WALLET CARDS ========== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <AnimatePresence>
          {wallets.map((wallet, idx) => (
            <motion.div
              key={wallet.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: idx * 0.05 }}
              className="glass-card"
              style={{
                padding: "1.5rem",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              onClick={() =>
                setSelectedWallet(
                  selectedWallet?.address === wallet.address ? null : wallet
                )
              }
            >
              {/* Gradient accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "3px",
                  background: "var(--gradient-primary)",
                  borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
                }}
              />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "var(--radius-sm)",
                      background: `hsl(${(idx * 47) % 360}, 70%, 55%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 4px 12px hsla(${(idx * 47) % 360}, 70%, 55%, 0.3)`,
                    }}
                  >
                    <CreditCard size={18} color="white" />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {wallet.label || "Wallet"}
                    </div>
                    <div
                      className="mono"
                      style={{
                        fontSize: "0.6rem",
                        color: "var(--text-muted)",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.35rem",
                      }}
                    >
                      {truncate(wallet.address, 10)}
                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(wallet.address);
                        }}
                        style={{ cursor: "pointer", color: "var(--accent-blue-light)" }}
                      >
                        <Copy size={10} />
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div
                    style={{
                      fontSize: "1.35rem",
                      fontWeight: 900,
                      color: "var(--accent-green)",
                    }}
                  >
                    {(wallet.balance || 0).toFixed(4)}
                  </div>
                  <span
                    style={{
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      color: "var(--text-muted)",
                      textTransform: "uppercase",
                    }}
                  >
                    BTC
                  </span>
                </div>
              </div>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedWallet?.address === wallet.address && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: "hidden" }}
                  >
                    <div
                      style={{
                        borderTop: "1px solid var(--glass-border)",
                        paddingTop: "1rem",
                        marginTop: "0.5rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.75rem",
                      }}
                    >
                      <div>
                        <span className="input-label">Adresse complète</span>
                        <div
                          className="mono"
                          style={{
                            fontSize: "0.65rem",
                            wordBreak: "break-all",
                            color: "var(--text-secondary)",
                            background: "rgba(10,14,26,0.5)",
                            padding: "0.65rem",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--glass-border)",
                          }}
                        >
                          {wallet.address}
                        </div>
                      </div>
                      <div>
                        <span className="input-label">
                          <Key size={10} style={{ display: "inline", marginRight: "0.3rem", verticalAlign: "middle" }} />
                          Clé publique
                        </span>
                        <div
                          className="mono"
                          style={{
                            fontSize: "0.55rem",
                            wordBreak: "break-all",
                            color: "var(--text-muted)",
                            background: "rgba(10,14,26,0.5)",
                            padding: "0.65rem",
                            borderRadius: "var(--radius-sm)",
                            border: "1px solid var(--glass-border)",
                            maxHeight: "60px",
                            overflowY: "auto",
                          }}
                        >
                          {wallet.publicKey}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, fontSize: "0.7rem", padding: "0.5rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(wallet.publicKey);
                          }}
                        >
                          <Copy size={12} /> Copier Clé Pub
                        </button>
                        <button
                          className="btn-secondary"
                          style={{ flex: 1, fontSize: "0.7rem", padding: "0.5rem" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSendFrom(wallet.address);
                            setShowSendModal(true);
                          }}
                        >
                          <ArrowUpRight size={12} /> Envoyer
                        </button>
                        <button
                          className="btn-secondary"
                          style={{
                            flex: 1,
                            fontSize: "0.7rem",
                            padding: "0.5rem",
                            background: "rgba(249, 115, 22, 0.1)",
                            borderColor: "rgba(249, 115, 22, 0.3)",
                            color: "var(--accent-orange)",
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFaucet(wallet.address);
                          }}
                        >
                          <Droplets size={12} /> Faucet +1 BTC
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state */}
        {wallets.length === 0 && (
          <div
            style={{
              gridColumn: "1 / -1",
              textAlign: "center",
              padding: "4rem 2rem",
              color: "var(--text-muted)",
            }}
          >
            <Wallet
              size={48}
              style={{ margin: "0 auto 1rem", opacity: 0.3 }}
            />
            <p style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "0.5rem" }}>
              Aucun wallet créé
            </p>
            <p style={{ fontSize: "0.85rem", marginBottom: "1.25rem" }}>
              Créez votre premier wallet pour commencer
            </p>
            <button
              className="btn-primary"
              onClick={() => setShowCreateModal(true)}
            >
              <Plus size={16} /> Créer un Wallet
            </button>
          </div>
        )}
      </div>

      {/* ========== SIGN & VERIFY SECTION ========== */}
      <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "2rem" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
          }}
          onClick={() => setShowSignSection(!showSignSection)}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "var(--radius-sm)",
                background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FileSignature size={18} color="white" />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                }}
              >
                Signer & Vérifier
              </h3>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Signature ECDSA (SHA256withECDSA)
              </span>
            </div>
          </div>
          {showSignSection ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>

        <AnimatePresence>
          {showSignSection && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              style={{ overflow: "hidden" }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginTop: "1.5rem",
                  borderTop: "1px solid var(--glass-border)",
                  paddingTop: "1.5rem",
                }}
              >
                {/* SIGN */}
                <div>
                  <h4
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: "var(--accent-purple)",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <Shield size={16} /> Signer une Transaction
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <label className="input-label">Adresse expéditeur</label>
                      <select
                        className="input-field"
                        value={signAddress}
                        onChange={(e) => setSignAddress(e.target.value)}
                        style={{ cursor: "pointer" }}
                      >
                        <option value="">Sélectionner un wallet...</option>
                        {wallets.map((w) => (
                          <option key={w.address} value={w.address}>
                            {w.label} ({truncate(w.address, 8)})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="input-label">Adresse destinataire</label>
                      <input
                        className="input-field"
                        type="text"
                        placeholder="Adresse du destinataire"
                        value={signDestinataire}
                        onChange={(e) => setSignDestinataire(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">Quantité (BTC)</label>
                      <input
                        className="input-field"
                        type="number"
                        step="0.0001"
                        min="0"
                        placeholder="0.0000"
                        value={signQuantite}
                        onChange={(e) => setSignQuantite(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn-primary"
                      onClick={handleSign}
                      disabled={loading}
                      style={{ width: "100%" }}
                    >
                      <Shield size={14} />
                      {loading ? "Signature..." : "Signer"}
                    </button>

                    {/* Sign Result */}
                    {signResult && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: "rgba(16, 185, 129, 0.08)",
                          border: "1px solid rgba(16, 185, 129, 0.25)",
                          borderRadius: "var(--radius-md)",
                          padding: "1rem",
                        }}
                      >
                        <span className="input-label" style={{ color: "var(--accent-green)" }}>
                          Signature générée
                        </span>
                        <div
                          className="mono"
                          style={{
                            fontSize: "0.55rem",
                            wordBreak: "break-all",
                            color: "var(--text-secondary)",
                            marginBottom: "0.5rem",
                          }}
                        >
                          {signResult.signature}
                        </div>
                        <button
                          className="btn-secondary"
                          style={{ fontSize: "0.7rem", padding: "0.4rem 0.8rem" }}
                          onClick={() => copyToClipboard(signResult.signature)}
                        >
                          <Copy size={11} /> Copier
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* VERIFY */}
                <div>
                  <h4
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: "var(--accent-cyan)",
                      marginBottom: "1rem",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <CheckCircle size={16} /> Vérifier une Signature
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    <div>
                      <label className="input-label">Clé publique</label>
                      <input
                        className="input-field"
                        type="text"
                        placeholder="Clé publique en hex"
                        value={verifyPublicKey}
                        onChange={(e) => setVerifyPublicKey(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">Expéditeur</label>
                      <input
                        className="input-field"
                        type="text"
                        placeholder="Adresse expéditeur"
                        value={verifyExpediteur}
                        onChange={(e) => setVerifyExpediteur(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">Destinataire</label>
                      <input
                        className="input-field"
                        type="text"
                        placeholder="Adresse destinataire"
                        value={verifyDestinataire}
                        onChange={(e) => setVerifyDestinataire(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">Quantité (BTC)</label>
                      <input
                        className="input-field"
                        type="number"
                        step="0.0001"
                        min="0"
                        placeholder="0.0000"
                        value={verifyQuantite}
                        onChange={(e) => setVerifyQuantite(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="input-label">Signature</label>
                      <input
                        className="input-field"
                        type="text"
                        placeholder="Signature en hex"
                        value={verifySignature}
                        onChange={(e) => setVerifySignature(e.target.value)}
                      />
                    </div>
                    <button
                      className="btn-primary"
                      onClick={handleVerify}
                      disabled={loading}
                      style={{
                        width: "100%",
                        background: "linear-gradient(135deg, #22d3ee 0%, #6366f1 100%)",
                      }}
                    >
                      <CheckCircle size={14} />
                      {loading ? "Vérification..." : "Vérifier"}
                    </button>

                    {/* Verify Result */}
                    {verifyResult !== null && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: verifyResult
                            ? "rgba(16, 185, 129, 0.08)"
                            : "rgba(239, 68, 68, 0.08)",
                          border: `1px solid ${verifyResult ? "rgba(16, 185, 129, 0.25)" : "rgba(239, 68, 68, 0.25)"}`,
                          borderRadius: "var(--radius-md)",
                          padding: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem",
                        }}
                      >
                        {verifyResult ? (
                          <>
                            <CheckCircle size={22} style={{ color: "var(--accent-green)" }} />
                            <span style={{ fontWeight: 700, color: "var(--accent-green)" }}>
                              Signature valide ✓
                            </span>
                          </>
                        ) : (
                          <>
                            <XCircle size={22} style={{ color: "var(--accent-red)" }} />
                            <span style={{ fontWeight: 700, color: "var(--accent-red)" }}>
                              Signature invalide ✗
                            </span>
                          </>
                        )}
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========== CREATE WALLET MODAL ========== */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="modal-content"
              style={{ maxWidth: "440px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--gradient-primary)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Plus size={20} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 900,
                    background: "var(--gradient-primary)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Nouveau Wallet
                </h3>
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label className="input-label">Nom du wallet</label>
                <input
                  className="input-field"
                  type="text"
                  placeholder="Ex: Mon Wallet Principal"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleCreateWallet()}
                  autoFocus
                />
              </div>

              <div
                style={{
                  background: "rgba(99, 102, 241, 0.05)",
                  border: "1px solid rgba(99, 102, 241, 0.15)",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  marginBottom: "1.5rem",
                  fontSize: "0.75rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.5,
                }}
              >
                🔐 Une paire de clés ECDSA (secp256r1) sera générée automatiquement.
                La clé privée est stockée de manière sécurisée côté serveur.
              </div>

              <button
                className="btn-primary"
                onClick={handleCreateWallet}
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Plus size={14} />}
                {loading ? "Création..." : "Créer le Wallet"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== SEND FUNDS MODAL ========== */}
      <AnimatePresence>
        {showSendModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowSendModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9 }}
              className="modal-content"
              style={{ maxWidth: "480px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowSendModal(false)}
                style={{
                  position: "absolute",
                  top: "1.25rem",
                  right: "1.25rem",
                  background: "none",
                  border: "none",
                  color: "var(--text-muted)",
                  cursor: "pointer",
                }}
              >
                <X size={20} />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.75rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "var(--radius-md)",
                    background: "var(--gradient-success)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Send size={20} color="white" />
                </div>
                <h3
                  style={{
                    fontSize: "1.15rem",
                    fontWeight: 900,
                    background: "var(--gradient-success)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Envoyer des Fonds
                </h3>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
                <div>
                  <label className="input-label">De (expéditeur)</label>
                  <select
                    className="input-field"
                    value={sendFrom}
                    onChange={(e) => setSendFrom(e.target.value)}
                    style={{ cursor: "pointer" }}
                  >
                    <option value="">Sélectionner un wallet...</option>
                    {wallets.map((w) => (
                      <option key={w.address} value={w.address}>
                        {w.label} — {(w.balance || 0).toFixed(4)} BTC ({truncate(w.address, 6)})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">À (destinataire)</label>
                  <input
                    className="input-field"
                    type="text"
                    placeholder="Adresse du destinataire"
                    value={sendTo}
                    onChange={(e) => setSendTo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Montant (BTC)</label>
                  <input
                    className="input-field"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0000"
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                </div>
                <div>
                  <label className="input-label">Fees (BTC) — optionnel</label>
                  <input
                    className="input-field"
                    type="number"
                    step="0.0001"
                    min="0"
                    placeholder="0.0001"
                    value={sendFees}
                    onChange={(e) => setSendFees(e.target.value)}
                  />
                </div>
              </div>

              <button
                className="btn-success"
                onClick={handleSendFunds}
                disabled={loading}
                style={{ width: "100%" }}
              >
                {loading ? <RefreshCw size={14} className="animate-spin" /> : <Send size={14} />}
                {loading ? "Envoi en cours..." : "Envoyer la Transaction"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== TOAST ========== */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}
          >
            {toast.type === "error" ? <XCircle size={16} /> : <CheckCircle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WalletPage;
