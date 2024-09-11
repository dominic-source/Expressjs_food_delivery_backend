import mongoose from "mongoose";

const { Schema } = mongoose;

const locationschema = new Schema({
  name: String,
  longitude: String,
  latitude: String
});

const lgaSchema = new Schema({
  name: String,
});

const stateSchema = new Schema({
  name: String,
  lga: [lgaSchema]
});

const countrySchema = new Schema({
  name: String,
  state: [stateSchema]
});

export const locationSchema = locationschema;
export const address = mongoose.model('Location', locationschema);
export const lga = mongoose.model('Lga', lgaSchema);
export const State = mongoose.model('State', stateSchema);
export const Country = mongoose.model('Country', countrySchema);
