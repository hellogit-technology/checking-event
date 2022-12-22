import { Schema, model } from 'mongoose';

const ScoresSchema = new Schema(
  {
    event: [
      {
        scores: { type: String, maxlength: 3 },
        event: { type: Schema.Types.ObjectId, ref: 'Event' }
      }
    ],
    attitude: [
      {
        scores: { type: String, maxlength: 3 },
        club: { type: Schema.Types.ObjectId, ref: 'Club' }
      }
    ],
    totalEvent: { type: Number, max: 1000 },
    totalAttitude: { type: Number, max: 1000 },
    month: { type: Number, max: 12, required: true },
    student: { type: Schema.Types.ObjectId, required: true, ref: 'Student' },
    system: { type: Date },
    editor: {
      userId: { type: Schema.Types.ObjectId },
      role: { type: Number }
    },
    historyEdit: [
      {
        userId: { type: Schema.Types.ObjectId },
        role: { type: Number }
      }
    ]
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export default model('Scores', ScoresSchema, 'scores');
