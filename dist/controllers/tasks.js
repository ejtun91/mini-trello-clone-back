"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = void 0;
const task_1 = __importDefault(require("../models/task"));
const socketEvents_enum_1 = require("../types/socketEvents.enum");
const helpers_1 = require("../src/helpers");
const getTasks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const tasks = yield task_1.default.find({ boardId: req.params.boardId });
        res.send(tasks);
    }
    catch (error) {
        next(error);
    }
});
exports.getTasks = getTasks;
const createTask = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksCreateFailure, "User is not authorized");
            return;
        }
        const newTask = new task_1.default({
            title: data.title,
            boardId: data.boardId,
            userId: socket.user.id,
            columnId: data.columnId,
        });
        const savedTask = yield newTask.save();
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.tasksCreateSuccess, savedTask);
    }
    catch (err) {
        socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksCreateFailure, (0, helpers_1.getErrorMessage)(err));
    }
});
exports.createTask = createTask;
const updateTask = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksUpdateFailure, "User is not authorized");
            return;
        }
        const updatedTask = yield task_1.default.findByIdAndUpdate(data.taskId, data.fields, { new: true });
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.tasksUpdateSuccess, updatedTask);
    }
    catch (err) {
        socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksUpdateFailure, (0, helpers_1.getErrorMessage)(err));
    }
});
exports.updateTask = updateTask;
const deleteTask = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksDeleteFailure, "User is not authorized");
            return;
        }
        yield task_1.default.deleteOne({ _id: data.taskId });
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.tasksDeleteSuccess, data.taskId);
    }
    catch (error) {
        socket.emit(socketEvents_enum_1.SocketEventsEnum.tasksDeleteFailure, (0, helpers_1.getErrorMessage)(error));
    }
});
exports.deleteTask = deleteTask;
//# sourceMappingURL=tasks.js.map