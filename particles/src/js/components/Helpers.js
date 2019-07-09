export default class Helpers {
    constructor (scene, camera, canvas) {
        this.scene = scene
        this.camera = camera
        this.canvas = canvas

        // this.initStats()
        // this.initAxes()
        // this.initOrbitControls()
        // this.initGrid(50, 50)
    }

    initStats () {
        this.stats = new Stats()
        document.body.appendChild(this.stats.dom)
    }

    initAxes () {
        this.axesHelper = new THREE.AxesHelper(2)
        this.scene.add(this.axesHelper)
    }

    initOrbitControls () {
        this.orbitControls = new THREE.OrbitControls(this.camera, this.canvas)
    }

    initGrid (size, divisions) {
        this.gridHelper = new THREE.GridHelper(size, divisions)
        this.scene.add(this.gridHelper)
    }
}
