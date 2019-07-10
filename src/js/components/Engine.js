import Helpers from './Helpers.js'

export default class Engine {
    constructor () {
        this.initCanvas()
        this.initScene()
        this.initLoadingManager()
        this.addEventListeners()
    }

    initCanvas () {
        this.canvas = document.querySelector(".canvas")
        this.setSize()
    }

    setSize () {
        this.width = this.canvas.width = window.innerWidth
        this.height = this.canvas.height = window.innerHeight
    }

    initScene () {
        // scene
        this.scene = new THREE.Scene()

        // camera
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.01, 10000)
        this.camera.rotation.set( -1.5, -5, 0);
        this.camera.position.z = 1000;

        // clock
        this.clock = new THREE.Clock()
        this.timeDelta = 0
        this.timeElapsed = 0

        // helpers
        this.helpers = new Helpers(this.scene, this.camera, this.canvas)

        // mouse
        this.mouse = new THREE.Vector3(0, 0, 0)

        // renderer
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas})
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setClearColor(0x25315a, 1)
    }

    initLoadingManager () {
        this.manager = new THREE.LoadingManager()
        this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
            // console.log('Started loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
        }
        this.manager.onLoad = () => {
            // console.log('Loading complete!')
        }
        this.manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            // console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
        }
        this.manager.onError = (url) => {
            // console.log('There was an error loading ' + url)
        }
    }

    addEventListeners () {
        window.addEventListener('resize', () => this.resize())
        document.addEventListener( 'mousemove', (e) => this.onDocumentMouseMove(e), false );
        document.addEventListener( 'touchstart', (e) => this.onDocumentTouchStart(e), false );
        document.addEventListener( 'touchmove', (e) => this.onDocumentTouchStart(e), false );
    }

    resize () {
        this.setSize()

        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()

        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }

    onDocumentMouseMove(e) {
        this.mouse.x = e.clientX - window.innerWidth/2
        this.mouse.y = e.clientY - window.innerHeight/2
    }

    onDocumentTouchStart(e) {
        if (e.touches.length === 1) {
            e.preventDefault();

            this.mouse.x = e.touches[0].pageX - window.innerWidth/2
            this.mouse.y = e.touches[0].pageY - window.innerHeight/2
        }
    }

    lerp (a, b, n) {
        return (1 - n) * a + n * b
    }
}
