export interface Task {
  text: string;
  index: number;
}

export interface TodoList {
  name: string;
  tasks: string[];
}

export interface ListsData {
  [listName: string]: string[];
}