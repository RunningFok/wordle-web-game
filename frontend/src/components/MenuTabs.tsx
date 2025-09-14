import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuContent } from './MenuContent';

export type TabType = 'classic' | 'speed' | 'rules';

export interface Tab {
  id: TabType;
  label: string;
}

export interface MenuTabsProps {
  className?: string;
}

export const MenuTabs: React.FC<MenuTabsProps> = ({
  className = '',
}) => {
  const tabs = [
    { id: 'classic' as TabType, label: 'Classic Mode' },
    { id: 'speed' as TabType, label: 'Speed Mode' },
    { id: 'rules' as TabType, label: 'How to Play Wordle' },
  ];
  
  const [activeTab, setActiveTab] = useState<TabType>('classic');

  const handleTabClick = (tabId: TabType) => {
    setActiveTab(tabId);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'classic':
        return  <MenuContent mode="classic" />
      case 'speed':
        return <MenuContent mode="speed" />
      case 'rules':
        return <MenuContent mode="rules" />
      default:
        return null;
    }
  };

  return (
    <div className={`tabs-container ${className}`}>
      <div className="tabs-header">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            data-tab={tab.id}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                className="tab-indicator"
                data-tab={tab.id}
                layoutId="activeTab"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>
      
      <div className="tab-content">
        <AnimatePresence mode="wait">
          {renderTabContent()}
        </AnimatePresence>
      </div>
    </div>
  );
};
