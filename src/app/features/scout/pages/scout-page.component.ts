import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridAngular } from 'ag-grid-angular';
import { ColDef, GridReadyEvent, GridApi, SideBarDef } from 'ag-grid-community';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ScoutStore } from '../store/scout.store';
import { ScoutObject } from '../models/scout.model';

@Component({
  selector: 'app-scout-page',
  standalone: true,
  imports: [
    CommonModule,
    AgGridAngular,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    InputTextModule
  ],
  templateUrl: './scout-page.component.html',
  styleUrl: './scout-page.component.scss'
})
export class ScoutPageComponent implements OnInit {
  readonly store = inject(ScoutStore);
  detailsVisible = signal(false);
  displayedCount = signal(0);
  private gridApi?: GridApi;

  colDefs: ColDef[] = [
    { field: 'objectName', headerName: 'Designation', filter: 'agTextColumnFilter', flex: 1.2, minWidth: 130 },
    { field: 'H', headerName: 'Magnitude (H)', filter: 'agNumberColumnFilter', width: 140 },
    { field: 'nObs', headerName: 'Observations', filter: 'agNumberColumnFilter', width: 130 },
    { field: 'caDist', headerName: 'Close Approach (LD)', filter: 'agTextColumnFilter', width: 170,
      valueFormatter: p => p.value == null || p.value === '' ? '—' : p.value },
    { field: 'neoScore', headerName: 'NEO Score', filter: 'agNumberColumnFilter', width: 120 },
    { field: 'phaScore', headerName: 'PHA Score', filter: 'agNumberColumnFilter', width: 120 },
    { field: 'arc', headerName: 'Arc (days)', filter: 'agTextColumnFilter', width: 120 },
    { field: 'lastRun', headerName: 'Last Run', filter: 'agTextColumnFilter', flex: 1, minWidth: 150 }
  ];

  defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
    filter: true,
    floatingFilter: false
  };

  sideBar: SideBarDef = {
    toolPanels: [
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel'
      }
    ],
    defaultToolPanel: ''
  };

  ngOnInit() {
    this.store.loadCandidates();
  }

  onGridReady(params: GridReadyEvent) {
    this.gridApi = params.api;
    this.updateDisplayedCount();
  }

  onQuickFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.gridApi?.setGridOption('quickFilterText', value);
    this.updateDisplayedCount();
  }

  onFilterChanged() {
    this.updateDisplayedCount();
  }

  onRowClicked(event: any) {
    this.store.selectCandidate(event.data as ScoutObject);
    this.detailsVisible.set(true);
  }

  private updateDisplayedCount() {
    const count = this.gridApi?.getDisplayedRowCount() ?? this.store.candidates().length;
    this.displayedCount.set(count);
  }
}
