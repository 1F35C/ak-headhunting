import React from 'react';
import { useEffect, useState } from 'react';
import { AnalyticsPage } from './Analytics';
import { DataTablePage } from './DataTable';
import './App.css';

type NavBarParams = {
  goToAnalytics: () => void
  goToData: () => void
  goToAbout: () => void
};

function NavBar (params: NavBarParams) {
  return (
    <div>
      <h1>Rhodes Island Headhunting Analytics</h1>
      <button onClick={ params.goToAnalytics }>Analytics</button>
      <button onClick={ params.goToData }>Data</button>
      <button onClick={ params.goToAbout }>About</button>
    </div>
  );
}

function Footer() {
  return (
    <div>
      Footer stuff
    </div>
  );
}

function AboutPage () {
  return (
    <div className="content">
      About
    </div>
  );
}

function getTabContent(tab: number) {
  switch(tab) {
    case 0:
      return (
        <AnalyticsPage />
      );
      break;
    case 1:
      return (
        <DataTablePage />
      );
      break;
    case 2:
      return (
        <AboutPage />
      );
      break;
  }
}

function App() {
  const [tab, setTab] = useState(0);
  
  return (
    <div>
      <NavBar goToAnalytics={ () => setTab(0) }
              goToData={ () => setTab(1) } 
              goToAbout={ () => setTab(2) } />
      { getTabContent(tab) }
      <Footer />
    </div>
  );
}

export default App;
