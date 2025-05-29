import { FilterQuery, ProjectionType, UpdateQuery } from "mongoose";

export default interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string, useLean?: boolean): Promise<any>;
  // findOne(filter: FilterQuery<T>): Promise<T | null>;
  findOne(filter: FilterQuery<T>, projection?: ProjectionType<T>, useLean?: boolean): Promise<T | Record<string, any> | null>;
  findAll(filter?: FilterQuery<T>): Promise<T[]>;
  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<T | null>;
  deleteOne(filter: FilterQuery<T>): Promise<T | null>;
  countDocuments(filter?: FilterQuery<T>): Promise<number>;
}
