// auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: string
        username: string
        email: string
        picture: string
    }

    interface UserSession {
        // Add your own fields
    }
}

export { }