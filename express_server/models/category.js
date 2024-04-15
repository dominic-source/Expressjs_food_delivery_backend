import mongoose from  "mongoose";
import { productSchema } from "./product";

const { Schema } = mongoose;

const categorySchema = new Schema({
  name: String,
  products: [productSchema]
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;