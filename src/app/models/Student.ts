import { Schema, model } from 'mongoose';

const StudentSchema = new Schema(
  {
    fullname: { type: String, maxlength: 50, required: true },
    schoolId: { type: String, maxlength: 30, required: true, unique: true },
    email: { type: String, maxlength: 100, required: true, unique: true },
    campus: { type: Schema.Types.ObjectId, required: true, ref: 'Campus' },
    club: [{ type: Schema.Types.ObjectId, ref: 'Club' }],
    editor: { type: Schema.Types.ObjectId, required: true, ref: 'AdminAccount' }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export default model('Student', StudentSchema, 'student');
