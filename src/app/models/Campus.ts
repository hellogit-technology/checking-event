import { Schema, model } from 'mongoose';

const CampusSchema = new Schema(
  {
    name: { type: String, maxlength: 50, required: true },
    address: [{ type: String, maxlength: 100 }]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export default model('Campus', CampusSchema, 'campus');
