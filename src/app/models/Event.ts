import { Schema, model } from 'mongoose';

const EventSchema = new Schema(
  {
    eventId: { type: String, maxlength: 30, required: true },
    name: { type: String, maxlength: 300, required: true },
    date: { type: Date, required: true },
    club: [{ type: Schema.Types.ObjectId, ref: 'Club' }],
    poster: { type: String, required: true },
    slug: { type: String, maxlength: 300, required: true },
    participant: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    qrcode: { type: String, required: true },
    expire: {type: Boolean, required: true},
    editor: { type: Schema.Types.ObjectId, required: true, ref: 'AdminAccount' }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  }
);

export default model('Event', EventSchema, 'event');
