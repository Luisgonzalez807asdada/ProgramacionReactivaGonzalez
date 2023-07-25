import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.css']
})
export class DataListComponent implements OnInit {

  data: any[] = [];
  filter$: Subject<string> = new Subject<string>();
  currentFilter: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.filter$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((filterText: string) => this.dataService.getData(filterText))
    ).subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Error fetching filtered data:', error);
      }
    );
  }

  getData(): void {
    this.dataService.getData(this.currentFilter).subscribe(
      (response) => {
        this.data = response;
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  applyFilter(event: Event): void {
    const filterText = (event.target as HTMLInputElement).value;
    this.currentFilter = filterText;
    this.filter$.next(filterText);
  }

  buscar(): void {
    this.getData();
  }
}
