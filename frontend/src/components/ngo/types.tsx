export interface EventType {
    _id: string
    name: string
    date: string | Date
    address: string
    status?: string
    registrations?: Number
    ngo?: string
    tags: string[]
}
