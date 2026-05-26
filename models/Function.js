const { v4: uuidv4 } = require('uuid');

let functions = [];

class Function {
  constructor(movieId, roomId, date, time) {
    this.id = uuidv4();
    this.movieId = movieId;
    this.roomId = roomId;
    this.date = date;
    this.time = time;
    this.createdAt = new Date().toISOString();
  }

  static getAll() {
    return functions;
  }

  static getById(id) {
    return functions.find(f => f.id === id);
  }

  static add(fn) {
    functions.push(fn);
    return fn;
  }

  static getLast5() {
    return functions
      .sort((a, b) => {
        const dateA = new Date(`${b.date}T${b.time}`);
        const dateB = new Date(`${a.date}T${a.time}`);
        return dateA - dateB;
      })
      .slice(0, 5);
  }

  static getByDateRange(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return functions.filter(f => {
      const fnDate = new Date(f.date);
      return fnDate >= start && fnDate <= end;
    });
  }

  static update(id, movieId, roomId, date, time) {
    const fn = functions.find(f => f.id === id);
    if (fn) {
      fn.movieId = movieId;
      fn.roomId = roomId;
      fn.date = date;
      fn.time = time;
      fn.updatedAt = new Date().toISOString();
      return fn;
    }
    return null;
  }

  static delete(id) {
    const index = functions.findIndex(f => f.id === id);
    if (index > -1) {
      return functions.splice(index, 1)[0];
    }
    return null;
  }

  static deleteByMovie(movieId) {
    functions = functions.filter(f => f.movieId !== movieId);
  }
}

module.exports = Function;
