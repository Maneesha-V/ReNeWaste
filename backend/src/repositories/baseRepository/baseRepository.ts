import {
  Model,
  Document,
  FilterQuery,
  UpdateQuery,
  ProjectionType,
} from "mongoose";
import IBaseRepository from "./interface/IBaseRepository";

export default class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string, useLean = false): Promise<any> {
    const query = this.model.findById(id);
    return useLean ? query.lean().exec() : query.exec();
  }

  // async findOne(filter: FilterQuery<T>): Promise<T | null> {
  //   return this.model.findOne(filter);
  // }
  async findOne(
    filter: FilterQuery<T>,
    projection?: ProjectionType<T>,
    useLean = false,
  ): Promise<any> {
    // return await this.model.findOne(filter, projection).exec();
    const query = this.model.findOne(filter, projection);
    return useLean ? query.lean().exec() : query.exec();
  }
  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter);
  }

  async updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async deleteOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOneAndDelete(filter);
  }
}
