import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { accessTodos } from '../dataLayer/accessTodos'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new accessTodos ()


export async function getAllTodos(userId:string): Promise<TodoItem[]> {
    return todoAccess.getAllTodos(userId)
  }//
  
  export async function createGroup(CreateTodoRequest: CreateTodoRequest,jwtToken: string): Promise<TodoItem> {
  
    const todoId = uuid.v4()
    const userId = parseUserId(jwtToken)
  
    return await todoAccess.createTodo({
      todoId: todoId,
      userId: userId,
      name: CreateTodoRequest.name,
      dueDate: CreateTodoRequest.dueDate,
      createdAt: new Date().toISOString(),
      done: false,
      attachmentUrl: 'no URL'
    })
  }//


export async function updateTodo(){
//call todoAccess.update
}


export async function deleteTodo(){
    //call todoAccess.delete
    }

 

  
  

