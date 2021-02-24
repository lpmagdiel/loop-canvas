class MAGMA2D{
    /**
     * 
     * @param {String} canvasId "ID of canvas element"
     * @param {Int} FPS "Frame for Seconds of loop"
     */
    constructor(canvasId, FPS=30){
        this.Scenes = [];
        this.Active = "";
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.Width = this.canvas.width;
        this.Height = this.canvas.height;
        this.context = this.canvas.getContext("2d");
        this.Clear();
        this.LoopControl;
        this.FPS = FPS;
        console.log("%c🎴 loopCanvas 🎴","font-size:2em;color:tomato");
    }
    Clear(){
        this.context.fillStyle = 'black';
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
    }
    ChangeScene(Name){
        this.Active = Name;
        let scene = {};
        for(let i=0;i<this.Scenes.length;i++){
            if(this.Scenes[i].Name == Name){
                scene = this.Scenes[i];
            }
        }
        window.clearInterval(this.LoopControl);
        this.Render(scene,this.FPS);
    }
    CreateScene(Name){
        let scene = {
            Game:this,
            Name,
            Loop:null,
            GameObjects:[],
            Add: function(GameObject){
                this.GameObjects.push(GameObject);
            }
        }
        this.Scenes.push(scene);
        return scene;
    }
    /**
     * 
     * @param {Function} fx
     */
    KeyDown(fx){
        window.addEventListener('keydown',e=>{
            fx(e.key);
        });
    }
    /**
     * 
     * @param {Object} imageSettings  "Source of image"
     * @returns {Object}    "Proxy of Image object"
     */
    Image(imageSettings){
        let img = new Image();
        img.src = imageSettings.src;
        let gameObject = {
            type:'Image',
            image: img,
            X:imageSettings.X || 0,
            Y:imageSettings.Y || 0,
            Width:imageSettings.Width || img.naturalWidth,
            FullWidth: img.naturalWidth,
            FullHeight: img.naturalHeight,
            Height:imageSettings.Height || img.naturalHeight,
            Depth:0,
            Scale:1,
            Rotation:0
        }
        return gameObject;
    }
    Sound(source){
        let sound = document.createElement('audio');
        sound.src = source;
        return sound;
    }
    /**
     * 
     * @param {Object} lineSettings 
     * @returns {Object} "Line game object"
     */
    Line(lineSettings){
        let gameObject = {
            Depth:0,
            type:'Line',
            X:lineSettings.X || 0,
            Y:lineSettings.Y || 0,
            From:lineSettings.From,
            To:lineSettings.To,
            Size: lineSettings.Size || 5,
            Background:lineSettings.Background || 'white',
            Rotation:0
        }
        return gameObject;
    }
    /**
     * 
     * @param {Object} textSettings 
     * @returns {Object} "Text object"
     */
    Text(textSettings){
        let gameObject = {
            Depth:0,
            type:'Text',
            X:textSettings.X || 0,
            Y:textSettings.Y || 0,
            Text:textSettings.Text || "",
            Visible: true,
            Style:textSettings.Style || "20px Arial",
            Color:textSettings.Color || "white",
            Align:'right',
            Rotation:0
        }
        return gameObject;
    }
    Render(scene,FPS){
        this.Clear();
        if(!scene.Name || scene.Name.length<1){
            throw 'This scene doesn\'t exist!';
            return;
        }
        this.LoopControl = window.setInterval(()=>{
                if(scene.Name == this.Active){
                    this.Clear();
                    for(let i=0;i<scene.GameObjects.length;i++){
                        let obj = scene.GameObjects[i];
                        if(obj.type == 'Image'){
                            this.context.drawImage(obj.image,0,0,obj.FullWidth,obj.FullHeight, obj.X, obj.Y,obj.Width*obj.Scale,obj.Height*obj.Scale);
                        }
                        else if(obj.type == 'Line'){
                            this.context.beginPath();
                            this.context.moveTo(obj.X, obj.Y);
                            this.context.lineTo(obj.From+obj.X, obj.To+obj.Y);
                            this.context.strokeStyle = obj.Background;
                            this.context.lineWidth = obj.Size;
                            this.context.stroke();
                        }
                        else if(obj.type == 'Text'){
                            this.context.fillStyle = obj.Color;
                            this.context.font = obj.Style;
                            this.context.textAlign = obj.Align;
                            this.context.fillText(obj.Text, obj.X, obj.Y);
                        }
                    }
                    if(typeof scene.Loop == 'function'){
                        scene.Loop();
                    }
                }
        },parseInt(1000/FPS));
    }
}