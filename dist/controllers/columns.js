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
exports.updateColumn = exports.deleteColumn = exports.createColumn = exports.getColumns = void 0;
const column_1 = __importDefault(require("../models/column"));
const socketEvents_enum_1 = require("../types/socketEvents.enum");
const helpers_1 = require("../src/helpers");
const getColumns = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.sendStatus(401);
        }
        const columns = yield column_1.default.find({ boardId: req.params.boardId });
        res.send(columns);
    }
    catch (err) {
        next(err);
    }
});
exports.getColumns = getColumns;
const createColumn = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsCreateFailure, "User is not authorized");
            return;
        }
        const newColumn = new column_1.default({
            title: data.title,
            boardId: data.boardId,
            userId: socket.user.id,
        });
        const savedColumn = yield newColumn.save();
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.columnsCreateSuccess, savedColumn);
    }
    catch (err) {
        socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsCreateFailure, (0, helpers_1.getErrorMessage)(err));
    }
});
exports.createColumn = createColumn;
const deleteColumn = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsDeleteFailure, "User is not authorized");
            return;
        }
        yield column_1.default.deleteOne({ _id: data.columnId });
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.columnsDeleteSuccess, data.columnId);
    }
    catch (error) {
        socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsDeleteFailure, (0, helpers_1.getErrorMessage)(error));
    }
});
exports.deleteColumn = deleteColumn;
const updateColumn = (io, socket, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!socket.user) {
            socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsUpdateFailure, "User is not authorized");
            return;
        }
        const updatedColumn = yield column_1.default.findByIdAndUpdate(data.columnId, data.fields, { new: true });
        io.to(data.boardId).emit(socketEvents_enum_1.SocketEventsEnum.columnsUpdateSuccess, updatedColumn);
    }
    catch (err) {
        socket.emit(socketEvents_enum_1.SocketEventsEnum.columnsUpdateFailure, (0, helpers_1.getErrorMessage)(err));
    }
});
exports.updateColumn = updateColumn;
//# sourceMappingURL=columns.js.map