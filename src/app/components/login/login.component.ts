import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserLogin } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: UserLogin = {
    email: '',
    senha: ''
  };
  
  message = '';
  messageType: 'success' | 'error' = 'error';
  showPassword = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Se já estiver logado, redirecionar para lista
    if (this.userService.isLoggedIn()) {
      this.router.navigate(['/list']);
    }
  }

  // Alternar visibilidade da senha
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Fazer login
  onLogin(): void {
    const result = this.userService.loginUser(this.credentials);
    
    this.message = result.message;
    this.messageType = result.success ? 'success' : 'error';
    
    if (result.success) {
      // Limpar campos
      this.credentials = { email: '', senha: '' };
      
      // Redirecionar após delay
      setTimeout(() => {
        this.router.navigate(['/list']);
      }, 1500);
    }
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  // Manipular Enter
  onEnterKey(): void {
    this.onLogin();
  }
}