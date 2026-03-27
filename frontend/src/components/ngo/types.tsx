export interface EventType {
    _id: string
    name: string
    date: string | Date
    address: string
    registrations?: number
    ngo?: string
    tags: string[]
}
