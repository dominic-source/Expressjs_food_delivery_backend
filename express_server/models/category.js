import mongoose from  "mongoose";
import { productSchema } from "./product";

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;