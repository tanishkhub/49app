import React, { useEffect, useRef, useState } from 'react';
import './VisitorCounter.css';

const VisitorCounter = () => {
  const [ip, setIp] = useState('0.0.0.0');
  const [total, setTotal] = useState(0);
  const [unique, setUnique] = useState(0);
  const hasRun = useRef(false);
  const [flipKey, setFlipKey] = useState(0);

  const fetchIP = async () => {
    try {
      const res = await fetch('https://api64.ipify.org?format=json');
      const data = await res.json();
      setIp(data.ip);
      return data.ip;
    } catch (err) {
      return '0.0.0.0';
    }
  };

  const updateVisitorStats = async (clientIp) => {
    try {
      await fetch(`${process.env.REACT_APP_BASE_URL}/visitors/updatevisitors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientIp, increment: true }),
      });

      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/visitors/fetchvisitors`);
      const data = await res.json();
      setTotal(data.totalVisits || 0);
      setUnique(data.uniqueVisitors || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    (async () => {
      const clientIp = await fetchIP();
      updateVisitorStats(clientIp);
    })();

    const interval = setInterval(() => {
      setFlipKey((k) => k + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="vc-container">
      <Stat label="Total Visits" value={total} flipKey={flipKey} />
      <Stat label="No of Visitors" value={unique} flipKey={flipKey + 1} />
    </div>
  );
};

const Stat = ({ label, value, flipKey }) => (
  <div className="vc-stat">
    <div className="vc-label">{label}</div>
    <div className="vc-flip-wrapper" key={flipKey}>
      <div className="vc-flip-inner">
        <div className="vc-number">{value}</div>
      </div>
    </div>
  </div>
);

export default VisitorCounter;
