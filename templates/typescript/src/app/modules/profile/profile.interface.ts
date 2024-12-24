import { Model, Types } from 'mongoose';

type IAdress = {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

export type IProfile = {
    user: Types.ObjectId;
    firstName: string;
    lastName: string;
    fullName: string;
    profileImage?: string;
    bio?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
    address?: IAdress;
};

export type IProfileMethods = {
    getFullName(): string;
};

export type ProfileModel = Model<IProfile, Record<string, unknown>, IProfileMethods>;