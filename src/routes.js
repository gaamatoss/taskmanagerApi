import { Database } from "./middlewares/database.js";
import { randomUUID } from "node:crypto";
import { buildRoutePath } from "./utils/build-route-path.js";

const database = new Database();

export const routes = [
  {
    method: "GET",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { search } = req.query;

      const tasks = database.select("tasks", search ? task : null);
      return res.end(JSON.stringify(tasks));
    },
  },
  {
    method: "POST",
    path: buildRoutePath("/tasks"),
    handler: (req, res) => {
      const { title, description } = req.body;
      const formatedTime = Date.now();
      const today = new Date(formatedTime);
      const task = {
        id: randomUUID(),
        title,
        description,
        completedAt: null,
        createdAt: today.toLocaleDateString(),
        updatedAt: today.toLocaleDateString(),
      };
      database.insert("tasks", task);

      return res.writeHead(201).end();
    },
  },
  {
    method: "DELETE",
    path: buildRoutePath(`/tasks/:id`),
    handler: (req, res) => {
      const { id } = req.params;

      database.delete("tasks", id);

      return res.writeHead(204).end();
    },
  },
  {
    method: "PUT",
    path: buildRoutePath(`/tasks/:id`),
    handler: (req, res) => {
      const { id } = req.params;
      const { title, description } = req.body;
      database.update("tasks", id, title, description, updatedAt);

      return res.writeHead(204).end();
    },
  },
];
