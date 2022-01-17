import React from 'react';
import { useEffect, useState } from 'react';
import { HomePage } from './Home';
import { AnalyticsPage } from './Analytics';
import { DataTablePage } from './DataTable';
import { AboutPage } from './About';
import { AKData } from './AKData';
import DataContext from './DataContext';
import './App.css';
import 'bulma';

type NavBarParams = {
  selected: number;
  goToHome: () => void;
  goToAnalytics: () => void;
  goToData: () => void;
  goToAbout: () => void;
};

enum AppTab {
  Home,
  Analytics,
  Data,
  About
};

function NavBar (params: NavBarParams) {
	let homeClass = "navbar-item" + (params.selected === AppTab.Home ? " is-active" : "");
	let analyticsClass = "navbar-item" + (params.selected === AppTab.Analytics ? " is-active" : "");
	let dataClass = "navbar-item" + (params.selected === AppTab.Data ? " is-active" : "");
	let aboutClass = "navbar-item" + (params.selected === AppTab.About ? " is-active" : "");

	useEffect(() => {
		document.addEventListener('DOMContentLoaded', () => {

			// Get all "navbar-burger" elements
			const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

			// Check if there are any navbar burgers
			if ($navbarBurgers.length > 0) {

				// Add a click event on each of them
				$navbarBurgers.forEach( burger => {
					burger.addEventListener('click', () => {

						// Get the target from the "data-target" attribute
						const target = burger.dataset.target;
						const $target = document.getElementById(target);

						// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
						burger.classList.toggle('is-active');
						if ($target) {
							$target.classList.toggle('is-active');
						}
					});
				});
			}
		});
	}, []);

  /* eslint-disable jsx-a11y/anchor-is-valid */
  return (
		<nav className="navbar is-primary height-animated" role="navigation" aria-label="main navigation">
			<div className="navbar-brand">
				<span className="navbar-item nav-title">
					<img src="ak-factions/logo_rhine.png" alt="" /><span className="strong">Rhine Lab</span>&nbsp;Data Archive
				</span>

				<a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
					<span aria-hidden="true"></span>
				</a>
			</div>

			<div id="navbarBasicExample" className="navbar-menu">
				<div className="navbar-start">
					<a className={ homeClass } onClick={ params.goToHome }>
					  Home
					</a>
					<a className={ analyticsClass } onClick={ params.goToAnalytics }>
					  Visualizations
					</a>
					<a className={ dataClass } onClick={ params.goToData }>
						Data
					</a>
					<a className={ aboutClass } onClick={ params.goToAbout }>
						About
					</a>
				</div>
			</div>
		</nav>
  );
  /* eslint-enable jsx-a11y/anchor-is-valid */
}

type HeaderParams = {
  tab: number;
  setTab: (tab: number) => void;
};
function Header (params: HeaderParams) {
  return (
    <NavBar selected={ params.tab }
            goToHome={ () => params.setTab(AppTab.Home) }
            goToAnalytics={ () => params.setTab(AppTab.Analytics) }
            goToData={ () => params.setTab(AppTab.Data) }
            goToAbout={ () => params.setTab(AppTab.About) } />
  );
}

function Footer() {
  return (
    <div className="footer">
      Footer stuff
    </div>
  );
}


function getTabContent(tab: AppTab, akData: AKData) {
  switch(tab) {
    case AppTab.Home:
      return (
        <HomePage />
      );
    case AppTab.Analytics:
      return (
        <AnalyticsPage />
      );
    case AppTab.Data:
      return (
        <DataTablePage operators={ akData.operators() }/>
      );
    case AppTab.About:
      return (
        <AboutPage />
      );
  }
}

function getStartingTab() {
  let hash = window.location.hash.substr(1).toLowerCase();
  switch(hash) {
    case "analytics":
      return AppTab.Analytics;
    case "data":
      return AppTab.Data;
    case "about":
      return AppTab.About;
    default:
      return AppTab.Home;
  }
}

function App() {
  const [tab, setTab] = useState(getStartingTab());
  const [akData, setAkData] = useState<AKData | null>(null);

  useEffect(() => {
    switch(tab) {
      case AppTab.Home:
        window.location.hash = '';
        break;
      case AppTab.Analytics:
        window.location.hash = '#analytics';
        break;
      case AppTab.Data:
        window.location.hash = '#data';
        break;
      case AppTab.About:
        window.location.hash = '#about';
    }
  }, [tab]);

  useEffect(() => {
    setAkData(AKData.getInstance());
  }, []);
  
  let modal = (akData === null) ? (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-card">
        <header className="modal-card-head">
          Loading...
        </header>
        <section className="modal-card-body modal-card-foot">
          <progress className="progress is-primary" />
        </section>
      </div>
    </div>
  ) : null;

  let content = (akData !== null) ? getTabContent(tab, akData) : null;

  return (
    <>
    <Header tab={ tab } setTab={ setTab }/>
    <DataContext.Provider value={ akData }>
    { content }
    </DataContext.Provider>
    <Footer />
    { modal }
    </>
  );
}

export default App;
