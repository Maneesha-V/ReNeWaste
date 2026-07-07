"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseRepository {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(data) {
        return this.model.create(data);
    }
    async findById(id, useLean = false) {
        const query = this.model.findById(id);
        return useLean ? query.lean().exec() : query.exec();
    }
    // async findOne(filter: FilterQuery<T>): Promise<T | null> {
    //   return this.model.findOne(filter);
    // }
    async findOne(filter, projection, useLean = false) {
        // return await this.model.findOne(filter, projection).exec();
        const query = this.model.findOne(filter, projection);
        return useLean ? query.lean().exec() : query.exec();
    }
    async findAll(filter = {}) {
        return this.model.find(filter);
    }
    async updateOne(filter, update) {
        return this.model.findOneAndUpdate(filter, update, { new: true });
    }
    async deleteOne(filter) {
        return this.model.findOneAndDelete(filter);
    }
}
exports.default = BaseRepository;
