export interface Driver {
    id: number;
    name: string;
    lat: number;
    lng: number;
    status: "online" | "offline";
}