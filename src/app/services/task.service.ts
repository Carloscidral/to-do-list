import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListsData } from '../models/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly LISTS_KEY = 'listas';
  private readonly CURRENT_LIST_KEY = 'listaAtual';
  
  private listsSubject = new BehaviorSubject<ListsData>(this.getLists());
  private currentListSubject = new BehaviorSubject<string | null>(this.getCurrentList());
  
  public lists$ = this.listsSubject.asObservable();
  public currentList$ = this.currentListSubject.asObservable();

  constructor() { }

  // Obter listas do localStorage
  getLists(): ListsData {
    const lists = localStorage.getItem(this.LISTS_KEY);
    return lists ? JSON.parse(lists) : {};
  }

  // Obter lista atual
  getCurrentList(): string | null {
    return localStorage.getItem(this.CURRENT_LIST_KEY);
  }

  // Salvar listas no localStorage
  private saveLists(): void {
    const lists = this.listsSubject.value;
    localStorage.setItem(this.LISTS_KEY, JSON.stringify(lists));
    localStorage.setItem(this.CURRENT_LIST_KEY, this.currentListSubject.value || '');
  }

  // Adicionar nova lista
  addList(name: string): { success: boolean; message: string } {
    if (!name.trim()) {
      return { success: false, message: 'Digite o nome da lista!' };
    }

    const lists = this.listsSubject.value;
    if (lists[name]) {
      return { success: false, message: 'Essa lista já existe!' };
    }

    lists[name] = [];
    this.listsSubject.next(lists);
    this.currentListSubject.next(name);
    this.saveLists();

    return { success: true, message: 'Lista criada com sucesso!' };
  }

  // Selecionar lista atual
  selectList(name: string): void {
    this.currentListSubject.next(name);
    this.saveLists();
  }

  // Adicionar tarefa à lista atual
  addTask(task: string): { success: boolean; message: string } {
    const currentList = this.currentListSubject.value;
    if (!currentList) {
      return { success: false, message: 'Selecione ou crie uma lista primeiro!' };
    }

    if (!task.trim()) {
      return { success: false, message: 'Digite uma tarefa!' };
    }

    const lists = this.listsSubject.value;
    lists[currentList].push(task.trim());
    this.listsSubject.next(lists);
    this.saveLists();

    return { success: true, message: 'Tarefa adicionada!' };
  }

  // Editar tarefa
  editTask(listName: string, index: number, newText: string): { success: boolean; message: string } {
    if (!newText.trim()) {
      return { success: false, message: 'Digite uma tarefa!' };
    }

    const lists = this.listsSubject.value;
    if (lists[listName] && lists[listName][index] !== undefined) {
      lists[listName][index] = newText.trim();
      this.listsSubject.next(lists);
      this.saveLists();
      return { success: true, message: 'Tarefa editada!' };
    }

    return { success: false, message: 'Erro ao editar tarefa!' };
  }

  // Remover tarefa
  removeTask(listName: string, index: number): void {
    const lists = this.listsSubject.value;
    if (lists[listName] && lists[listName][index] !== undefined) {
      lists[listName].splice(index, 1);
      this.listsSubject.next(lists);
      this.saveLists();
    }
  }

  // Editar nome da lista
  editListName(oldName: string, newName: string): { success: boolean; message: string } {
    if (!newName.trim()) {
      return { success: false, message: 'Digite um nome para a lista!' };
    }

    const lists = this.listsSubject.value;
    if (lists[newName] && newName !== oldName) {
      return { success: false, message: 'Já existe uma lista com esse nome!' };
    }

    // Renomear lista
    lists[newName] = lists[oldName];
    delete lists[oldName];

    // Atualizar lista atual se necessário
    if (this.currentListSubject.value === oldName) {
      this.currentListSubject.next(newName);
    }

    this.listsSubject.next(lists);
    this.saveLists();

    return { success: true, message: 'Lista renomeada!' };
  }

  // Remover lista
  removeList(name: string): void {
    const lists = this.listsSubject.value;
    delete lists[name];

    // Se era a lista atual, limpar seleção
    if (this.currentListSubject.value === name) {
      this.currentListSubject.next(null);
    }

    this.listsSubject.next(lists);
    this.saveLists();
  }

  // Obter tarefas da lista atual
  getCurrentListTasks(): string[] {
    const currentList = this.currentListSubject.value;
    const lists = this.listsSubject.value;
    return currentList && lists[currentList] ? lists[currentList] : [];
  }
}