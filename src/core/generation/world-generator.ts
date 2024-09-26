export class WorldGenerator {
    rng: () => number;

    constructor(rng: () => number) {
        this.rng = rng;
    }
}