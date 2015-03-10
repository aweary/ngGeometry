angular.module('nxGeometry', [])
	.directive('nxGeometry', function(){

		return {

			restrict: 'A',

			scope : {

				objectColor: '@',
				backgroundColor: '@',
				wireframe: '=',
				size : '=',
				geometry: '@'

			},

			link: function(scope, element){


				/**
				 * @name geometries
				 * @type object
				 * @summary map containing the different Three.js geometry
				 *          constructors, and an array of the arguments they take.
				 */

				var  geometries = {

					'octahedron' : {ref: THREE.OctahedronGeometry, args: [scope.size, 1]},
					'sphere' : {ref: THREE.SphereGeometry, args: [scope.size, 10]},
					'cube' : {ref: THREE.CubeGeometry, args: [scope.size, scope.size, scope.size]}

				};



				var camera, scene, geometry, renderer, material, object,
					container, windowHalfX, windowHalfY, mouseX, mouseY;

				// Element dimensions

				scope.width           = element[0].offsetWidth;
				scope.height          = element[0].offsetHeight;


				windowHalfX = scope.width  / 2;
				windowHalfY = scope.height / 2;

				mouseX = 0;
				mouseY = 0;


				/**
				 * @function scope.setGeometry
				 * @summary parses the geometry attribute and references the correct
				 *          geometry constructor from the geometries object
				 * @returns {*}
				 */

				scope.setGeometry = function(){

					scope.geometry    = scope.geometry.toLowerCase();
					var geometryObject = geometries[scope.geometry],
						geometryArgs = geometryObject.args,
						geometryFunc = geometryObject.ref;

					return construct(geometryFunc, geometryArgs);

				};


				/**
				 * @function scope.init
				 * @summary sets the Three.JS scene, creates the object, pulls it all together.
				 */

				scope.init = function(){


					container = document.createElement('div');

					element[0].appendChild(container);

					camera   = new THREE.PerspectiveCamera(20, scope.width / scope.height, 1, 1000);

					camera.position.x = 0;
					camera.position.y = 0;
					camera.position.z = 20;

					scene    = new THREE.Scene();

					camera.lookAt(scene.position);

					geometry =  scope.setGeometry();

					material = new THREE.MeshBasicMaterial({color: scope.objectColor, wireframe: scope.wireframe});

					object   = new THREE.Mesh(geometry, material);

					object.position.x = 0;
					object.rotation.x = 0
					scene.add(object);

					renderer = new THREE.WebGLRenderer({ antialias: true });

					renderer.setSize(scope.width, scope.height);
					renderer.setClearColor(scope.backgroundColor);


					container.appendChild(renderer.domElement);



				}; // @end scope.init





				/**
				 * @function scope.render
				 * @summary animates and renders the scene
				 */

				scope.render = function(){



					// Move camera around when the mouse moves

					camera.position.x += (mouseX - camera.position.x) * 0.00005;
					camera.position.y += (mouseY - camera.position.y) * 0.00005;


					camera.lookAt(scene.position);

					// Traverse the scene, rotate the Mesh object(s)
					scene.traverse(function(element){

						if(element instanceof  THREE.Mesh){

							element.rotation.x += 0.00065;
							element.rotation.y += 0.00065;

						}

						renderer.render(scene, camera);

					});

				}; // @end scope.render




				/**
				 * @function scope.animate
				 * @summary used to initiate animation, mainly just to keep scope.render clean
				 */


				scope.animate = function(){

					requestAnimationFrame(scope.animate);
					scope.render();

				}; // @end scope.animate




				/* ________ Event Handlers  ________ */


				scope.onWindowResize = function(){

					scope.width           = element[0].offsetWidth;
					scope.height          = element[0].offsetHeight;

					camera.aspect = scope.width / scope.height;
					camera.updateProjectionMatrix();

					renderer.setSize(scope.width, scope.height);
					scope.render();



				}; // @end scope.onWindowResize

				scope.onMouseMove = function( event ){


					mouseX = (event.clientX - windowHalfX);
					mouseY = (event.clientY - windowHalfY);

				}; // @end scope.onMouseMove

				scope.$watch('size', function(){

					scene.traverse(function(element){

						if(element instanceof THREE.Mesh){

							element.scale.x = scope.size * 0.5;
							element.scale.y = scope.size * 0.5;
							element.scale.z = scope.size * 0.5;

						}


					});

				});




				/* ________ Event Listeners ________ */

				window.addEventListener('resize', scope.onWindowResize, false);
				window.addEventListener('mousemove', scope.onMouseMove, false);



				/* ________ Helper Functions _______ */


				// Helper function used to call apply on a constructor
				function construct(constructor, args) {
					function F() {
						return constructor.apply(this, args);
					}
					F.prototype = constructor.prototype;
					return new F();
				};


				/* ________ Initialization  ________ */

				scope.init();
				scope.animate();



			}

		}


	});
