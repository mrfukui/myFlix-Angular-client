import { Component, OnInit, Input } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DirectorInfoComponent } from '../director-info/director-info.component';
import { MovieDescriptionComponent } from '../movie-description/movie-description.component';
import { GenreInfoComponent } from '../genre-info/genre-info.component';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
})
export class ProfilePageComponent implements OnInit {
  /**
   * User data input model for profile page.
   */
  @Input() userData = {
    _id: '',
    username: '',
    email: '',
    birthday: '',
    favoritemovies: [],
  };

  user: any = {};
  movies: any[] = [];
  favoritemovies: any[] = [];

  /**
   * Creates an instance of ProfilePageComponent.
   * @param fetchApiData - Service for API calls
   * @param dialog - Service for opening dialog components
   * @param snackBar - Service for displaying notifications
   * @param router - Router for navigation
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {
    this.getProfile();
    this.getMovies();
  }

  /**
   * Retrieves the user profile information.
   */
  getProfile(): void {
    this.user = this.fetchApiData.getUser();
    this.userData._id = this.user._id;
    this.userData.username = this.user.username;
    this.userData.email = this.user.email;
    this.userData.birthday = this.user.birthday;
    this.favoritemovies = this.user.favoritemovies;
    this.fetchApiData.getAllMovies().subscribe((response) => {
      this.favoritemovies = response.filter((movie: any) =>
        this.user.favoritemovies.includes(movie._id)
      );
    });
  }

  /**
   * Updates user information.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.userData).subscribe(
      (result) => {
        console.log('User update success:', result);
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User update successful', 'OK', {
          duration: 2000,
        });
      },
      (error) => {
        console.error('Error updating user:', error);
        this.snackBar.open('Failed to update user', 'OK', {
          duration: 2000,
        });
      }
    );
  }

  /**
   * Retrieves all movies from the database.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  /**
   * Retrieves user favorites.
   */
  getUserFavorites(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoritemovies = this.user.favoritemovies;
    this.favoritemovies = this.user.favoritemovies;
  }

  /**
   * Opens a dialog displaying director information.
   * @param name - Director's name
   * @param bio - Director's biography
   * @param birthyear - Director's birth year
   * @param deathyear - Director's death year (if applicable)
   */
  directorDialog(
    name: string,
    bio: string,
    birthyear: string,
    deathyear: string
  ): void {
    this.dialog.open(DirectorInfoComponent, {
      data: {
        Name: name,
        Bio: bio,
        Birth: birthyear,
        Death: deathyear,
      },
      width: '450px',
    });
  }

  /**
   * Opens a dialog displaying genre information.
   * @param Name - Genre name
   * @param Description - Genre description
   */
  genreDialog(Name: string, Description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: Name,
        Description: Description,
      },
      width: '450px',
    });
  }

  /**
   * Opens a dialog displaying movie description.
   * @param description - Movie description
   */
  movieDescriptionDialog(description: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }
}
