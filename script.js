const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const restartBtn = document.getElementById('restart')
const startBtn = document.getElementById('start')
canvas.width = 400;
canvas.height = 600;



class Ellpise {
    constructor(MajorAxis, MinorAxis) {
        this.h = canvas.width / 2,
            this.k = canvas.height / 2,
            this.a = MajorAxis,
            this.b = MinorAxis
        this.isHorizontal = this.a > this.b ? true : false

        this.c = Math.sqrt(Math.abs((this.a * this.a) - (this.b * this.b)))

        this.focus1 = {
            x: this.isHorizontal ? this.h + this.c : this.h,
            y: this.isHorizontal ? this.k : this.k + this.c,
        }
        this.focus2 = {
            x: this.isHorizontal ? this.h - this.c : this.h,
            y: this.isHorizontal ? this.k : this.k - this.c,
        }

        this.baseFoci1 = {
            x: this.focus1.x,
            y: this.focus1.y
        }
        this.baseFoci2 = this.focus2

        this.focusRadius = 15

        this.moveSpeed = 5
        this.velocity = {
            x: 0,
            y: 0
        }
    //Flags
        this.isMoving = false;
        this.isTouching = false
    }

    drawEllipse() {
        ctx.fillStyle = "green"
        ctx.beginPath()
        ctx.ellipse(this.h, this.k, this.a, this.b, 0, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()

        ctx.strokeStyle = "white"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.ellipse(this.h, this.k, this.a, this.b, 0, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.stroke()

    }

    drawFocii() {
        ctx.fillStyle = "white"

        // F1
        ctx.beginPath()
        ctx.arc(this.focus1.x, this.focus1.y, this.focusRadius, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()

        // F2
        ctx.fillStyle = "black"
        ctx.beginPath()
        ctx.arc(this.focus2.x, this.focus2.y, this.focusRadius + 5, 0, 2 * Math.PI)
        ctx.closePath()
        ctx.fill()
    }

    checkCollision() {
        let dx = this.focus1.x - this.h
        let dy = this.focus1.y - this.k
        let a = this.a - this.focusRadius
        let b = this.b - this.focusRadius

        let value = ((dx * dx) / (a*a)) + ((dy * dy) / (b*b))

        if (value >= 1) {
            console.log("collision")
            this.collision()
        }
    }

    updateBall() {
        this.focus1.x += this.velocity.x
        this.focus1.y += this.velocity.y
    }

collision() {
    // 1. vector from center to ball
    let dx = this.focus1.x - this.h
    let dy = this.focus1.y - this.k

    // 2. normal vector using ellipse gradient
    let nx = 2 * dx / (this.a * this.a)
    let ny = 2 * dy / (this.b * this.b)

    // 3. normalize
    let len = Math.hypot(nx, ny)
    nx /= len
    ny /= len

    // 4. reflect velocity
    let dot = this.velocity.x * nx + this.velocity.y * ny
    this.velocity.x = this.velocity.x - 2 * dot * nx
    this.velocity.y = this.velocity.y - 2 * dot * ny
}

checkDistanceWithFocus(){
    let f1x= this.focus1.x - this.h
    let f1y = this.focus1.y - this.k
    let f2x= this.focus2.x - this.h
    let f2y = this.focus2.y - this.k

    let fdx = Math.abs(f2x-f1x)
    let fdy = Math.abs(f2y-f1y)

    let distance = Math.sqrt((fdx*fdx) + (fdy*fdy))
    // console.log(distance)

    if(distance < 2 + this.focusRadius) {
        this.isTouching = true
        this.POP()
    }
}

POP(){
    let audio = new Audio("pop.mp3")

    if(this.isTouching){
    this.velocity.x = 0
    this.velocity.y = 0
    this.focus1.x = this.baseFoci1.x
    this.focus1.y = this.baseFoci1.y

    audio.play()
    this.isTouching = false
    this.isMoving = false
    }
    else return

}
startBtn(){
        if (this.isMoving) return
    else {
        this.isMoving = true

        const speed = 5;
        const angle = Math.random() * 2 * Math.PI

        this.velocity.x = speed * Math.cos(angle)
        this.velocity.y = speed * Math.sin(angle)
    }
}


}

function getRandom(min, max) {

    return Math.floor(Math.random() * (max - min) + min)
}



function GenerateEllipse() {

    let a = getRandom(100, 200)
    let b = getRandom(100, 200)

    if (a == b) b++

    return new Ellpise(a, b)



}

let ellipse = GenerateEllipse()


restartBtn.addEventListener('click', () => {
    ellipse = GenerateEllipse()
})

startBtn.addEventListener('click', () => {


    ellipse.startBtn()


})


function animate() {
    requestAnimationFrame(animate)
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ellipse.drawEllipse()
    ellipse.updateBall()
    ellipse.checkCollision()
    ellipse.drawFocii()
    ellipse.checkDistanceWithFocus()


}

animate()


