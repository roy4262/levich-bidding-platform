import React, { useState, useEffect } from "react";
import ItemCard from "./ItemCard";
import { useSocket } from "../hooks/useSocket";

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const {
    isConnected,
    socketId,
    serverTimeOffset,
    sendMessage,
    registerListener,
  } = useSocket();
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initial fetch of items via REST API
    fetch(`${import.meta.env.VITE_API_URL}/items`)
      .then((res) => res.json())
      .then((data) => setItems(data))
      .catch((err) => console.error("Error fetching items:", err));

    // Register socket listeners
    const unregisterUpdate = registerListener("UPDATE_BID", (updatedItem) => {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === updatedItem.id ? updatedItem : item,
        ),
      );
    });

    const unregisterRejected = registerListener("BID_REJECTED", (data) => {
      setError(`Bid rejected for item ${data.itemId}: ${data.error}`);
      setTimeout(() => setError(null), 3000);
    });

    return () => {
      unregisterUpdate();
      unregisterRejected();
    };
  }, [registerListener]);

  const handleBid = (itemId, bidAmount) => {
    sendMessage("BID_PLACED", { itemId, bidAmount });
  };

  return (
    <div className="dashboard">
      <nav className="glass-nav">
        <div className="nav-content">
          <div className="brand">
            <div className="brand-logo">
              <div className="logo-inner"></div>
            </div>
            <span className="brand-name">LEVICH</span>
          </div>
          <div className="nav-actions">
            <div
              className={`connection-status ${isConnected ? "online" : "offline"}`}
            >
              <div className="status-indicator">
                <div className="status-ring"></div>
                <div className="status-core"></div>
              </div>
              <span>{isConnected ? "LIVE" : "OFFLINE"}</span>
            </div>
          </div>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            TRUST THE <span className="text-gradient">CLOCK</span>
            <br />
            TRUST THE BID
          </h1>

          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-value">{items.length}</span>
              <span className="stat-label">ACTIVE LOTS</span>
            </div>

            <div className="stat-divider"></div>

            <div className="stat-item">
              <span className="stat-value">0.1ms</span>
              <span className="stat-label">LATENCY</span>
            </div>
          </div>
        </div>
      </header>

      {error && (
        <div className="error-toast-container">
          <div className="error-toast">{error}</div>
        </div>
      )}

      <main className="container">
        <div className="grid-container">
          <div className="item-grid">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                serverTimeOffset={serverTimeOffset}
                onBid={handleBid}
                socketId={socketId}
              />
            ))}
          </div>
        </div>
      </main>

      <style jsx>{`
        .dashboard {
          min-height: 100vh;
          padding-bottom: 120px;
        }

        .glass-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 80px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 1000;
        }

        .nav-content {
          max-width: 1600px;
          margin: 0 auto;
          height: 100%;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 40px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-logo {
          width: 32px;
          height: 32px;
          background: #fff;
          padding: 6px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .logo-inner {
          width: 100%;
          height: 100%;
          background: #000;
          clip-path: polygon(50% 0%, 100% 100%, 0% 100%);
        }

        .brand-name {
          font-family: "Space Grotesk", sans-serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.3em;
          color: #fff;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 32px;
        }

        .user-id {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }

        .id-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.1em;
          font-weight: 700;
        }

        .id-value {
          font-family: "Space Grotesk", monospace;
          font-size: 14px;
          color: #fff;
          font-weight: 600;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.1em;
          padding: 8px 16px;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .status-indicator {
          position: relative;
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-core {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
        }

        .status-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 1px solid currentColor;
          opacity: 0.3;
        }

        .online {
          color: #22c55e;
        }
        .online .status-ring {
          animation: pulse-out 2s infinite;
        }
        .offline {
          color: #f43f5e;
        }

        @keyframes pulse-out {
          0% {
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }

        .hero-section {
          padding-top: 180px;
          padding-bottom: 100px;
          text-align: center;
          position: relative;
        }

        .hero-title {
          font-size: 6rem;
          line-height: 0.9;
          margin-bottom: 40px;
          letter-spacing: -0.04em;
        }

        .hero-stats {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 48px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-value {
          font-family: "Space Grotesk", sans-serif;
          font-size: 2rem;
          font-weight: 700;
          color: #fff;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.4);
          letter-spacing: 0.2em;
          font-weight: 800;
        }

        .stat-divider {
          width: 1px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
        }

        .container {
          max-width: 1600px;
          margin: 0 auto;
          padding: 0 40px;
        }

        .grid-container {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          padding: 60px;
        }

        .item-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 32px;
        }

        .error-toast-container {
          position: fixed;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2000;
        }

        .error-toast {
          background: #f43f5e;
          color: white;
          padding: 16px 32px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 14px;
          box-shadow: 0 20px 40px rgba(244, 63, 94, 0.3);
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @media (max-width: 1024px) {
          .hero-title {
            font-size: 4rem;
          }
          .item-grid {
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          }
          .grid-container {
            padding: 40px;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: 3rem;
          }
          .hero-stats {
            gap: 24px;
          }
          .nav-content {
            padding: 0 20px;
          }
          .container {
            padding: 0 20px;
          }
          .grid-container {
            padding: 20px;
            border-radius: 20px;
          }
          .item-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
