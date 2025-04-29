import { supabase } from './client';
import type { Tables, TablesInsert, TablesUpdate } from './types';

// Board operations
export const createBoard = async (board: TablesInsert<'boards'>) => {
  const { data, error } = await supabase
    .from('boards')
    .insert(board)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getBoards = async (userId: string) => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('user_id', userId);
  
  if (error) throw error;
  return data;
};

export const updateBoard = async (id: string, updates: TablesUpdate<'boards'>) => {
  const { data, error } = await supabase
    .from('boards')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteBoard = async (id: string) => {
  const { error } = await supabase
    .from('boards')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// Task operations
export const createTask = async (task: TablesInsert<'tasks'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert(task)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getTasks = async (boardId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('board_id', boardId);
  
  if (error) throw error;
  return data;
};

export const updateTask = async (id: string, updates: TablesUpdate<'tasks'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateTaskStatus = async (id: string, status: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteTask = async (id: string) => {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
};

// User operations
export const createUser = async (user: TablesInsert<'users'>) => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const getUser = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();
  
  if (error) throw error;
  return data;
}; 