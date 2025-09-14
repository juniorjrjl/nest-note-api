export interface UserDetail {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserInsert {
    name: string;
    email: string;
    password: string;
}

export interface UserInserted {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserUpdate {
    id: string;
    tokenId: string
    name: string;
    email: string;
}

export interface UserUpdateProps {
    name: string
    email: string
}

export interface UserUpdated {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserUpdatePassword {
    id: string;
    tokenId: string;
    oldPassword: string;
    newPassword: string;
}
