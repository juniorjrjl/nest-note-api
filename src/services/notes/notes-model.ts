export interface NoteList {
    id: string
    title: string
    createdAt: Date
    updatedAt: Date
}

export interface NoteAuthorList {
    id: string
    title: string
    createdAt: Date
    updatedAt: Date
}

export interface NoteDetail {
    id: string
    title: string
    body: string
    createdAt: Date
    updatedAt: Date
}

export interface NoteInsert {
    title: string
    body: string
    author: string
}

export interface NoteInserted {
    id: string
    title: string
    body: string,
    author: {
        id: string,
        name: string
    },
    createdAt: Date
    updatedAt: Date
}

export interface NoteUpdate {
    id: string
    title: string
    body: string

}

export interface NoteUpdated {
    id: string
    title: string
    body: string,
    author: {
        id: string,
        name: string
    },
    createdAt: Date
    updatedAt: Date
}
