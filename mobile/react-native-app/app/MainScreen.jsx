import React, { useState } from 'react';
import Home from './Home';
import CreateReportView from './CreateReportView';

const MainScreen = () => {
  const [popupVisible, setPopupVisible] = useState(false);

  return (
    <>
      <Home onOpenReport={() => setPopupVisible(true)} />
      {popupVisible && (
        <CreateReportView
          onClose={() => setPopupVisible(false)}
        />
      )}
    </>
  );
};

export default MainScreen;
