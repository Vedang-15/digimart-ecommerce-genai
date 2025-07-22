import { DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent {
  isAuthenticated: boolean = false;
  userName: string | undefined;
  userEmail: string | undefined;
  storage: Storage = localStorage;

  constructor(private auth: AuthService, @Inject(DOCUMENT) private doc: Document) {}

  ngOnInit(): void {
    this.auth.isLoading$.subscribe((loading) => {
      if (!loading) {
        this.auth.isAuthenticated$.subscribe((authenticated: boolean) => {
          this.isAuthenticated = authenticated;
          console.log('User is authenticated: ', this.isAuthenticated);
        });

        this.auth.user$.subscribe((user) => {
          if (user?.nickname && user.nickname.trim() !== '') {
            // Use nickname
            this.userName = user.nickname.charAt(0).toUpperCase() + user.nickname.slice(1);
          } else if (user?.email) {
            // Fallback: derive from email
            const prefix = user.email.split('@')[0];
            this.userName = prefix.charAt(0).toUpperCase() + prefix.slice(1);
          } else {
            this.userName = 'Guest';
          }

          this.userEmail = user?.email;
          this.storage.setItem('userEmail', JSON.stringify(this.userEmail));

          console.log('User Name: ', this.userName);
          console.log('User Email: ', this.userEmail);
        });
      }
    });
  }


  login() {
    this.auth.loginWithRedirect();
  }

  logout(): void {
    this.auth.logout({ logoutParams: { returnTo: this.doc.location.origin } });
  }
}
