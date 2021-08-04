//default values
import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
import { MeshLine } from 'three.meshline';

var OPTIONS = {
    trail: 5,
    chunkLength: 50,
    speed: 1,
    altitude: 0,
    interactive: false
};

const MAX_POINTS = 1000;

/**
 * custom component
 * */

class LineTrail extends BaseObject {
    constructor(lineString, options, material, layer) {
        options = maptalks.Util.extend({}, OPTIONS, options, { layer, lineString });
        super();
        //Initialize internal configuration
        // https://github.com/maptalks/maptalks.three/blob/1e45f5238f500225ada1deb09b8bab18c1b52cf2/src/BaseObject.js#L135
        this._initOptions(options);

        const { altitude, chunkLength, speed, trail } = options;
        const chunkLines = lineSlice(lineString, chunkLength);


        const centerPt = layer.coordinateToVector3(lineString.getCenter());
        //cache position for  faster computing,reduce double counting
        const positionMap = {};
        for (let i = 0, len = chunkLines.length; i < len; i++) {
            const chunkLine = chunkLines[i];
            for (let j = 0, len1 = chunkLine.length; j < len1; j++) {
                const lnglat = chunkLine[j];
                const key = lnglat.join(',').toString();
                if (!positionMap[key]) {
                    positionMap[key] = layer.coordinateToVector3(lnglat).sub(centerPt);
                }
            }
        }

        const positions = getChunkLinesPosition([chunkLines[0]], layer, positionMap, centerPt).positions;
        const geometry = new THREE.BufferGeometry();
        const ps = new Float32Array(MAX_POINTS * 3); // 3 vertices per point
        geometry.setAttribute('position', new THREE.BufferAttribute(ps, 3).setUsage(true));
        setLineGeometryAttribute(geometry, positions);
        this._createLine(geometry, material);

        //set object3d position
        const z = layer.distanceToVector3(altitude, altitude).x;

        const center = lineString.getCenter();
        const v = layer.coordinateToVector3(center, z);
        this.getObject3d().position.copy(v);

        this._params = {
            trail: Math.max(1, trail),
            index: 0,
            len: chunkLines.length,
            chunkLines,
            layer,
            speed: Math.min(1, speed),
            idx: 0,
            positions: [],
            positionMap,
            centerPt
        };
        // this._init();
    }


    _init() {
        const { len, chunkLines, layer, trail, positionMap, centerPt } = this._params;
        for (let i = 0; i < len; i++) {
            const result = chunkLines.slice(i, i + trail);
            const ps = getChunkLinesPosition(result, layer, positionMap, centerPt).positions;
            this._params.positions[i] = ps;
        }
    }


    _animation() {
        const { index, positions, idx, speed, len, chunkLines, layer, trail, positionMap, centerPt } = this._params;
        const i = Math.round(index);
        if (i > idx) {
            this._params.idx++;
            let ps = positions[i];
            if (!ps) {
                const result = chunkLines.slice(i, i + trail);
                ps = getChunkLinesPosition(result, layer, positionMap, centerPt).positions;
                this._params.positions[i] = ps;
            }
            setLineGeometryAttribute(this.getObject3d().geometry, ps);
            this.getObject3d().geometry.attributes.position.needsUpdate = true;
        }
        if (index >= len) {
            this._params.index = -1;
            this._params.idx = -1;
        }
        this._params.index += speed;
    }
}

export default LineTrail