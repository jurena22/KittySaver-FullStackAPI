export interface MessageModel {
    rules?: boolean;
    _id?: string;
    sender: string | {name: string, _id:string},
    messageText: string,
    opened?: boolean
}