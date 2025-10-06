import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isMenuOpen = false;
  isDarkTheme = false;
  currentUser: User | null = null;
  isLoggedIn = false;

  constructor(
    private themeService: ThemeService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Inscrever-se para mudanças de tema
    this.themeService.isDarkTheme$.subscribe(isDark => {
      this.isDarkTheme = isDark;
    });

    // Inscrever-se para mudanças no usuário logado
    this.userService.loggedUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = user !== null;
    });
  }

  // Alternar menu hambúrguer
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('menuOpen', this.isMenuOpen);
    }
  }

  // Alternar tema
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  // Fazer logout
  logout(): void {
    this.userService.logoutUser();
    this.toggleMenu(); // Fechar menu após logout
    this.router.navigate(['/login']);
  }
}