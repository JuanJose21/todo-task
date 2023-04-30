module.exports = function (app) {
  const fs = require("fs");

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

  function writeData(bookList, request, username) {
    const bookmark = request;
    if (request !== null) {
      bookList.push(bookmark);
    }
    bookList = JSON.stringify(bookList);
    const dir = "appFiles/" + username;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    fs.writeFile(dir + "/bookmarks.json", bookList, (err) => {
      if (err) throw err;
    });
    return bookmark;
  }

  app.post("/api/entity/bookmark", (req, res) => {
    res = setHeader(res);
    let request = req.body;
    let bookList = [];
    let result = {};
    fs.readFile(
      "appFiles/" + request.username + "/bookmarks.json",
      "utf8",
      (err, data) => {
        if (err) {
          bookList = [];
          request = writeData(bookList, request, request.username);
          result = {
            message: "Success: Bookmark added successfully",
            result: "success",
          };
        } else {
          if (data === "" || data === undefined || data === null) {
            bookList = [];
          } else {
            bookList = JSON.parse(data);
          }
          request = writeData(bookList, request, request.username);
          result = {
            message: "Success: Bookmark added successfully",
            result: "success",
          };
        }
        return res.status(200).json(result);
      }
    );
  });

  app.get("/api/entity/bookmark/:id", (req, res) => {
    res = setHeader(res);
    const id = req.params.id;
    let bookList = [];
    let result = {};
    fs.readFile("appFiles/" + id + "/bookmarks.json", "utf8", (err, data) => {
      if (err) {
        bookList = [];
        result = {
          message: "Error: No Bookmark found for the user",
          result: "error",
        };
      } else if (data) {
        if (data === "" || data === undefined || data === null) {
          bookList = [];
        } else {
          bookList = JSON.parse(data);
        }
        if (
          bookList !== undefined &&
          bookList !== null &&
          bookList.length > 0 &&
          bookList[0].username === id
        ) {
          result = {
            message: "Success: User bookmark retrieved successfully",
            result: "success",
            value: bookList,
          };
        }
      }
      return res.status(200).json(result);
    });
  });

  app.post("/api/entity/delete/bookmark", (req, res) => {
    res = setHeader(res);
    const id = req.body.username;
    let request = req.body;
    let bookList = [];
    let result = {};
    fs.readFile("appFiles/" + id + "/bookmarks.json", "utf8", (err, data) => {
      if (err) {
        bookList = [];
        result = {
          message: "Error: No Bookmark found for the user",
          result: "error",
        };
      } else if (data) {
        if (data === "" || data === undefined || data === null) {
          bookList = [];
        } else {
          bookList = JSON.parse(data);
        }
        if (bookList.length > 0) {
          bookList.forEach(function (book) {
            if (book.id === request.id) {
              bookList.splice(bookList.indexOf(book), 1);
            }
          });
          writeData(bookList, null, request.username);
          result = {
            message: "Success: User bookmark removed successfully",
            result: "success",
          };
        }
      }
      return res.status(200).json(result);
    });
  });
};
