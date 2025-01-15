export class SnowflakeID {
    constructor(epoch) {
        this.epoch = BigInt(epoch || 1609459200000); // Data de referência
        this.nodeId = BigInt(1);
        this.sequence = BigInt(0);
    }

    generateId() {
        const timestamp = BigInt(Date.now()) - this.epoch;
        const nodeIdShifted = this.nodeId << BigInt(12);
        const id = (timestamp << BigInt(22)) | nodeIdShifted | this.sequence;

        this.sequence = (this.sequence + BigInt(1)) & BigInt(0xfff);
        return id.toString();
    }
}