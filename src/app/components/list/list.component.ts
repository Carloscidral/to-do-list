import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskService } from '../../services/task.service';
import { ListsData } from '../../models/task.model';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  newTask = '';
  newListName = '';
  lists: ListsData = {};
  currentList: string | null = null;
  currentListTasks: string[] = [];
  
  // Estados de edição
  editingTask: { listName: string; index: number } | null = null;
  editingList: string | null = null;
  editTaskText = '';
  editListText = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    // Inscrever-se para mudanças nas listas
    this.taskService.lists$.subscribe((lists: ListsData) => {
      this.lists = lists;
    });

    // Inscrever-se para mudanças na lista atual
    this.taskService.currentList$.subscribe((currentList: string | null) => {
      this.currentList = currentList;
      this.currentListTasks = this.taskService.getCurrentListTasks();
    });
  }

  // Adicionar nova tarefa
  addTask(): void {
    const result = this.taskService.addTask(this.newTask);
    if (result.success) {
      this.newTask = '';
      this.currentListTasks = this.taskService.getCurrentListTasks();
    } else {
      alert(result.message);
    }
  }

  // Adicionar nova lista
  addList(): void {
    const result = this.taskService.addList(this.newListName);
    if (result.success) {
      this.newListName = '';
    } else {
      alert(result.message);
    }
  }

  // Selecionar lista
  selectList(listName: string): void {
    this.taskService.selectList(listName);
  }

  // Iniciar edição de tarefa
  startEditTask(listName: string, index: number): void {
    this.editingTask = { listName, index };
    this.editTaskText = this.lists[listName][index];
  }

  // Salvar edição de tarefa
  saveTaskEdit(): void {
    if (this.editingTask) {
      const result = this.taskService.editTask(
        this.editingTask.listName, 
        this.editingTask.index, 
        this.editTaskText
      );
      if (result.success) {
        this.editingTask = null;
        this.editTaskText = '';
        this.currentListTasks = this.taskService.getCurrentListTasks();
      } else {
        alert(result.message);
      }
    }
  }

  // Cancelar edição de tarefa
  cancelTaskEdit(): void {
    this.editingTask = null;
    this.editTaskText = '';
  }

  // Remover tarefa
  removeTask(listName: string, index: number): void {
    this.taskService.removeTask(listName, index);
    this.currentListTasks = this.taskService.getCurrentListTasks();
  }

  // Iniciar edição de lista
  startEditList(listName: string): void {
    this.editingList = listName;
    this.editListText = listName;
  }

  // Salvar edição de lista
  saveListEdit(): void {
    if (this.editingList) {
      const result = this.taskService.editListName(this.editingList, this.editListText);
      if (result.success) {
        this.editingList = null;
        this.editListText = '';
      } else {
        alert(result.message);
      }
    }
  }

  // Cancelar edição de lista
  cancelListEdit(): void {
    this.editingList = null;
    this.editListText = '';
  }

  // Remover lista
  removeList(listName: string): void {
    this.taskService.removeList(listName);
  }

  // Obter nomes das listas
  getListNames(): string[] {
    return Object.keys(this.lists);
  }

  // Verificar se está editando uma tarefa específica
  isEditingTask(listName: string, index: number): boolean {
    return this.editingTask?.listName === listName && this.editingTask?.index === index;
  }

  // Verificar se está editando uma lista específica
  isEditingList(listName: string): boolean {
    return this.editingList === listName;
  }

  // Manipular Enter em campos de input
  onEnterKey(action: string): void {
    switch (action) {
      case 'addTask':
        this.addTask();
        break;
      case 'addList':
        this.addList();
        break;
      case 'saveTask':
        this.saveTaskEdit();
        break;
      case 'saveList':
        this.saveListEdit();
        break;
    }
  }
}