import { model, Schema, Types, type InferSchemaType } from "mongoose";


const TodoSchema: Schema = new Schema(
  {
    title: { 
        type: String, 
        required: true,
        minLength : 3,
        maxLength : 50
    },
    description: { 
        type: String, 
        required: true,
        minLength : 3,
        maxLength : 200
    },
    status: {
        type:Boolean,
        default:false
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    }
  },
  { timestamps: true }
);
type Todo = InferSchemaType<typeof TodoSchema>;

export default model<Todo>("Todo", TodoSchema);
