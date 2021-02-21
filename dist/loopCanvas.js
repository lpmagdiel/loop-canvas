class loopCanvas{
    /**
     * 
     * @param {String} canvasId "ID of canvas element"
     * @param {Int} FPS "Frame for Seconds of loop"
     */
    constructor(canvasId, FPS=30){
        this.gameObjects = [];
        this.canvas = document.getElementById(canvasId);
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = 'black';
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
        this.Render(FPS);
        this.Loop;
        console.log("%c🎴 loopCanvas 🎴","font-size:2em;color:tomato");
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
            Height:imageSettings.Height || img.naturalHeight,
            Depth:0
        }
        this.gameObjects.push(gameObject);
        return this.gameObjects[this.gameObjects.length-1];
    }
    Line(lineSettings){
        let gameObject = {
            type:'Line',
            X:lineSettings.X || 0,
            Y:lineSettings.Y || 0,
            From:lineSettings.From,
            To:lineSettings.To,
            Size: lineSettings.Size || 5,
            Background:lineSettings.Background || 'white'
        }
        this.gameObjects.push(gameObject);
        return this.gameObjects[this.gameObjects.length-1];
    }
    Render(FPS){
        window.setInterval(()=>{
            this.context.fillStyle = 'black';
            this.context.fillRect(0,0,this.canvas.width,this.canvas.height);
            for(let i=0;i<this.gameObjects.length;i++){
                let obj = this.gameObjects[i];
                if(obj.type == 'Image'){
                    this.context.drawImage(obj.image, obj.X, obj.Y);
                }
                else if(obj.type == 'Line'){
                    this.context.beginPath();
                    this.context.moveTo(obj.X, obj.Y);
                    this.context.lineTo(obj.From+obj.X, obj.To+obj.Y);
                    this.context.strokeStyle = obj.Background;
                    this.context.lineWidth = obj.Size;
                    this.context.stroke();
                }
            }
            if(typeof this.Loop == 'function'){
                this.Loop();
            }
        },parseInt(1000/FPS));
    }
}