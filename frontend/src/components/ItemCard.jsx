import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';

const ItemCard = ({ item, serverTimeOffset, onBid, socketId }) => {
  const { timeLeft, formattedTime } = useTimer(item.auctionEndTime, serverTimeOffset);
  const [flash, setFlash] = useState(false);
  const [priceFlash, setPriceFlash] = useState(null); // 'green' or 'red'
  const [hasUserBid, setHasUserBid] = useState(false);
  const prevBidRef = useRef(item.currentBid);
  const prevHighestBidderRef = useRef(item.highestBidder);

  const isWinning = item.highestBidder === socketId;
  const isExpired = timeLeft <= 0;

  useEffect(() => {
    if (isWinning) {
      setHasUserBid(true);
    }
  }, [isWinning]);

  useEffect(() => {
    if (item.currentBid > prevBidRef.current) {
      // Determine if we were outbid
      const wasWinning = prevHighestBidderRef.current === socketId;
      const nowOutbid = wasWinning && !isWinning;

      setFlash(true);
      setPriceFlash(nowOutbid ? 'red' : 'green');
      
      const timer = setTimeout(() => {
        setFlash(false);
        setPriceFlash(null);
      }, 1000);
      
      prevBidRef.current = item.currentBid;
      prevHighestBidderRef.current = item.highestBidder;
      return () => clearTimeout(timer);
    }
  }, [item.currentBid, item.highestBidder, socketId, isWinning]);

  const handleBid = () => {
    if (!isExpired) {
      setHasUserBid(true);
      onBid(item.id, item.currentBid + 10);
    }
  };

  return (
    <div className={`item-card ${flash ? 'flash-animation' : ''} ${isWinning ? 'is-winning' : ''} ${!isWinning && hasUserBid && item.highestBidder && !isExpired ? 'is-outbid' : ''}`}>
      <div className="card-top">
        <div className="item-header">
          <div className="id-tag">LOT #{item.id.padStart(3, '0')}</div>
          <h3 className="item-title">{item.title}</h3>
        </div>
        <div className={`timer-display ${timeLeft < 30000 ? 'urgent' : ''}`}>
          <div className="timer-ring">
            <svg viewBox="0 0 36 36" className="circular-chart">
              <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="circle" strokeDasharray={`${Math.max(0, (timeLeft / (300000 * (item.id % 5 + 1))) * 100)}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
            <span className="time-val">{formattedTime}</span>
          </div>
        </div>
      </div>
      
      <div className="card-mid">
        <div className="price-wrapper">
          <div className="price-label-row">
            <span className="label">CURRENT VALUATION</span>
            <div className="status-badges">
              {isWinning && <div className="status-pill winning">WINNING</div>}
              {!isWinning && hasUserBid && item.highestBidder && !isExpired && <div className="status-pill outbid">OUTBID</div>}
              {isExpired && <div className="status-pill expired">ENDED</div>}
            </div>
          </div>
          <div className={`price-main ${priceFlash ? `flash-${priceFlash}` : ''}`}>
            <span className="currency">$</span>
            {item.currentBid.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="card-bottom">
        <button 
          onClick={handleBid} 
          disabled={isExpired || isWinning}
          className={`bid-action-btn ${isWinning ? 'is-leading' : ''}`}
        >
          <span className="btn-label">{isExpired ? 'AUCTION CLOSED' : isWinning ? 'CURRENT HIGHEST' : `BID +$10`}</span>
          {!isExpired && !isWinning && <span className="btn-subtext">CLICK TO SECURE POSITION</span>}
        </button>
      </div>

      <style jsx>{`
        .item-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 24px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }

        .item-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 0;
          background: #6366f1;
          transition: height 0.4s ease;
        }

        .item-card:hover {
          transform: translateY(-8px);
          background: rgba(255, 255, 255, 0.07);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .item-card.is-winning { border-color: rgba(34, 197, 94, 0.3); }
        .item-card.is-winning::before { height: 100%; background: #22c55e; }
        .item-card.is-outbid { border-color: rgba(244, 63, 94, 0.3); }
        .item-card.is-outbid::before { height: 100%; background: #f43f5e; }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
        }

        .id-tag {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.3);
          letter-spacing: 0.2em;
          margin-bottom: 8px;
        }

        .item-title {
          font-size: 1.5rem;
          max-width: 200px;
          line-height: 1.2;
          color: #fff;
        }

        .timer-ring {
          position: relative;
          width: 70px;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .circular-chart {
          position: absolute;
          width: 100%;
          height: 100%;
          transform: rotate(-90deg);
        }

        .circle-bg {
          fill: none;
          stroke: rgba(255, 255, 255, 0.05);
          stroke-width: 2.5;
        }

        .circle {
          fill: none;
          stroke: #6366f1;
          stroke-width: 2.5;
          stroke-linecap: round;
          transition: stroke-dasharray 0.3s ease;
        }

        .urgent .circle { stroke: #f43f5e; }

        .time-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
        }

        .price-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .label {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.15em;
          color: rgba(255, 255, 255, 0.4);
        }

        .status-pill {
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 0.1em;
        }

        .status-pill.winning { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
        .status-pill.outbid { background: rgba(244, 63, 94, 0.15); color: #f87171; }
        .status-pill.expired { background: rgba(255, 255, 255, 0.1); color: #94a3b8; }

        .price-main {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 3.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
          display: flex;
          align-items: baseline;
          gap: 4px;
          transition: all 0.3s ease;
        }

        .currency { font-size: 1.5rem; opacity: 0.4; font-weight: 400; }

        .flash-green { color: #4ade80; animation: bounce 0.5s ease; }
        .flash-red { color: #f87171; animation: shake 0.5s ease; }

        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }

        .bid-action-btn {
          width: 100%;
          padding: 20px;
          border-radius: 16px;
          background: #fff;
          color: #000;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          transition: all 0.3s ease;
        }

        .bid-action-btn:hover:not(:disabled) {
          background: #f0f0f0;
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(255, 255, 255, 0.1);
        }

        .bid-action-btn.is-leading {
          background: rgba(255, 255, 255, 0.05);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .btn-label { font-size: 14px; font-weight: 800; letter-spacing: 0.05em; }
        .btn-subtext { font-size: 9px; opacity: 0.5; font-weight: 600; }

        @keyframes flash-animation {
          0% { background: rgba(255, 255, 255, 0.05); }
          50% { background: rgba(99, 102, 241, 0.1); }
          100% { background: rgba(255, 255, 255, 0.05); }
        }
      `}</style>
    </div>
  );
};

export default ItemCard;
