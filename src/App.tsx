import React from 'react';
import { useEffect, useState } from 'react';
import { DataTable } from './DataTable';
import './App.css';

function NavBar () {
	return (
		<div>
			Title
			<button>Analytics</button>
			<button>Data</button>
			<button>About</button>
			<button>Disclaimer</button>
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


function App() {
	const [tab, setTab] = useState(0);
  return (
		<div>
			<NavBar />
			<DataTable />
			<Footer />
		</div>
  );
}

export default App;
