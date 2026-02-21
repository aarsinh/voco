export interface EventType {
    _id: string
    name: string
    date: string | Date
    address: string
    registrations?: Number
    ngo?: string
}