if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var camera, scene, renderer;
var geometry, material, mesh;
var tiles, terrain, terrainGeneration, ground, composer;
var test;
var postprocessing = {};

bg = document.body.style;
bg.background = '#FFCD63';

function setup() {
	var W = window.innerWidth, H = window.innerHeight;
	renderer = new THREE.WebGLRenderer();
	renderer.setSize( W, H );
	renderer.setClearColor (0x55ffee, 1);

	document.body.appendChild( renderer.domElement );

	camera = new THREE.PerspectiveCamera( 50, W/H, 1, 10000 );
	camera.position.y = 30;
	camera.position.z = 50;
	camera.position.x = 0;
	camera.rotation.x = -0.4;
	
	scene = new THREE.Scene();

	
	//TEST//
	terrainGeneration = new TerrainGeneration(1000, 1000, 64, 4);
	terrain = terrainGeneration.diamondSquare();
	ground = new THREE.PlaneGeometry(1000, 1000, 64, 64);
	var index = 0;
	for(var i = 0; i <= 64; i++) {
			for(var j = 0; j <= 64; j++) {
				ground.vertices[index].z = terrain[i][j];
				index++;
			}
	}

	
		;(function(){
		// add a ambient light
		var light	= new THREE.AmbientLight( 0x202020 )
		scene.add( light )
		// add a light in front
		var light	= new THREE.DirectionalLight('white', 5)
		light.position.set(0.5, 0.0, 2)
		scene.add( light )
		// add a light behind
		var light	= new THREE.DirectionalLight('white', 0.75*2)
		light.position.set(80, 40, 80)
		scene.add( light )		
	})()


	
		//LIGHT//	
	var material	= new THREE.MeshPhongMaterial({
		map: THREE.ImageUtils.loadTexture('images/grass.png'),
		shading		: THREE.FlatShading,
		//shading		: THREE.SmoothShading,
		//vertexColors 	: THREE.VertexColors,
	});
	var mesh = new THREE.Mesh(ground, material);
	mesh.rotateX( - Math.PI / 2);
	mesh.geometry.computeFaceNormals(); 
	mesh.geometry.computeVertexNormals(); 
	mesh.geometry.normalsNeedUpdate = true;
	//mesh.material.color.setHex( 0x00ff00 );

	scene.add(mesh);
	//TEST//


scene.add( test );


// postprocessing FOR LATER
	composer = new THREE.EffectComposer( renderer );
	composer.addPass( new THREE.RenderPass( scene, camera ) );
	effect = new THREE.ShaderPass( THREE.PixelateShader );
		//pixililated ammount less is more//
	effect.uniforms[ 'intensity' ].value = -24; //-.32 is good pixilation more than -1 is no pixilation
	effect.uniforms['u_resolution'] = {
		type: "v2", value: new THREE.Vector2()
	}
	effect.renderToScreen = true;
	composer.addPass( effect );
	postprocessing.composer = composer;
	postprocessing.effect = effect;
	
	document.body.appendChild( renderer.domElement );
	onWindowResize();
	window.addEventListener( 'resize', onWindowResize, false );
	
}



function draw() {

	requestAnimationFrame( draw );
camera.position.x = Math.sin( Date.now() * 0.0002 ) * 200;	// experiment with code from the snippets menu here	
	//renderer.render( scene, camera );
	postprocessing.composer.render( scene, camera );
}

//FUNCTIONS//
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	postprocessing.composer.setSize( window.innerWidth, window.innerHeight );
	//update uniforms
	postprocessing.effect.uniforms['u_resolution'].value.x = renderer.domElement.width;
	postprocessing.effect.uniforms['u_resolution'].value.y = renderer.domElement.height;
}

setup();
draw();