import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-movie-description',
  templateUrl: './movie-description.component.html',
  styleUrl: './movie-description.component.scss',
})
export class MovieDescriptionComponent implements OnInit {
  /**
   * Creates an instance of MovieDescriptionComponent.
   * @param data - Data passed into the dialog
   */
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      Description: string;
    }
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}
}
