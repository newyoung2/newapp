//default values
import * as THREE from "three";
import * as maptalks from "maptalks";
import { BaseObject } from "maptalks.three";
import { MeshLine } from 'three.meshline';

var OPTIONS = {
    altitude: 0,
    speed: 0.01,
    height: 100
};

class ArcLine extends BaseObject {
    constructor(lineString, options, material, layer) {
        super();
        // console.log(material.uniforms)
        this.options = {...options}
        this.options.offset = {x:1,y:1}//material.uniforms.offset.value;
        this.options.clock = new THREE.Clock();
        //geoutil.js getLinePosition
        this.options = maptalks.Util.extend({}, OPTIONS, this.options, { layer, lineString });
        this._initOptions(this.options);
        console.log(this.options)
        const { altitude, height } = this.options;
        
        const points = getArcPoints(lineString, layer.distanceToVector3(height, height).x, layer);
        const geometry = new THREE.Geometry();
        geometry.vertices = points;
        const meshLine = new MeshLine();
        meshLine.setGeometry(geometry);

        const map = layer.getMap();
        const size = map.getSize();

        material.uniforms.resolution.value.set(size.width, size.height);

        const line = new THREE.Mesh(meshLine.geometry, material);
        this._createGroup();
        this.getObject3d().add(line);

        const z = layer.distanceToVector3(altitude, altitude).x;
        const center = lineString.getCenter();
        const v = layer.coordinateToVector3(center, z);
        this.getObject3d().position.copy(v);
    }
   

    _animation() {
        // console.log(this.options.offset.x)
        this.options.offset.x -= this.options.speed * this.options.clock.getDelta();
    }
}

function getArcPoints(lineString, height, layer) {
    const lnglats = [];
    if (Array.isArray(lineString)) {
        lnglats.push(lineString[0], lineString[lineString.length - 1]);
    } else if (lineString instanceof maptalks.LineString) {
        const coordinates = lineString.getCoordinates();
        lnglats.push(coordinates[0], coordinates[coordinates.length - 1]);
    }
    const [first, last] = lnglats;
    let center;
    if (Array.isArray(first)) {
        center = [first[0] / 2 + last[0] / 2, first[1] / 2 + last[1] / 2];
    } else if (first instanceof maptalks.Coordinate) {
        center = [first.x / 2 + last.x / 2, first.y / 2 + last.y / 2];
    }
    const centerPt = layer.coordinateToVector3(lineString.getCenter());
    const v = layer.coordinateToVector3(first).sub(centerPt);
    const v1 = layer.coordinateToVector3(last).sub(centerPt);
    const vh = layer.coordinateToVector3(center, height).sub(centerPt);
    const ellipse = new THREE.CatmullRomCurve3([v, vh, v1], false, 'catmullrom');
    const points = ellipse.getPoints(40);
    // console.log(points)
    return points;
}
  export default ArcLine