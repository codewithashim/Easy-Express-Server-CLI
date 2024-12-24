import { Schema, model } from 'mongoose';
import { IProfile, ProfileModel } from './profile.interface';

const ProfileSchema = new Schema<IProfile>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        firstName: {
            type: String,
            required: true,
            trim: true,
        },
        lastName: {
            type: String,
            required: true,
            trim: true,
        },
        profileImage: {
            type: String,
        },
        bio: {
            type: String,
            maxlength: 500,
        },
        dateOfBirth: {
            type: Date,
        },
        gender: {
            type: String,
            enum: ['male', 'female', 'other'],
        },
        address: {
            street: String,
            city: String,
            state: String,
            country: String,
            postalCode: String,
        },
    },
    {
        timestamps: true,
        toJSON: {
            virtuals: true,
        },
    }
);


ProfileSchema.virtual('fullName').get(function (this: IProfile) {
    return `${this.firstName} ${this.lastName}`;
});


ProfileSchema.methods.getFullName = function (this: IProfile): string {
    return `${this.firstName} ${this.lastName}`;
};

ProfileSchema.index({ user: 1 });

export const Profile = model<IProfile, ProfileModel>('Profile', ProfileSchema);