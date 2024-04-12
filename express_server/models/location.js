import mongoose from  "mongoose";

const { Schema } = mongoose;

const continentSchema = new Schema({
  name: String,
  country: [countrySchema]
});

const countrySchema = new Schema({
  name: String,
  state: [stateSchema]
});

const stateSchema = new Schema({
  name: String,
  lga: [lgaSchema]
});

const lgaSchema = new Schema({
  name: String,
});

const locationschema = new Schema({
  name: String,
  longitude: String,
  latitude: String
});

export const locationSchema = locationschema;
export const address = mongoose.Model('Location', locationschema);
export const lga = mongoose.Model('Lga', lgaSchema);
export const State = mongoose.Model('State', stateSchema);
export const Country = mongoose.Model('Country', countrySchema);
export const Continent= mongoose.Model('Continent', continentSchema);
