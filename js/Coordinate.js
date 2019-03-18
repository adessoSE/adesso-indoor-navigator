export default class Coordinate {
    constructor({x, y}) {
        this.x = x;
        this.y = y;
    }

    distanceTo(otherCoordinate) {
        const vectorToOtherCoordinate = this.vectorTo(otherCoordinate);
        const distance = Math.sqrt(vectorToOtherCoordinate.reduce((prev, curr) => prev + Math.pow(curr, 2), 0));
        return distance;
    }

    vectorTo(otherCoordinate) {
        return [
            otherCoordinate.x - this.x,
            otherCoordinate.y - this.y,
        ];
    }

    rotateClockwiseAroundOriginBy(angle) {
        let newX = this.x * Math.cos(angle) + this.y * Math.sin(angle);
        let newY = this.y * Math.cos(angle) - this.x * Math.sin(angle);

        return new Coordinate({
            x: newX,
            y: newY
        });
    }

    rotateCounterClockwiseAroundOriginBy = (angle) => this.rotateClockwiseAroundOriginBy(-angle);

    scaleBy(factor) {
        return new Coordinate({
            x: this.x * factor,
            y: this.y * factor
        });
    }

    moveBy({x, y}) {
        return new Coordinate({
            x: this.x + x,
            y: this.y + y
        });
    }
}