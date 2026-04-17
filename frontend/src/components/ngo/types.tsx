export interface EventType {
    _id: string
    name: string
    date: Date
    address: string
    status?: string
    registrations?: number
    ngo?: string
    tags: string[]
}
