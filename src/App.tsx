import React from 'react';
import { useEffect, useState } from 'react';
import './App.css';
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

const data: { operators: { [id: string]: Operator } } = require('./data.json');
const images: { [id: string]: string } = require('./images.json');

const MILLISECONDS_IN_DAY = 3600 * 1000 * 24;

type ReleaseInfo = {
  firstFeatured: number;
  lastFeatured: number;
  timesFeatured: number;
}

type Operator = {
  name: string;
  class: string;
  rarity: number;
  headhunting: boolean;
  recruitment: boolean;
  release_date_en: number;
  EN: ReleaseInfo | undefined;
  CN: ReleaseInfo | undefined;
}

type FeaturedTableData = {
	name: string;
	rarity: number;
	class: string;
	daysSinceFeatured: number;
	timesFeatured: number;
	averageFeaturedInterval: number;
};

function getImage(value: string): string {
  if (value in images) {
    return images[value];
  }
  throw new Error("Image could not be found");
}

function days(unixInterval: number): number {
	return Math.floor(unixInterval / MILLISECONDS_IN_DAY);
}

function daysSince(unixTime: number): number {
	return days(Date.now() - unixTime)
}

function daysSinceValueFormatter(params: ValueFormatterParams): string {
	if (params.value < 0) { return "Now"; };
	if (!isFinite(params.value)) { return "Never"; };
	if (params.value === 1) { return params.value + "Day"; }
	return params.value + " Days";
}

function timeIntervalValueFormatter(params: ValueFormatterParams): string {
	if (params.value < 0) { return "Now"; };
	if (!isFinite(params.value)) { return "N/A"; };
	if (params.value === 1) { return params.value + "Day"; }
	return params.value + " Days";
}


function imageCellRenderer(params: ICellRendererParams): string {
  return '<img src="' + getImage(params.value) + '" style="height: 100%" />';
}

function portraitCellRenderer(params: ICellRendererParams): string {
  let imgSrc = null;
  try {
    imgSrc = getImage(params.value);
  } catch(err) {}

  if (imgSrc) {
    return '<img src="' + imgSrc + '" style="height: 100%" /> ' + '<span style="vertical-align: top">' + params.value + '</span>';
  } else {
    return params.value;
  }
}

function getAverageFeaturedInterval(op: Operator): number {
  if (!op.EN) {
    return Infinity;
  }
  return days((op.EN.lastFeatured - op.EN.firstFeatured) / (op.EN.timesFeatured - 1));
}

function FeaturedDataTable() {
	const [featuredData, setFeaturedData] = useState<FeaturedTableData[]>([]);

	useEffect(() => {
		let featured = Object.values(data.operators).filter((op) => {
			return op.rarity > 4 && op.headhunting;
		}).map((op) => {
			let lastFeatured = (op.EN) ? daysSince(op.EN.lastFeatured) : Infinity;
			let timesFeatured = (op.EN) ? op.EN.timesFeatured : 0;
			let averageFeaturedInterval = getAverageFeaturedInterval(op);
			return {
				name: op.name,
				rarity:  op.rarity,
				class:  op.class,
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
			<div className="ag-theme-alpine-dark" style={{ height: 1000, width: 1200 }}>
				<AgGridReact rowData={ featuredData }>
					<AgGridColumn field="name" sortable={ true } filter={ true } cellRenderer={ portraitCellRenderer }></AgGridColumn>
					<AgGridColumn field="rarity" sortable={ true } filter={ true }></AgGridColumn>
					<AgGridColumn field="class" sortable={ true } cellRenderer={ imageCellRenderer }></AgGridColumn>
					<AgGridColumn field="daysSinceFeatured" sortable={ true } valueFormatter={ daysSinceValueFormatter }></AgGridColumn>
					<AgGridColumn field="timesFeatured" sortable={ true }></AgGridColumn>
					<AgGridColumn field="averageFeaturedInterval" sortable={ true } valueFormatter={ timeIntervalValueFormatter }></AgGridColumn>
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
