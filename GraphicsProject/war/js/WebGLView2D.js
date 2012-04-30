function WebGLView2D(){
	var instance = this;
	this.scene;
	this.camera;
	this.renderer;
	this.width;
	this.height;
	this.loaded = false;


	this.init = function(){
		this.width = 1280;//$('.main_view').width();
		this.height = 800;//$('.main_view').height();

		this.camera = new THREE.OrthographicCamera( this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 0, 1000 );
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 1000;

		this.scene = new THREE.Scene();

		this.scene.add( this.camera );

		this.changePhoto('images/sampleHD/sample_pic_01.jpg');
	}

	this.getCamera = function(){
		return this.camera;
	}

	this.getScene = function(){
		return this.scene;
	}

	this.changePhoto = function(src) {
		var image = document.createElement('img');
		this.scene.remove(this.picture);
		$(image).attr('src', src).load(function(){
			instance.resizeView(this.width, this.height)

			var texture = new THREE.ImageUtils.loadTexture(src);
			texture.needsUpdate = true;

			var geometry = new THREE.PlaneGeometry(instance.width,instance.height);

			var shaderMaterial = instance.simpleShader(texture);

			instance.picture = new THREE.Mesh(geometry, shaderMaterial);
			instance.picture.rotation.x = Math.PI/2.0;
			instance.scene.add(instance.picture);
			instance.loaded = true;
		});
	}

	this.simpleShader = function(texture)
	{ 
		appController.um.setTexture(texture);

		var attributes = {
				vTextureCoord : {type:""}
		}

		var shaderMaterial = new THREE.ShaderMaterial({
			uniforms : appController.um.getUniforms(),
			vertexShader : $('#vertexshader').text(),
			fragmentShader: $('#fragmentshader').text()
		})

		return shaderMaterial;
	}

	this.caputureCurrentPic = function(){

		var dataurl = this.getDownloadURL();
		var image = document.createElement('img');

		$(image).attr('src', dataurl).load(function(){
			instance.onChangeImageLoad(image);
		});

		image.src = dataurl;
	}

	this.onChangeImageLoad = function(image)
	{
		this.scene.remove(this.picture);

		var texture = new THREE.Texture( image );
		texture.needsUpdate = true;

		var geometry = new THREE.PlaneGeometry(this.width,this.height);

		//create the sphere's material
		var shaderMaterial = this.simpleShader(texture);

		this.picture = new THREE.Mesh(geometry, shaderMaterial);
		this.picture.rotation.x = Math.PI/2.0;
		
		this.scene.add(this.picture);
	}

	this.resizeView = function(newWidth, newHeight, callback)
	{
		//reset width and height varriables
		this.width = newWidth;
		this.height = newHeight;

		//reset render size
		this.renderer.setSize(this.width, this.height);

		//reset canvas size
		$('canvas').width(this.width);
		$('canvas').height(this.height);

		//reset camera
		this.camera.left =  this.width / - 2;
		this.camera.right = this.width / 2;
		this.camera.top = this.height / 2;
		this.camera.bottom = this.height / - 2;
		this.camera.near = 0;
		this.camera.far = 1000;
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 1000;

		this.camera.updateProjectionMatrix();

		if(typeof callback != 'undefined')
			callback();

		appController.wc.resizeSections();

		appController.um.changeSize(this.width, this.height);
	}

	this.getDownloadURL = function()
	{
		var dataurl = this.renderer.domElement.toDataURL('image/png');
		return dataurl;
	}

	this.addToScene = function(obj)
	{
		this.scene.add(obj);
	}

	this.removeFromScene = function(obj)
	{
		this.scene.remove(obj);
	}
	
	this.cropImage = function(x0, y0, x1, y1)
	{
		//Resize the renderer
		
		//Change the camera to focus on our croped area
		this.camera.left =  this.width / - 2;
		this.camera.right = this.width / 2;
		this.camera.top = this.height / 2;
		this.camera.bottom = this.height / - 2;
		this.camera.near = 0;
		this.camera.far = 1000;
		this.camera.position.x = 0;
		this.camera.position.y = 0;
		this.camera.position.z = 1000;

		this.camera.updateProjectionMatrix();
		
		//Get data url
		
		//set picture
		
		//resize everything
	}

	this.init();
}