// Sound stuf

/* création du contexte audio sur lequel on crée un graphe audio */
window.AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext)
let audioCtx = new AudioContext();

let analyser = audioCtx.createAnalyser();
analyser.smoothingTimeConstant = 0.9;

let audioBuffer = null;
let audioSource = null;

let bufferLength = analyser.frequencyBinCount; //bufferLength
let frequencyData = new Uint8Array(bufferLength); //// Uint8Array: tableau pour stocker des nombres flottants à simple précision de 32 bits, qui ne peuvent pas être stockées dans un simple tableau javascript.

// Three.js stuf
let espacement = 30;
let totalParticulesX = 32; //32 bit
let totalParticulesY = 32; //32 bit
let totalParticulesZ = 1;

let container, stats;
let camera, scene, renderer;
let controls;

let particles, particle, acceleration = 0;

let mouseX = 0, mouseY = 0;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;


init();
animate();
loadSound();
	
	function init() {
		container = document.createElement( 'div' );
		document.body.appendChild( container );

		//scene
		scene = new THREE.Scene();

		// camera
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );
		camera.rotation.set( -1.5, -5, 0);
		camera.position.z = 1000;

		//particles
		particles = new Array();

		let PI2 = Math.PI * 2;

		var program = function (ctx) {

			ctx.beginPath();

			// circles
			//ctx.arc( 0, 0, 0.3, 0, PI2, true);
			//ctx.fill();

			// lines
			ctx.moveTo(0, 0);
			ctx.lineTo(0, 0.2);
			ctx.stroke();
		}


		var i = 0;
		let geometry = new THREE.Geometry();
		let colors = [];
		
		let sizeGeometryX = totalParticulesX * espacement;
		let sizeGeometryY = totalParticulesY * espacement;

		for (var ix = 0; ix < totalParticulesX; ix ++) {

			for (var iy = 0; iy < totalParticulesY; iy++) {

				colors[i] = new THREE.Color(0xFFF2CE);
				colors[i].setRGB( ix / totalParticulesX, 0.5, 0.8); 

				material = new THREE.SpriteCanvasMaterial( {
					color: colors[i],
					program: program
				});

				particle = particles[i ++] = new THREE.Sprite(material);
				particle.position.x = ix * espacement - (sizeGeometryX/2);
				particle.position.z = iy * espacement - (sizeGeometryY/2);
				//particle.position.normalize();
				//particle.position.multiplyScalar( Math.random() * 10 + 450 );
				particle.scale.x = particle.scale.y = 4;
				scene.add(particle);
				geometry.vertices.push(particle.position);

			}

		}

		// lines 
		/*
		let line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0xFFF2CE, opacity: 0.5, linewidth: 0.5 }));
		scene.add(line);*/

		// CanvasRenderer
		renderer = new THREE.CanvasRenderer();
		renderer.setClearColor(0x25315a, 1);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(renderer.domElement);

		// stats
		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		container.appendChild(stats.domElement);

		// controls
		controls = new THREE.OrbitControls(camera, renderer.domElement);

		// events
		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'touchstart', onDocumentTouchStart, false );
		document.addEventListener( 'touchmove', onDocumentTouchMove, false );

		window.addEventListener( 'resize', onWindowResize, false );
	}

	function loadSound() {

		let xhr = new XMLHttpRequest();
		xhr.open( 'GET', 'sounds/ChinaTown.mp3', true ); //DannyOcean-MeRehúso or Monkeys or MonkeysCut
		xhr.responseType = 'arraybuffer';

		xhr.onload = function(payload) {

			let bufferFromXhr = xhr.response;

			audioCtx.decodeAudioData(bufferFromXhr, function(buffer) {

			  // récupère les données de la requete depuis le callback buffer
			  audioBuffer = buffer;

			  // audioNote
			  audioSource = audioCtx.createBufferSource();
			  audioSource.buffer = audioBuffer;

			  /* connecter la source et l'analyser*/
			  audioSource.connect(analyser);

			  /* rajouter les filtres ici après l'anayser */
			  let waveDistorsion = audioCtx.createWaveShaper(); // gives a warm effect
			  analyser.connect(waveDistorsion);

			  /* connecter l'analyser et la destination */
			  analyser.connect(audioCtx.destination);

			  audioSource.start();

			});

		}

		xhr.onerror = function(err) {
			console.log(err);
		}

		xhr.send()

	}

	function aleatoire(number1, number2) {
      return number1 + (Math.floor(Math.random() * (number2 - number1)) + 1);
    }

	function onWindowResize() {
		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );
	}

	function onDocumentMouseMove(event) {
		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;
	}

	function onDocumentTouchStart(event) {
		if (event.touches.length === 1) {
			event.preventDefault();

			mouseX = event.touches[ 0 ].pageX - windowHalfX;
			mouseY = event.touches[ 0 ].pageY - windowHalfY;
		}
	}

	function onDocumentTouchMove(event) {
		if ( event.touches.length === 1 ) {
			event.preventDefault();

			mouseX = event.touches[0].pageX - windowHalfX;
			mouseY = event.touches[0].pageY - windowHalfY;
		}
	}

	function animate() {

		requestAnimationFrame( animate );

		render();
		stats.update();
		controls.update();

	}

	function render() {

		camera.lookAt(scene.position);
		//camera.position.x += ( mouseX - camera.position.x ) * .05;
		camera.position.y += ( - mouseY + 200 - camera.position.y ) * .05;

		var i = 0;
		var cPosition; 

		for (var ix = 0; ix < frequencyData[i]; ix ++) {

			for (var iy = 0; iy < frequencyData[i]; iy ++) {

				for (var iz = 0; iz < frequencyData[i]; iz++) {

					particle = particles[i++];
					cPosition =  (Math.sin((ix + acceleration) * 0.6) * 20) * (frequencyData[ix]/128);
					cPosition += (Math.sin((iy + acceleration) * 0.6) * 20) * (frequencyData[iy]/128);
					cPosition += (Math.sin((iz + acceleration) * 0.6) * 20) * (frequencyData[iz]/128);
					particle.position.y += (cPosition - particle.position.y) * 0.2
					particle.scale.x = particle.scale.y = (Math.sin((ix + acceleration) * 0.3) + 1) * 4 + (Math.sin((iy + acceleration) * 0.5) + 1) * 4;
					
				}

			}

		}

		renderer.render( scene, camera );

		acceleration += 0.05;
		analyser.getByteFrequencyData(frequencyData);
	}

