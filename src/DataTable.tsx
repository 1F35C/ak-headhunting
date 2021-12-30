import { useEffect, useState } from 'react';
import { ICellRendererParams, ValueFormatterParams, RowClassParams, RowStyle } from 'ag-grid-community';
import {AgGridColumn, AgGridReact} from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';

type ReleaseInfo = {
  firstFeatured: number;
  lastFeatured: number;
  timesFeatured: number;
  firstInShop: number;
  lastInShop: number;
  timesInShop: number;
}

type Operator = {
  name: string;
  class: string;
  rarity: number;
  headhunting: boolean;
  recruitment: boolean;
  limited: boolean;
  faction: string;
  subfaction: string;
  release_date_en: number;
  EN: ReleaseInfo | undefined;
  CN: ReleaseInfo | undefined;
}

type FeaturedTableData = {
	name: string;
	rarity: string;
	class: string;
  faction: string;
  subfaction: string;
	daysSinceFeatured: number;
	timesFeatured: number;
	averageFeaturedInterval: number;
  daysSinceShop: number;
  timesShop: number;
  averageShopInterval: number;
};

const data: { operators: { [id: string]: Operator } } = require('./data.json');
const images: { [id: string]: string } = require('./images.json');

const MILLISECONDS_IN_DAY = 3600 * 1000 * 24;

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
    return '<img src="' + imgSrc + '" style="height: 100%; float: left;" /> ' + params.value;
  } else {
    return params.value;
  }
}

function getAverageFeaturedInterval(op: Operator): number {
  if (!op.EN || op.EN.timesFeatured < 2) {
    return Infinity;
  }
  return days((op.EN.lastFeatured - op.EN.firstFeatured) / (op.EN.timesFeatured - 1));
}

function getAverageShopInterval(op: Operator): number {
  if (!op.EN || op.EN.timesInShop < 2) {
    return Infinity;
  }
  return days((op.EN.lastInShop - op.EN.firstInShop) / (op.EN.timesInShop - 1));
}

export function DataTable() {
	const [featuredData, setFeaturedData] = useState<FeaturedTableData[]>([]);

	useEffect(() => {
		let featured = Object.values(data.operators).filter((op) => {
			return op.rarity > 4 && op.headhunting;
		}).map((op) => {
			let lastFeatured = (op.EN) ? daysSince(op.EN.lastFeatured) : Infinity;
			let timesFeatured = (op.EN) ? op.EN.timesFeatured : 0;
			let lastInShop = (op.EN && op.EN.timesInShop > 0) ? daysSince(op.EN.lastInShop) : Infinity;
			let timesInShop = (op.EN) ? op.EN.timesInShop : 0;
			return {
				name: op.name,
				rarity:  op.rarity.toString() + (op.limited ? " (LIMITED)" : ""),
				class:  op.class,
        faction: op.faction,
        subfaction: op.subfaction,
				daysSinceFeatured: lastFeatured,
				timesFeatured: timesFeatured,
				averageFeaturedInterval: getAverageFeaturedInterval(op),
        daysSinceShop: lastInShop,
        timesShop: timesInShop,
        averageShopInterval: getAverageShopInterval(op)
			};
		});
		setFeaturedData(featured); 
	}, []);

  const rowClassRules = {
    "limited": (params: RowClassParams) => { return params.data.rarity.includes("LIMITED"); }
  };
  return (
		<div>
      <div className="flex">
        <div className="ag-theme-alpine-dark" style={{ width: "98%", height: 1000 }}>
          <AgGridReact rowData={ featuredData } rowClassRules={ rowClassRules }>
            <AgGridColumn field="name" sortable={ true } filter={ true } cellRenderer={ portraitCellRenderer }></AgGridColumn>
            <AgGridColumn field="rarity" sortable={ true } filter={ true }></AgGridColumn>
            <AgGridColumn field="class" sortable={ true } cellRenderer={ imageCellRenderer }></AgGridColumn>
            <AgGridColumn field="faction" sortable={ true } cellRenderer={ portraitCellRenderer }></AgGridColumn>
            <AgGridColumn field="subfaction" sortable={ true } cellRenderer={ portraitCellRenderer }></AgGridColumn>
            <AgGridColumn field="daysSinceFeatured" sortable={ true } valueFormatter={ daysSinceValueFormatter }></AgGridColumn>
            <AgGridColumn field="timesFeatured" sortable={ true }></AgGridColumn>
            <AgGridColumn field="averageFeaturedInterval" sortable={ true } valueFormatter={ timeIntervalValueFormatter }></AgGridColumn>
            <AgGridColumn field="daysSinceShop" sortable={ true } valueFormatter={ daysSinceValueFormatter }></AgGridColumn>
            <AgGridColumn field="timesShop" sortable={ true }></AgGridColumn>
            <AgGridColumn field="averageShopInterval" sortable={ true } valueFormatter={ timeIntervalValueFormatter }></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
		</div>
	);
}

