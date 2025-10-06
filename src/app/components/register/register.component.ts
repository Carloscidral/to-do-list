import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { UserRegistration, User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  userData: UserRegistration = {
    nome: '',
    email: '',
    senha: '',
    confirmarSenha: '',
    aceiteLGPD: false
  };
  
  users: User[] = [];
  message = '';
  messageType: 'success' | 'error' = 'error';
  showPassword = false;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  // Carregar usuários
  loadUsers(): void {
    this.users = this.userService.getUsers();
  }

  // Alternar visibilidade da senha
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Registrar usuário
  onRegister(): void {
    const result = this.userService.registerUser(this.userData);
    
    this.message = result.message;
    this.messageType = result.success ? 'success' : 'error';
    
    if (result.success) {
      // Limpar formulário
      this.userData = {
        nome: '',
        email: '',
        senha: '',
        confirmarSenha: '',
        aceiteLGPD: false
      };
      
      // Recarregar lista de usuários
      this.loadUsers();
    }
    
    // Limpar mensagem após 3 segundos
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }

  // Remover usuário
  removeUser(index: number): void {
    this.userService.removeUser(index);
    this.loadUsers();
    this.message = 'Usuário removido com sucesso!';
    this.messageType = 'success';
    
    setTimeout(() => {
      this.message = '';
    }, 3000);
  }
}