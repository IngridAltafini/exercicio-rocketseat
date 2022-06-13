const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

/**checar se o projeto existe */
function checkProjectExists(request, response, next) {
  const { id } = request.params;
  const project = projects.find(p => p.id == id);

  if (!project) {
    return response.status(400).json({ error: 'Project not found' });
  }

  return next();
}

/** log no número de requisições */
function logRequests(request, response, next) {
  console.count('Número de requisições');

  return next();
}

server.use(logRequests);

server.get('/projects', (request, response) => {
  return response.json(projects);
});

server.post('/projects', (request, response) => {
  const { id, title } = request.body;

  const project = {
    id,
    title,
    tasks: [],
  };

  projects.push(project);

  return response.json(project);
});

server.put('/projects/:id', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { title } = request.body;

  const project = projects.find(p => p.id == id);

  project.title = title;

  return response.json(project);
});

server.delete('/projects/:id', checkProjectExists, (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex(p => p.id == id);

  projects.splice(projectIndex, 2);

  return response.send();
});

server.post('/projects/:id/tasks', checkProjectExists, (request, response) => {
  const { id } = request.params;
  const { tasks } = request.body;

  const project = projects.find(p => p.id == id);

  project.tasks.push(tasks);

  return response.json(project);
});

server.listen(3000);
