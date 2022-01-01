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
    <div className="header clearfix">
      <h1 style={{float: "left"}}>Rhodes Island Headhunting Analytics</h1>
      <div style={{float: "right"}}>
        <button onClick={ params.goToAnalytics }>Analytics</button>
        <button onClick={ params.goToData }>Data</button>
        <button onClick={ params.goToAbout }>About</button>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      Footer stuff
    </div>
  );
}

function AboutPage () {
  return (
    <div className="content">
      <h2>About</h2>
      This website is intended for analyzing and visualizing data for headhunting in Arknights video game by Hypergryph/Yostar.
      <h2>Attributions</h2>
      This project would not have been possible without:
      <ul>
        <li><a href="#">Aceship</a> for in-game assets.</li>
        <li><a href="https://github.com/Kengxxiao/ArknightsGameData">Kengxxiao</a> for game data.</li>
        <li><a href="https://gamepress.gg/arknights/">GamePress.com</a> for historical banner information.</li>
        <li><a href="https://www.ag-grid.com/">AG Grid</a> for Javascript grid and charts.</li>
      </ul>
      <h2>Fair Use Disclaimer</h2>
      <p>
        This site and the content made available through this site are for educational and informational purposes only.
      </p>
      <p>
        The site may contain copyrighted material owned by a third party, the use of which has not always been specifically authorized by the copyright owner.<br />
        Notwithstanding a copyright owner’s rights under the Copyright Act, Section 107 of the Copyright Act allows limited use of copyrighted material without requiring permission from the rights holders, for purposes such as education, criticism, comment, news reporting, teaching, scholarship, and research. <br />
        These so-called “fair uses” are permitted even if the use of the work would otherwise be infringing.
      </p>
      <p>
        If you wish to use copyrighted material published on this site for your own purposes that go beyond fair use, you must obtain permission from the copyright owner.
      </p>
      <p>
        If you believe that any content or postings on this site violates your intellectual property or other rights, please send me an email at 1f35c@tuta.io.
      </p>
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
