import { useEffect, useState } from 'react';
import { GridApi, GridReadyEvent, ICellRendererParams, ValueFormatterParams, RowClassParams, RowStyle } from 'ag-grid-community';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import { getImage, Operator, OperatorDict } from './AKData';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';


const CLASSES = "classes";
const FACTIONS = "factions";
const PORTRAITS = "portraits";

type FeaturedTableData = {
  name: string;
  rarity: string;
  class: string;
  faction: string;
  gender: string;
  subfaction: string;
  daysSinceFeatured: number;
  timesFeatured: number;
  averageFeaturedInterval: number;
  daysSinceShop: number;
  timesShop: number;
  averageShopInterval: number;
};

const MILLISECONDS_IN_DAY = 3600 * 1000 * 24;

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

function getImageCellRenderer(context: string, className: string="ak-icon"): (params: ICellRendererParams) => string {
  return (params) => {
    return '<img class="' + className + '" src="' + getImage(context, params.value) + '" title="' + params.value + '"/>';
  };
}

function getImageTextCellRenderer(context: string, className: string="ak-icon"): (params: ICellRendererParams) => string {
  return (params) => {
    let imgSrc = null;
    try {
      imgSrc = getImage(context, params.value);
    } catch(err) {}

    if (imgSrc) {
      return '<img class="' + className + '" src="' + imgSrc + '" style="float: left;" /> ' + params.value;
    } else {
      return params.value;
    }
  };
}

function getAverageFeaturedInterval(op: Operator): number {
  if (op.EN.featured.length < 2) {
    return Infinity;
  }
  return days((op.EN.featured[op.EN.featured.length - 1].end - op.EN.featured[0].start) / (op.EN.featured.length - 1));
}

function getAverageShopInterval(op: Operator): number {
  if (op.EN.shop.length < 2) {
    return Infinity;
  }
  return days((op.EN.shop[op.EN.shop.length - 1].end - op.EN.shop[0].start) / (op.EN.shop.length- 1));
}

type DataTablePageParams = {
  operators: OperatorDict
};

export function DataTablePage(params: DataTablePageParams) {
  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const [featuredData, setFeaturedData] = useState<FeaturedTableData[]>([]);

  useEffect(() => {
    let featured = Object.values(params.operators).map((op) => {
      let lastFeatured = (op.EN && op.EN.featured.length > 0) ? daysSince(op.EN.featured[op.EN.featured.length - 1].end) : Infinity;
      let timesFeatured = (op.EN) ? op.EN.featured.length : 0;
      let lastInShop = (op.EN && op.EN.shop.length > 0) ? daysSince(op.EN.shop[op.EN.shop.length - 1].end) : Infinity;
      let timesInShop = (op.EN) ? op.EN.shop.length : 0;
      return {
        name: op.name,
        rarity:  op.rarity.toString() + (op.limited ? " (LIMITED)" : ""),
        class:  op.class,
        gender: op.gender,
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

  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
    params.columnApi.autoSizeAllColumns();
  };

  const onQuickFilterChange = (event: React.ChangeEvent<HTMLInputElement>): boolean => {
    if (gridApi) {
      gridApi.setQuickFilter(event.target.value);
    }
    return true;
  };
  const rowClassRules = {
    "limited": (params: RowClassParams) => { return params.data.rarity.includes("LIMITED"); }
  };

  return (
    <div className="container is-fluid">
      <div className="search">
        Quick Search: <input type="text" onChange={ onQuickFilterChange } />
      </div>
      <div className="flex">
        <div className="ag-theme-alpine" style={{ width: "100%", height: 1000 }}>
          <AgGridReact rowData={ featuredData }
                       rowClassRules={ rowClassRules }
                       onGridReady={ onGridReady }>
            <AgGridColumn field="name" minWidth={ 200 } sortable={ true } filter={ true } pinned="left" lockPinned={ true } cellRenderer={ getImageTextCellRenderer(PORTRAITS) }></AgGridColumn>
            <AgGridColumn field="rarity" sortable={ true } filter={ true }></AgGridColumn>
            <AgGridColumn field="class" sortable={ true } cellRenderer={ getImageCellRenderer(CLASSES, "ak-icon-inverted") }></AgGridColumn>
            <AgGridColumn field="gender" sortable={ true } ></AgGridColumn>
            <AgGridColumn field="faction" sortable={ true } cellRenderer={ getImageTextCellRenderer(FACTIONS, "ak-icon-inverted") }></AgGridColumn>
            <AgGridColumn field="subfaction" sortable={ true } cellRenderer={ getImageTextCellRenderer(FACTIONS, "ak-icon-inverted") } ></AgGridColumn>
            <AgGridColumn field="daysSinceFeatured" sortable={ true } valueFormatter={ daysSinceValueFormatter }></AgGridColumn>
            <AgGridColumn field="timesFeatured" sortable={ true }></AgGridColumn>
            <AgGridColumn field="averageFeaturedInterval" sortable={ true } valueFormatter={ timeIntervalValueFormatter }></AgGridColumn>
            <AgGridColumn field="daysSinceShop" sortable={ true } valueFormatter={ daysSinceValueFormatter }></AgGridColumn>
            <AgGridColumn field="timesShop" sortable={ true }></AgGridColumn>
            <AgGridColumn field="averageShopInterval" sortable={ true } valueFormatter={ timeIntervalValueFormatter }></AgGridColumn>
          </AgGridReact>
        </div>
      </div>
      (This data is optimized for desktop viewing)
    </div>
  );
}

