import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js'

/* =========================
   SCENE
========================= */

const scene = new THREE.Scene()

scene.background = new THREE.Color(0x050505)

/* =========================
   CAMERA
========================= */

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)

camera.position.z = 5

scene.add(camera)

/* =========================
   RENDERER
========================= */

const canvas = document.querySelector('.webgl')

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
})

renderer.setSize(window.innerWidth, window.innerHeight)

renderer.setPixelRatio(window.devicePixelRatio)

/* =========================
   LIGHTS
========================= */

const ambientLight = new THREE.AmbientLight(
    0xffffff,
    1.5
)

scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(
    0xff00ff,
    3
)

directionalLight.position.set(5,5,5)

scene.add(directionalLight)

const greenLight = new THREE.PointLight(
    0x7CFF00,
    5
)

greenLight.position.set(-5,2,3)

scene.add(greenLight)

/* =========================
   FLOOR
========================= */

const floorGeometry = new THREE.PlaneGeometry(20,20)

const floorMaterial = new THREE.MeshStandardMaterial({
    color:0x111111,
    metalness:0.8,
    roughness:0.3
})

const floor = new THREE.Mesh(
    floorGeometry,
    floorMaterial
)

floor.rotation.x = -Math.PI / 2

floor.position.y = -2

scene.add(floor)

/* =========================
   CUBO 3D
========================= */

const geometry = new THREE.BoxGeometry(1.5,1.5,1.5)

const material = new THREE.MeshStandardMaterial({

    color:'#ff00ff',

    metalness:1,

    roughness:0.2
})

const cube = new THREE.Mesh(
    geometry,
    material
)

scene.add(cube)

/* =========================
   PARTICLES
========================= */

const particlesGeometry = new THREE.BufferGeometry()

const particlesCount = 2000

const posArray = new Float32Array(
    particlesCount * 3
)

for(let i = 0; i < particlesCount * 3; i++){

    posArray[i] =
        (Math.random() - 0.5) * 20
}

particlesGeometry.setAttribute(

    'position',

    new THREE.BufferAttribute(posArray, 3)
)

const particlesMaterial = new THREE.PointsMaterial({

    size:0.03,

    color:'#ff00ff'
})

const particlesMesh = new THREE.Points(

    particlesGeometry,

    particlesMaterial
)

scene.add(particlesMesh)

/* =========================
   RAYCASTER
========================= */

const raycaster = new THREE.Raycaster()

const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (event)=>{

    mouse.x =
        (event.clientX / window.innerWidth) * 2 - 1

    mouse.y =
        -(event.clientY / window.innerHeight) * 2 + 1
})

/* =========================
   CLICK INTERACTION
========================= */

window.addEventListener('click', ()=>{

    gsap.to(cube.rotation,{

        y:cube.rotation.y + Math.PI * 2,

        duration:1.5
    })
})

/* =========================
   GSAP
========================= */

gsap.registerPlugin(ScrollTrigger)

gsap.from('.hero .content',{

    opacity:0,

    y:100,

    duration:1.5
})

gsap.utils.toArray('.section').forEach((section)=>{

    const content =
        section.querySelector('.content')

    if(content){

        gsap.from(content,{

            opacity:0,

            y:80,

            scrollTrigger:{

                trigger:section,

                start:'top 70%',

                end:'bottom 30%',

                toggleActions:
                    'play none none reverse'
            }
        })
    }
})

/* =========================
   CAMERA SCROLL
========================= */

gsap.to(camera.position,{

    z:4,

    y:1.5,

    scrollTrigger:{

        trigger:'.about',

        start:'top center',

        end:'bottom center',

        scrub:true
    }
})

/* =========================
   LIGHT ANIMATION
========================= */

gsap.to(directionalLight.position,{

    x:-3,

    y:5,

    z:2,

    scrollTrigger:{

        trigger:'.experience',

        scrub:true
    }
})

/* =========================
   CLOCK
========================= */

const clock = new THREE.Clock()

/* =========================
   ANIMATION LOOP
========================= */

function animate(){

    requestAnimationFrame(animate)

    const elapsedTime =
        clock.getElapsedTime()

    /* ROTACION DEL CUBO */

    cube.rotation.x += 0.01

    cube.rotation.y += 0.01

    cube.position.y =
        Math.sin(elapsedTime) * 0.2

    /* PARTICULAS */

    particlesMesh.rotation.y += 0.0005

    /* RAYCASTER */

    raycaster.setFromCamera(mouse, camera)

    const intersects =
        raycaster.intersectObjects(
            scene.children,
            true
        )

    if(intersects.length > 0){

        document.body.style.cursor = 'pointer'

    }else{

        document.body.style.cursor = 'default'
    }

    renderer.render(scene, camera)
}

animate()

/* =========================
   RESPONSIVE
========================= */

window.addEventListener('resize', ()=>{

    camera.aspect =
        window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    )

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    )
})