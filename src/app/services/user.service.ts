import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User, UserLogin, UserRegistration } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly USERS_KEY = 'usuarios';
  private readonly LOGGED_USER_KEY = 'usuarioLogado';
  
  private loggedUserSubject = new BehaviorSubject<User | null>(this.getLoggedUser());
  public loggedUser$ = this.loggedUserSubject.asObservable();

  constructor() { }

  // Obter usuários do localStorage
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  // Salvar usuários no localStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  // Registrar novo usuário
  registerUser(userData: UserRegistration): { success: boolean; message: string } {
    const users = this.getUsers();
    
    // Validações
    if (!userData.nome || !userData.email || !userData.senha || !userData.confirmarSenha) {
      return { success: false, message: 'Preencha todos os campos!' };
    }

    if (userData.senha !== userData.confirmarSenha) {
      return { success: false, message: 'As senhas não conferem!' };
    }

    if (!userData.aceiteLGPD) {
      return { success: false, message: 'Você deve aceitar os termos da LGPD!' };
    }

    if (users.some(u => u.email === userData.email)) {
      return { success: false, message: 'Este e-mail já está registrado!' };
    }

    // Adicionar usuário
    const newUser: User = {
      nome: userData.nome,
      email: userData.email,
      senha: userData.senha
    };

    users.push(newUser);
    this.saveUsers(users);

    return { success: true, message: 'Usuário registrado com sucesso!' };
  }

  // Login do usuário
  loginUser(credentials: UserLogin): { success: boolean; message: string; user?: User } {
    if (!credentials.email || !credentials.senha) {
      return { success: false, message: 'Preencha todos os campos!' };
    }

    const users = this.getUsers();
    const user = users.find(u => u.email === credentials.email && u.senha === credentials.senha);

    if (!user) {
      return { success: false, message: 'Email ou senha incorretos!' };
    }

    // Armazenar usuário logado
    localStorage.setItem(this.LOGGED_USER_KEY, JSON.stringify(user));
    this.loggedUserSubject.next(user);

    return { success: true, message: `Bem-vindo, ${user.nome}!`, user };
  }

  // Logout do usuário
  logoutUser(): void {
    localStorage.removeItem(this.LOGGED_USER_KEY);
    this.loggedUserSubject.next(null);
  }

  // Obter usuário logado
  getLoggedUser(): User | null {
    const user = localStorage.getItem(this.LOGGED_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  // Remover usuário
  removeUser(index: number): void {
    const users = this.getUsers();
    users.splice(index, 1);
    this.saveUsers(users);
  }

  // Verificar se usuário está logado
  isLoggedIn(): boolean {
    return this.getLoggedUser() !== null;
  }
}