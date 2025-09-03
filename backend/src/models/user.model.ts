import { model, Schema, type InferSchemaType } from "mongoose";

const UserSchema: Schema = new Schema(
  {
    username: { 
        type: String, 
        required: true, 
        unique: true ,
        minLength : 3,
        maxLength : 20
    },
    email: { 
        type: String, 
        required: true, 
        unique: true ,
    },
    password: { 
        type: String, 
        required: true ,
    },
    firstName: { 
        type: String, 
        required: true ,
        minLength : 3,
        maxLength : 20
    },
    lastName: { 
        type: String, 
        required: true ,
        minLength : 3,
        maxLength : 20
    },
  },
  { timestamps: true }
);
type User = InferSchemaType<typeof UserSchema>;


export default model<User>("User", UserSchema);
