import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { accessTodos } from '../dataLayer/accessTodos'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'


const todoAccess = new accessTodos ()


export async function getAllTodos(userId:string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId)
  }
  
  export async function createTodo(CreateTodoRequest: CreateTodoRequest,userId: string): Promise<TodoItem> {
  
    const todoId = uuid.v4()
   
  
    const todoItem = {
      todoId: todoId,
      userId: userId,
      name: CreateTodoRequest.name,
      dueDate: CreateTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: 'no URL'
    }
    return await todoAccess.createTodo(todoItem)
  }//


export async function updateTodo(updateTodoRequest: UpdateTodoRequest, userId: string, todoId: string ){//returns an empty body
return await todoAccess.updateTodo(updateTodoRequest,userId, todoId)
}


export async function deleteTodo(userId: string, todoId: string){//returns an empty body
    return await todoAccess.deleteTodo(userId,todoId)
    }


export async function createImageUrl(imageId: string){
  return await todoAccess.createImageUrl(imageId)
}

export async function saveImageUrl(userId: string,todoId: string, imageurl:string){
  return await todoAccess.saveImageUrl(userId, todoId,imageurl)
}
export async function todoExists(userId: string,todoId: string){
  return await todoAccess.todoExists(userId,todoId)
}


export async function userExists(userId: string){
  return await todoAccess.userExists(userId)
}
 

  
  

