import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import {ICellRendererParams} from 'ag-grid-community';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

import data from './data.json';

const MILLISECONDS_IN_DAY = 3600 * 1000 * 24;

type FeaturedTableData = {
	name: string;
	rarity: number;
	daysSinceFeatured: number;
	timesFeatured: number;
	averageFeaturedInterval: number;
};

function days(unixInterval: number): number {
	return Math.floor(unixInterval / MILLISECONDS_IN_DAY);
}

function daysSince(unixTime: number): number {
	return days(Date.now() - unixTime)
}

function daysSinceRenderer(params: ICellRendererParams): string {
	if (params.value < 0) { return "Now"; };
	if (!isFinite(params.value)) { return "Never"; };
	if (params.value === 1) { return params.value + "Day"; }
	return params.value + " Days";
}

function FeaturedDataTable() {
	const [featuredData, setFeaturedData] = useState<FeaturedTableData[]>([]);

	useEffect(() => {
		let featured = Object.values(data.operators).filter((op) => {
			return op.rarity > 4 && op.headhunting;
		}).map((op) => {
			let lastFeatured = ("EN" in op) ? daysSince(op["EN"].lastFeatured) : Infinity;
			let timesFeatured = ("EN" in op) ? op["EN"].timesFeatured : 0;
			let averageFeaturedInterval = ("EN" in op) ? days((op["EN"].lastFeatured - op.release_date_cn) / op["EN"].timesFeatured) : Infinity;
			return {
				name: op.name,
				rarity:  op.rarity,
				daysSinceFeatured: lastFeatured,
				timesFeatured: timesFeatured,
				averageFeaturedInterval: averageFeaturedInterval
			};
		});
		setFeaturedData(featured); 
	}, []);

  return (
		<div>
			<h1>Featured 5* and 6*</h1>
			<div className="ag-theme-alpine" style={{ height: 1000, width: 1200 }}>
				<AgGridReact rowData={ featuredData }>
					<AgGridColumn field="name" sortable={ true } filter={ true }></AgGridColumn>
					<AgGridColumn field="rarity" sortable={ true } filter={ true }></AgGridColumn>
					<AgGridColumn field="daysSinceFeatured" sortable={ true } cellRenderer={ daysSinceRenderer }></AgGridColumn>
					<AgGridColumn field="timesFeatured" sortable={ true }></AgGridColumn>
					<AgGridColumn field="averageFeaturedInterval" sortable={ true } cellRenderer={ daysSinceRenderer }></AgGridColumn>
				</AgGridReact>
			</div>
		</div>
	);
}

function App() {
  return (
		<div>
			<FeaturedDataTable />
		</div>
  );
}

export default App;
