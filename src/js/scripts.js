import * as THREE from 'three';
import { GUI } from 'dat.gui';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

const params = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    threshold: 0.5,
    strength: 0.5,
    radius: 0.8,
    idleStrength: 0.5,
    activeStrength: 0.9
};

renderer.outputColorSpace = THREE.SRGBColorSpace;

const renderScene = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
bloomPass.threshold = params.threshold;
bloomPass.strength = params.idleStrength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);

camera.position.set(0, -2, 14);
camera.lookAt(0, 0, 0);

const uniforms = {
    u_time: { type: 'f', value: 0.0 },
    u_frequency: { type: 'f', value: 0.0 },
    u_red: { type: 'f', value: 1.0 },
    u_green: { type: 'f', value: 1.0 },
    u_blue: { type: 'f', value: 1.0 },
    u_freeze: { type: 'bool', value: false } 
};

const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent
});

const geo = new THREE.IcosahedronGeometry(4, 30);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
mesh.material.wireframe = true;

const listener = new THREE.AudioListener();

const audioContext = listener.context;
function checkAndResumeAudioContext() {
    if (audioContext.state === 'suspended') {
        console.log("Resuming suspended audio context...");
        audioContext.resume()
            .then(() => console.log("Audio context resumed successfully"))
            .catch(err => console.error("Failed to resume audio context:", err));
    }
}
setInterval(checkAndResumeAudioContext, 1000);


camera.add(listener);

navigator.mediaDevices.getUserMedia({ audio: true }).then(function (stream) {
    const sound = new THREE.Audio(listener);
    const audioSource = listener.context.createMediaStreamSource(stream);
    sound.setNodeSource(audioSource);

    const analyser = new THREE.AudioAnalyser(sound, 32);
    
    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        mouseX = (e.clientX - windowHalfX) / 100;
        mouseY = (e.clientY - windowHalfY) / 100;
    });

	const statusContainer = document.createElement('div');
	statusContainer.style.position = 'absolute';
	statusContainer.style.top = '20px';
	statusContainer.style.left = '20px';
	statusContainer.style.color = 'white';
	statusContainer.style.zIndex = '1000';
	document.body.appendChild(statusContainer);

    const clock = new THREE.Clock();
    function animate() {
        const averageFrequency = analyser.getAverageFrequency();
        
		fetch('http://localhost:3000/audio-file-exists')
			.then(response => response.json())
			.then(data => {
				statusContainer.innerHTML = '';
				const statusElement = document.createElement('h2');
				statusElement.style.margin = '0';
				statusElement.style.fontFamily = 'Arial, sans-serif';
				statusContainer.appendChild(statusElement);
                
                if(data.exists) {
                    bloomPass.strength = 0.7;
                    bloomPass.threshold = 0.4;
                    bloomPass.radius = 0.8;
                    uniforms.u_red.value = 0.2;
                    uniforms.u_green.value = 1.0;
                    uniforms.u_blue.value = 0.2;
                    uniforms.u_frequency.value = Math.min(0, averageFrequency);;
                    uniforms.u_freeze.value = false;
                }
                else {
                    if (averageFrequency > 30) {
                        bloomPass.strength = 0.9;
                        bloomPass.threshold = 0.34;
                        bloomPass.radius = 0.8;
                        uniforms.u_red.value = 1.0;
                        uniforms.u_green.value = 0.2;
                        uniforms.u_blue.value = 0.2;
                        uniforms.u_frequency.value = averageFrequency;
                        uniforms.u_freeze.value = false;
                    } else {
                        bloomPass.strength = params.idleStrength;
                        bloomPass.threshold = 0.5;
                        bloomPass.radius = 0.8;
                        uniforms.u_red.value = 0.2;
                        uniforms.u_green.value = 0.4;
                        uniforms.u_blue.value = 1.0;
                        uniforms.u_frequency.value = Math.min(10, averageFrequency);
                        uniforms.u_freeze.value = true;
                    }
                }
			})
			.catch(error => {
				console.error('Error checking audio file:', error);
			});

        camera.position.x += (mouseX - camera.position.x) * 0.05;
        camera.position.y += (-mouseY - camera.position.y) * 0.5;
        camera.lookAt(scene.position);

        uniforms.u_time.value = clock.getElapsedTime();
        uniforms.u_frequency.value = averageFrequency;

        bloomComposer.render();
        requestAnimationFrame(animate);
    }
    animate();

}).catch(err => console.error('Microphone access denied: ', err));

window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
});