var loader = new THREE.JSONLoader();


/* LOADING ALL OBJECTS */
loader.load('models/court.json', function(bballGeo, bballMat) {
	var court = new THREE.Mesh(bballGeo, 
		new THREE.MeshNormalMaterial({shading:THREE.SmoothShading })//new THREE.MeshFaceMaterial(bballMat) 
	);
	court.position.y = -100;
	court.castShadow = true;
	court.receiveShadow = true;
	court.scale.set(100,100,100);
	court.name = "court";
	scene.add(court);
});
loader.load('models/island.json', function(islandGeometry, islandMaterial) {
	var island = new THREE.Mesh(islandGeometry, 
		new THREE.MeshFaceMaterial(islandMaterial) 
		//new THREE.MeshNormalMaterial({shading:THREE.SmoothShading })
	);
	island.position.y = -100;
	island.castShadow = true;
	island.receiveShadow = true;
	island.scale.set(100,100,100);
	island.name = "island";
	scene.add(island);
});
loader.load('models/water.json', function(waterGeometry, waterMaterial) {
	var water = new THREE.Mesh(waterGeometry, 
		//new THREE.MeshFaceMaterial(waterMaterial) 
		new THREE.MeshNormalMaterial({shading:THREE.SmoothShading })
	);
	water.position.y = -100;
	water.castShadow = true;
	water.receiveShadow = true;
	water.scale.set(100,100,100);
	water.name = "water";
	scene.add(water);
});

loader.load('models/tree-backs.json', function(treeGeometry, treeMaterial) {
	var tree = new THREE.Mesh(treeGeometry, 
		new THREE.MeshFaceMaterial(treeMaterial) 
		//new THREE.MeshNormalMaterial({shading:THREE.SmoothShading })
	);
	tree.position.y = -100;
	tree.castShadow = true;
	tree.receiveShadow = true;
	tree.scale.set(100,100,100);
	tree.name = "tree";
	scene.add(tree);
});

loader.load('models/concrete.json', function(concreteGeometry, concreteMaterial) {
	var concrete = new THREE.Mesh(concreteGeometry, 
		new THREE.MeshFaceMaterial(concreteMaterial) 
		//new THREE.MeshNormalMaterial({shading:THREE.SmoothShading })
	);
	concrete.position.y = -200;
	concrete.castShadow = true;
	concrete.receiveShadow = true;
	concrete.scale.set(100,100,100);
	concrete.name = "concrete";
	//scene.add(concrete);
});

loader.load('models/palm.json', function(palmGeometry, palmMaterial) {
	palmMaterial[0].color.r = 1;
	palmMaterial[0].color.g = 0;
	palmMaterial[0].color.b = 1;
	var palm = new THREE.Mesh(palmGeometry, 
		new THREE.MeshFaceMaterial(palmMaterial) 
		//new THREE.MeshNormalMaterial({shading:THREE.SmoothShading })
	);
	palm.material.side = THREE.DoubleSide;
	palm.position.y = -110;
	palm.castShadow = true;
	palm.receiveShadow = true;
	palm.scale.set(100,100,100);
	palm.name = "concrete";
	scene.add(palm);
});