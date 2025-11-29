declare interface USBDevice {
    productId: Key | null | undefined;
    configuration: USBConfiguration | null;
    productName?: string;
    manufacturerName?: string;
    serialNumber?: string;
    opened: boolean;
  
    open(): Promise<void>;
    close(): Promise<void>;
    claimInterface(interfaceNumber: number): Promise<void>;
    selectConfiguration(configurationValue: number): Promise<void>;
  
    transferOut(endpointNumber: number, data: BufferSource): Promise<USBOutTransferResult>;
}
  
interface USBOutTransferResult {
    status: "ok" | "stall" | "babble";
    bytesWritten: number;
}
  
interface Navigator {
    usb: {
      requestDevice(options: { filters: Array<{ vendorId?: number }> }): Promise<USBDevice>;
      getDevices(): Promise<USBDevice[]>;
    };
}  