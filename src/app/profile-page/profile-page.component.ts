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

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfile();
    this.getMovies();
  }

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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  getUserFavorites(): void {
    this.user = this.fetchApiData.getUser();
    this.userData.favoritemovies = this.user.favoritemovies;
    this.favoritemovies = this.user.favoritemovies;
  }

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

  genreDialog(Name: string, Description: string): void {
    this.dialog.open(GenreInfoComponent, {
      data: {
        Name: Name,
        Description: Description,
      },
      width: '450px',
    });
  }

  movieDescriptionDialog(description: string): void {
    this.dialog.open(MovieDescriptionComponent, {
      data: {
        Description: description,
      },
      width: '450px',
    });
  }
}
