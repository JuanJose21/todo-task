module.exports = function (app) {
  const fs = require("fs");

  function writeData(taskList, request, username) {
    const task = {};
    if (request !== null) {
      taskList.push(request);
    }
    taskList = JSON.stringify(taskList);
    const dir = "appFiles/" + username;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFile(dir + "/tasks.json", taskList, (err) => {
      if (err) {
        throw err;
      }
    });
    return task;
  }

  function setHeader(res) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, DELETE, OPTIONS, PUT"
    );
    return res;
  }

  app.post("/api/entity/task", (req, res) => {
    res = setHeader(res);
    let request = req.body;
    let taskList = [];
    let result = {};
    fs.readFile(
      "appFiles/" + request.email + "/tasks.json",
      "utf8",
      (err, data) => {
        if (err) {
          taskList = [];
          request = writeData(taskList, request, request.email);
          result = {
            message: "Tarea registrada correctamente",
            result: "success",
          };
        } else {
          if (data === "" || data === undefined || data === null) {
            taskList = [];
          } else {
            taskList = JSON.parse(data);
          }
          request = writeData(taskList, request, request.email);
          result = {
            message: "Tarea registrada correctamente",
            result: "success",
          };
        }
        return res.status(200).json(result);
      }
    );
  });

  app.get("/api/entity/task/:id", (req, res) => {
    res = setHeader(res);
    const id = req.params.id;
    let taskList = [];
    let result = {};
    fs.readFile("appFiles/" + id + "/tasks.json", "utf8", (err, data) => {
      if (err) {
        taskList = [];
        result = {
          message: "Error: El usuario no tiene tareas registradas",
          result: "error",
        };
      } else if (data) {
        if (data === "" || data === undefined || data === null) {
          taskList = [];
        } else {
          taskList = JSON.parse(data);
        }
        if (
          taskList !== undefined &&
          taskList !== null &&
          taskList.length > 0 &&
          taskList[0].email === id
        ) {
          result = {
            message: "Tareas del usuario",
            result: "success",
            value: taskList,
          };
        }
      }
      return res.status(200).json(result);
    });
  });

  app.post("/api/entity/delete/task", (req, res) => {
    res = setHeader(res);
    const id = req.body.email;
    const request = req.body;
    let taskList = [];
    let result = {};
    fs.readFile("appFiles/" + id + "/tasks.json", "utf8", (err, data) => {
      if (err) {
        result = {
          message: "Error: El usuario no tiene tareas registradas",
          result: "error",
        };
      } else {
        if (data === "" || data === undefined || data === null) {
          taskList = [];
        } else {
          taskList = JSON.parse(data);
          if (
            taskList !== undefined &&
            taskList !== null &&
            taskList.length > 0
          ) {
            taskList.forEach(function (task) {
              if (task.id === request.id) {
                taskList.splice(taskList.indexOf(task), 1);
              }
            });
            writeData(taskList, null, request.email);
          }
        }
        result = {
          message: "Tarea eliminada correctamente",
          result: "success",
        };
        return res.status(200).json(result);
      }
    });
  });

  app.put("/api/entity/task", (req, res) => {
    res = setHeader(res);
    const id = req.body.email;
    const request = req.body;
    let taskList = [];
    let result = {};
    fs.readFile("appFiles/" + id + "/tasks.json", "utf8", (err, data) => {
      if (err) {
        result = {
          message: "Error: El usuario no tiene tareas registradas",
          result: "error",
        };
      } else {
        if (data === "" || data === undefined || data === null) {
          taskList = [];
        } else {
          taskList = JSON.parse(data);
          if (
            taskList !== undefined &&
            taskList !== null &&
            taskList.length > 0
          ) {
            taskList.forEach(function (task) {
              if (task.id === request.id) {
                taskList[taskList.indexOf(task)] = request;
              }
            });
            writeData(taskList, null, request.email);
          }
        }
        result = {
          message: "Tarea actualizada correctamente",
          result: "success",
        };
        return res.status(200).json(result);
      }
    });
  });
};
