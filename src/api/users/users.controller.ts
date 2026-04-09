import { Context } from "hono";
import {
  createUserService,
  deleteUserService,
  getUserByIdService,
  getUsersService,
  isEmailExistsService,
  isUsernameExistsService,
  updateUserService,
} from "./users.services.js";
import { PatchUser, PatchUserSchema, PostUser, PostUserSchema } from "./users.model.js";
import { hash } from 'bcrypt-ts';
import { ZodError } from "zod";

export async function getUsers(c: Context) {
  try {
    const page = Number(c.req.query('page')) || 1;
    const limit = Number(c.req.query('limit')) || 10;
  
    if (isNaN(page) || isNaN(limit)) {
      return c.json({ error: 'Invalid page or limit' }, 400);
    }
  
    const users = await getUsersService(page, limit);
    return c.json(users);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get users';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function getUserById(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }
  
    const user = await getUserByIdService(id);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
  
    return c.json(user);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to get user by id';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function createUser(c: Context) {
  try {
    const payload = PostUserSchema.parse(await c.req.json<PostUser>());

    if (await isUsernameExistsService(payload.username)) {
      return c.json({ error: 'Username already exists' }, 400);
    }

    if (await isEmailExistsService(payload.email)) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    const hashedPassword = await hash(payload.password, 12);
    
    const body = {
      ...payload,
      password: hashedPassword,
      ...(payload.id ? { id: payload.id } : { id: crypto.randomUUID() }),
    } satisfies PostUser;

    const result = await createUserService(body);
    return c.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function updateUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }
    
    const payload = PatchUserSchema.parse(await c.req.json<PatchUser>());

    if (payload.username && await isUsernameExistsService(payload.username)) {
      return c.json({ error: 'Username already exists' }, 400);
    }

    if (payload.email && await isEmailExistsService(payload.email)) {
      return c.json({ error: 'Email already exists' }, 400);
    }

    const body = {
      ...payload,
      updated_at: new Date().toISOString(),
    };
    const result = await updateUserService(id, body);
    return c.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return c.json({ error: 'Validation failed', details: error.issues }, 400);
    }
    const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function deleteUser(c: Context) {
  try {
    const id = c.req.param('id');
    if (!id) {
      return c.json({ error: 'User ID is required' }, 400);
    }
    const result = await deleteUserService(id);
    return c.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function isUsernameExists(c: Context) {
  try {
    const username = c.req.param('username');
    if (!username) {
      return c.json({ error: 'Username is required' }, 400);
    }
    const result = await isUsernameExistsService(username);
    return c.json({
      exists: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to check if username exists';
    return c.json({ error: errorMessage }, 500);
  }
}

export async function isEmailExists(c: Context) {
  try {
    const email = c.req.param('email');
    if (!email) {
      return c.json({ error: 'Email is required' }, 400);
    }
    const result = await isEmailExistsService(email);
    return c.json({
      exists: result,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to check if email exists';
    return c.json({ error: errorMessage }, 500);
  }
}