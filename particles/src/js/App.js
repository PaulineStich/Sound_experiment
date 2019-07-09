import Engine from './components/Engine.js'

class App extends Engine {
    constructor () {
        super()

        this.espacement = 30
        this.totalParticulesX = 32 //32 bit
        this.totalParticulesY = 32 //32 bit
        this.acceleration = 0

        this.initParticles()
        this.initSound()
        this.loadSound('./src/assets/sounds/ChinaTown.mp3')
        this.animate()
    }

    initParticles() {
        this.particles = new Array().fill(0)
        let colors = []

        let geometry = new THREE.Geometry()
        let i = 0;

        this.particle = null

        let sizeGeometryX = this.totalParticulesX * this.espacement
        let sizeGeometryY = this.totalParticulesY * this.espacement

        for (let x = 0; x < this.totalParticulesX; x ++) {
            for (let y = 0; y < this.totalParticulesY; y++) {

                colors[i] = new THREE.Color(0xFFF2CE);
                colors[i].setRGB( x / this.totalParticulesX, 0.5, 0.8);

                // create a line
                let geometry = new THREE.BoxGeometry(0.15,0.15,13)
                let material = new THREE.MeshBasicMaterial({
                    color: colors[i],
                })

                this.particle = this.particles[i++] = new THREE.Mesh(geometry, material)
                this.particle.position.x = x * this.espacement - (sizeGeometryX/2);
                this.particle.position.z = y * this.espacement - (sizeGeometryY/2);
                //particle.position.normalze();
                //particle.position.multiplyScalar( Math.random() * 10 + 450 );
                this.particle.scale.x = this.particle.scale.y = 4;
                this.scene.add(this.particle);
                geometry.vertices.push(this.particle.position);
            }
        }
    }

    initSound() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext
        this.audioCtx = new AudioContext();

        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.9;

        this.audioBuffer = null;
        this.audioSource = null;

        this.bufferLength = this.analyser.frequencyBinCount; //bufferLength
        this.frequencyData = new Uint8Array(this.bufferLength); // Uint8Array: tableau pour stocker des nombres flottants à simple précision de 32 bits, qui ne peuvent pas être stockées dans un simple tableau javascript.
    }

    loadSound(url) {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url, true)
        xhr.responseType = 'arraybuffer'

        xhr.onload = () => {
            let bufferFromXhr = xhr.response
            this.audioCtx.decodeAudioData(bufferFromXhr, (buffer) => {
                // récupère les données de la requete depuis le callback buffer
                this.audioBuffer = buffer

                // audioNote
                this.audioSource = this.audioCtx.createBufferSource()
                this.audioSource.buffer = this.audioBuffer

                /* connecter la source et l'analyser*/
                this.audioSource.connect(this.analyser)

                /* rajouter les filtres ici après l'anayser */
                let waveDistorsion = this.audioCtx.createWaveShaper() // gives a warm effect
                this.analyser.connect(waveDistorsion)

                /* connecter l'analyser et la destination */
                this.analyser.connect(this.audioCtx.destination)

                this.audioSource.start()
            })
        }

        xhr.onerror = (err) => {
            console.log(err)
        }

        xhr.send()
    }

    animate () {
        // helpers
        if (this.helpers.stats) this.helpers.stats.begin()
        // if (this.helpers.orbitControls) this.helpers.orbitControls.update()

        // clock
        this.timeDelta = this.clock.getDelta()
        this.timeElapsed = this.clock.getElapsedTime()

        ///////////////
        this.camera.lookAt(this.scene.position)
        this.camera.position.y += ( - this.mouse.y + 200 - this.camera.position.y ) * .05

        let i = 0
        let cPosition = 0

        for (let x = 0; x < this.frequencyData[i]; x ++) {
            for (let y = 0; y < this.frequencyData[i]; y ++) {
                for (let z = 0; z < this.frequencyData[i]; z++) {
                    this.particle = this.particles[i++]
                    cPosition =  (Math.sin((x + this.acceleration) * 0.6) * 20) * (this.frequencyData[x]/128)
                    cPosition += (Math.sin((y + this.acceleration) * 0.6) * 20) * (this.frequencyData[y]/128)
                    cPosition += (Math.sin((z + this.acceleration) * 0.6) * 20) * (this.frequencyData[z]/128)
                    this.particle.position.y += (cPosition - this.particle.position.y) * 0.2
                    this.particle.scale.x = this.particle.scale.y = (Math.sin((x + this.acceleration) * 0.3) + 1) * 4 + (Math.sin((y + this.acceleration) * 0.5) + 1) * 4
                }
            }
        }

        this.acceleration += 0.05
        this.analyser.getByteFrequencyData(this.frequencyData) // update the frequencyData from sound
        ///////////////

        this.renderer.render(this.scene, this.camera)
        requestAnimationFrame(() => this.animate())
    }
}

new App()
