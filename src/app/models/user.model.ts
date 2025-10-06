export interface User {
  nome: string;
  email: string;
  senha: string;
}

export interface UserLogin {
  email: string;
  senha: string;
}

export interface UserRegistration extends User {
  confirmarSenha: string;
  aceiteLGPD: boolean;
}