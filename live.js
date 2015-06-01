var looks = ['01.jpg','02.jpg','03.jpg','04.jpg','05.jpg','06.jpg','07.jpg','08.jpg','09.jpg','10.jpg','11.jpg','12.jpg','13.jpg','14.jpg'];

var objects = [];
var targets = { sphere: [], helix: [], grid: [] };

var lookbookTrigger, cameraCollider;
var lookbookTransform = true;
var collidableMeshList = [];

var container;
var scene, renderer, composer;
var rendererCSS, sceneCSS;

var splineCamera, fps;
var axes;
var mouseX = 0;
var mouseY = 0;
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;


var objects = [];
var targets = { table: [], sphere: [], helix: [], grid: [] };

var hemiLight, dirLight;
var axes;

var clock = new THREE.Clock();


var sampleClosedSpline = new THREE.ClosedSplineCurve3([
	new THREE.Vector3(	300, 	300, 	300),
	new THREE.Vector3(	-40, 	20, 	-40),
	new THREE.Vector3(	40, 	20, 	-40),
	new THREE.Vector3(	140, 	20, 	-40),
	new THREE.Vector3(	40, 	20, 	40),
	new THREE.Vector3(	-40, 	20, 	40),
]);
var tube, tubeMesh, scale = 100, binormal = new THREE.Vector3(), normal = new THREE.Vector3();



init();
render();
//animate();

var e = document.querySelector('#enter-btn');
e.onclick = function() {
	e.parentNode.remove();
	animate();
}

function animate() {
	requestAnimationFrame( animate );
	TWEEN.update();
	render();
}


function render() {
	var timer = 0.0001 * Date.now();
	var time = Date.now() * 0.1;
	var delta = clock.getDelta();

	/* move spline camera */
	var looptime = 11 * 1000;
	var t = ( time % looptime ) / looptime;
	var pos = tube.parameters.path.getPointAt( t );
	pos.multiplyScalar( scale );
	var segments = tube.tangents.length;
	var pickt = t * segments;
	var pick = Math.floor( pickt );
	var pickNext = ( pick + 1 ) % segments;
	binormal.subVectors( tube.binormals[ pickNext ], tube.binormals[ pick ] );
	binormal.multiplyScalar( pickt - pick ).add( tube.binormals[ pick ] );
	var dir = tube.parameters.path.getTangentAt( t );
	var offset = 15;
	normal.copy( binormal ).cross( dir );
	pos.add( normal.clone().multiplyScalar( offset ) );
	splineCamera.position.x = pos.x;
	splineCamera.position.y = pos.y;
	splineCamera.position.z = pos.z;

	if (lookbookTransform) {
		var originPoint = lookbookTrigger.position.clone();
		for (var vertexIndex = 0; vertexIndex < lookbookTrigger.geometry.vertices.length; vertexIndex++){		
			var localVertex = lookbookTrigger.geometry.vertices[vertexIndex].clone();
			var globalVertex = localVertex.applyMatrix4( lookbookTrigger.matrix );
			var directionVector = globalVertex.sub( lookbookTrigger.position );
			
			var ray = new THREE.Raycaster( originPoint, directionVector.clone().normalize() );
			var collisionResults = ray.intersectObjects( collidableMeshList);
			if ( collisionResults.length > 0 && collisionResults[0].distance < directionVector.length() ) {
				transform( targets.helix, 6000 );
				lookbookTransform = false;
			}
		}
	}

	//fps.update(delta);
	splineCamera.lookAt(axes.position);
	renderer.render(scene, splineCamera);
	//rendererCSS.render(sceneCSS, splineCamera);
}

