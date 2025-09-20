// src/components/TabsWithSwipe.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome,
  FaMapMarkerAlt,
  FaClipboardList,
  FaBullhorn,
  FaUsers,
  FaCalendarAlt,
  FaNewspaper,
} from "react-icons/fa";

// Import your components
import IncidentReports from "./IncidentReports";
import IncidentMap from "./IncidentMap";
import Ads from "./Ads";
import CommunityConnect from "./CommunityConnect";
import NewsUpdate from "./NewsUpdate";
import LocalEventsAndBusiness from "./LocalEventsBusiness";

// Tabs configuration
const tabs = [
  { name: "Home", icon: <FaHome />, component: <div>Welcome Home!</div> },
  { name: "Map", icon: <FaMapMarkerAlt />, component: <IncidentMap /> },
  { name: "Incidents", icon: <FaClipboardList />, component: <IncidentReports /> },
  { name: "Ads", icon: <FaBullhorn />, component: <Ads /> },
  { name: "Community", icon: <FaUsers />, component: <CommunityConnect /> },
  { name: "Events", icon: <FaCalendarAlt />, component: <LocalEventsAndBusiness /> },
  { name: "News", icon: <FaNewspaper />, component: <NewsUpdate /> },
];

// Framer Motion variants for swipe animation
const tabVariants = {
  enter: (direction) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

export default function TabsWithSwipe({ user }) {
  const [activeTab, setActiveTab] = useState(0);
  const [direction, setDirection] = useState(0);

  const goToTab = (index) => {
    setDirection(index > activeTab ? 1 : -1);
    setActiveTab(index);
  };

  const goToNextTab = () => {
    setDirection(1);
    setActiveTab((prev) => (prev + 1) % tabs.length);
  };

  const goToPrevTab = () => {
    setDirection(-1);
    setActiveTab((prev) => (prev - 1 + tabs.length) % tabs.length);
  };

  const handleDragEnd = (event, info) => {
    if (info.offset.x > 100) goToPrevTab();
    else if (info.offset.x < -100) goToNextTab();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Tab Content */}
      <div style={{ flex: 1, overflow: "hidden", padding: "10px" }}>
        <AnimatePresence custom={direction} exitBeforeEnter>
          <motion.div
            key={activeTab}
            custom={direction}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ height: "100%" }}
          >
            {tabs[activeTab].component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          padding: "10px 0",
          borderTop: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => goToTab(index)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              background: "none",
              border: "none",
              color: activeTab === index ? "#311eff" : "#888",
              fontWeight: activeTab === index ? "bold" : "normal",
              cursor: "pointer",
            }}
          >
            {tab.icon}
            <span style={{ fontSize: "12px", marginTop: "4px" }}>{tab.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
