import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

import ATSAnalysis from "./server/models/ATSAnalysis.js";

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");
  
  const analyses = await ATSAnalysis.find({});
  console.log("Total analyses:", analyses.length);
  
  process.exit(0);
}
run();