function init() {
	container = document.createElement( 'div' );
	document.body.appendChild( container );
	scene = new THREE.Scene();

	tube = new THREE.TubeGeometry(sampleClosedSpline, 50, 2, 1, true);
	tubeMesh = THREE.SceneUtils.createMultiMaterialObject(tube, [
		new THREE.MeshBasicMaterial({
			color: 0xff0000
		}),
		new THREE.MeshBasicMaterial({
			wireframe:true,
			transparent:true
		})]);
	// scene.add(tubeMesh);
	// tubeMesh.scale.set(scale, scale, scale);


	splineCamera = new THREE.PerspectiveCamera( 84, window.innerWidth / window.innerHeight, 0.01, 100000 );
	splineCamera.position.y = 1000;
	scene.add( splineCamera );

	axes = new THREE.AxisHelper(100);
	axes.position.z = -1000;
	axes.position.y = 10;
	scene.add( axes );
	splineCamera.lookAt(axes.position);



	//fps = new THREE.FirstPersonControls( splineCamera );
	//fps.lookSpeed = 0.025;//0.0125;
	//fps.movementSpeed = 0;
	//fps.noFly = false;
	//fps.lookVertical = true;
	//fps.constrainVertical = true;
	//fps.verticalMin = 1.5;
	//fps.verticalMax = 2.0;
	//fps.lon = 250;
	//fps.lat = 30;


	/* collider */
	var cubeGeometry = new THREE.BoxGeometry(5000,5000,5000,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000,  transparent: true, opacity: 0.0 } );
	lookbookTrigger = new THREE.Mesh( cubeGeometry, wireMaterial );
	lookbookTrigger.position.x = -4500;
	lookbookTrigger.position.z = 3000;
	lookbookTrigger.position.y = 2000;
	scene.add( lookbookTrigger );

	var cubeGeometry = new THREE.BoxGeometry(1000,1000,1000,1,1,1);
	var wireMaterial = new THREE.MeshBasicMaterial( { color: 0x00ff00,  transparent: true, opacity: 0.0 } );
	cameraCollider = new THREE.Mesh( cubeGeometry, wireMaterial );
	splineCamera.add( cameraCollider );
	collidableMeshList.push(cameraCollider);


	// LIGHTS
	hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
	hemiLight.color.setHSL( 0.6, 1, 0.6 );
	hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
	hemiLight.position.set( 0, 500, 0 );
	scene.add( hemiLight );
	//
	dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
	dirLight.color.setHSL( 0.1, 1, 0.95 );
	dirLight.position.set( -1, 1.75, 1 );
	dirLight.position.multiplyScalar( 50 );
	scene.add( dirLight );
	dirLight.castShadow = true;
	dirLight.shadowMapWidth = 2048;
	dirLight.shadowMapHeight = 2048;

	var d = 50;
	dirLight.shadowCameraLeft = -d;
	dirLight.shadowCameraRight = d;
	dirLight.shadowCameraTop = d;
	dirLight.shadowCameraBottom = -d;
	dirLight.shadowCameraFar = 3500;
	dirLight.shadowBias = -0.0001;
	dirLight.shadowDarkness = 0.35;
	dirLight.shadowCameraVisible = true;


	// SKYDOME
	var vertexShader = document.getElementById( 'vertexShader' ).textContent;
	var fragmentShader = document.getElementById( 'fragmentShader' ).textContent;
	var uniforms = {
		topColor: 	 { type: "c", value: new THREE.Color( 0x0077ff ) },
		bottomColor: { type: "c", value: new THREE.Color( 0xaaeeff ) },
		offset:		 { type: "f", value: 33 },
		exponent:	 { type: "f", value: 0.5 }
	}
	uniforms.topColor.value.copy( hemiLight.color );
	scene.fog = new THREE.FogExp2( uniforms.bottomColor.value, 0.00005 );
	var skyGeo = new THREE.SphereGeometry( 50000, 32, 15 );
	var skyMat = new THREE.ShaderMaterial( { vertexShader: vertexShader, fragmentShader: fragmentShader, uniforms: uniforms, side: THREE.BackSide } );
	var sky = new THREE.Mesh( skyGeo, skyMat );
	scene.add( sky );
	
	
	// images
	for (var i = 0; i < looks.length; i++) {
		
		var imageTexture = new THREE.ImageUtils.loadTexture( 'imgs/looks/'  + looks[i] );
		var imageMaterial = new THREE.MeshBasicMaterial( { map: imageTexture, side: THREE.DoubleSide } );
		var imageGeometry = new THREE.PlaneGeometry( 4000, 6000, 1, 1);
		var image = new THREE.Mesh(imageGeometry, imageMaterial);
		imageTexture.minFilter = THREE.LinearFilter;

		image.position.x = Math.random() * 40000 - 20000;
		image.position.y = Math.random() * 20000;
		image.position.z = Math.random() * 40000 - 20000;
		
		scene.add(image);

		objects.push( image );		
	}


	// helix
	var vector = new THREE.Vector3();
	for ( var i = 0, l = objects.length; i < l; i ++ ) {
		var phi = i * 0.5 + Math.PI;
		var object = new THREE.Object3D();
		object.position.x = 9000 * Math.sin( phi );
		object.position.y = - ( i * 40 ) + 2850;
		object.position.z = 9000 * Math.cos( phi );
		vector.x = object.position.x * 2;
		vector.y = object.position.y;
		vector.z = object.position.z * 2;
		object.lookAt( vector );
		targets.helix.push( object );
	}
	//transform( targets.helix, 6000 );


	renderer = new THREE.WebGLRenderer({antialias:true});
	renderer.setClearColor( 0xffaaff );
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);
	
}


function transform( targets, duration ) {
	TWEEN.removeAll();
	for ( var i = 0; i < objects.length; i ++ ) {
		var object = objects[ i ];
		var target = targets[ i ];
		new TWEEN.Tween( object.position )
			.to( { x: target.position.x, y: target.position.y, z: target.position.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
		new TWEEN.Tween( object.rotation )
			.to( { x: target.rotation.x, y: target.rotation.y, z: target.rotation.z }, Math.random() * duration + duration )
			.easing( TWEEN.Easing.Exponential.InOut )
			.start();
	}
	new TWEEN.Tween( this )
		.to( {}, duration * 2 )
		.onUpdate( render )
		.start();
}



