module.exports = function (app) {
  const fs = require("fs");

  function writeData(userList, request) {
    let user = {
      email: request.email,
      password: request.password,
    };
    userList.push(user);
    userList = JSON.stringify(userList);
    fs.writeFile("appFiles/users.json", userList, (err) => {
      if (err) throw err;
      console.log("Data written to file");
    });
    return user;
  }

  app.post("/api/users/register", (req, res) => {
    let request = req.body;
    let userList = [];
    let result = {};
    // validate request null or empty
    if (Object.keys(request).length === 0) {
      result = {
        message: "Error: Request invalido",
        result: "error",
      };
      return res.status(200).json(result);
    }
    fs.readFile("appFiles/users.json", "utf8", (err, data) => {
      if (err) {
        userList = [];
        request = writeData(userList, request);
        result = {
          message: "Success: Usuario registrado correctamente",
          result: "success",
        };
      } else if (data) {
        userList = JSON.parse(data);
        userList.forEach(function (u) {
          if (u.email === request.email) {
            result = {
              message: "Error: Email o usuario ya registrado",
              result: "error",
            };
            console.log(result);
          } else {
            request = writeData(userList, request);
            result = {
              message: "Usuario registrado correctamente",
              result: "success",
            };
          }
        });
      } else {
        request = writeData([], request);
        result = {
          message: "Usuario registrado correctamente",
          result: "success",
        };
      }
      return res.status(200).json(result);
    });
  });

  app.post("/api/users/login", (req, res) => {
    let request = req.body;
    let result = {};
    if (Object.keys(request).length === 0) {
      result = {
        message: "Error: Request invalido",
        result: "error",
      };
      return res.status(200).json(result);
    }
    fs.readFile("appFiles/users.json", "utf8", (err, data) => {
      if (err) {
        result = {
          message: "Error: Request invalido",
          result: "error",
        };
        return res.status(200).json(result);
      } else if (data) {
        const userList = JSON.parse(data);
        const user = userList.find(
          (u) => u.email === request.email && u.password === request.password
        );
        if (user) {
          result = {
            message: "Inicio de sesión correcto",
            result: "success",
            value: user,
          };
        } else {
          result = {
            message: "Error: Credenciales invalidas",
            result: "error",
          };
        }
        return res.status(200).json(result);
      }
    });
  });
};
