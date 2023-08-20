import { NextFunction, Response } from "express";
import BoardModel from "../models/board";
import { ExpressRequestInterface } from "../types/expressRequest.interface";
import { Server } from "socket.io";
import { SocketEventsEnum } from "../types/socketEvents.enum";
import { getErrorMessage } from "../src/helpers";
import { Socket } from "../types/socket.interface";

export const getBoards = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const boards = await BoardModel.find();
    res.send(boards);
  } catch (error) {
    next(error);
  }
};

export const getSingleBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const board = await BoardModel.findById(req.params.boardId);
    res.send(board);
  } catch (error) {
    next(error);
  }
};

export const createBoard = async (
  req: ExpressRequestInterface,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const newBoard = new BoardModel({
      title: req.body.title,
      userId: req.user.id,
    });
    const savedBoard = await newBoard.save();
    res.send(savedBoard);
  } catch (error) {
    next(error);
  }
};

export const joinBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
) => {
  socket.join(data.boardId);
};

export const leaveBoard = (
  io: Server,
  socket: Socket,
  data: { boardId: string }
) => {
  socket.leave(data.boardId);
};

export const updateBoard = async (
  io: Server,
  socket: Socket,
  data: { boardId: string; fields: { title: string } }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.boardsUpdateFailure,
        "User is not authorized"
      );
      return;
    }
    const updatedBoard = await BoardModel.findByIdAndUpdate(
      data.boardId,
      data.fields,
      { new: true }
    );
    io.to(data.boardId).emit(
      SocketEventsEnum.boardsUpdateSuccess,
      updatedBoard
    );
  } catch (error) {
    socket.emit(SocketEventsEnum.boardsUpdateFailure, getErrorMessage(error));
  }
};

export const deleteBoard = async (
  io: Server,
  socket: Socket,
  data: { boardId: string }
) => {
  try {
    if (!socket.user) {
      socket.emit(
        SocketEventsEnum.boardsDeleteFailure,
        "User is not authorized"
      );
      return;
    }
    await BoardModel.deleteOne({ _id: data.boardId });
    io.to(data.boardId).emit(SocketEventsEnum.boardsDeleteSuccess);
  } catch (error) {
    socket.emit(SocketEventsEnum.boardsDeleteFailure, getErrorMessage(error));
  }
};
