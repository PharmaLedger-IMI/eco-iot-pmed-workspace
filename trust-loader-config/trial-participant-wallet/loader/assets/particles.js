const particlesArgs = {
    particles: {
        number: {
            value: 64,
            density: {
                enable: !0,
                value_area: 390
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle",
            stroke: {
                width: 0,
                color: "#000000"
            },
            polygon: {
                nb_sides: 5
            },
            image: {
                src: "img/github.svg",
                width: 100,
                height: 100
            }
        },
        opacity: {
            value: .5,
            random: !1,
            anim: {
                enable: !1,
                speed: 1,
                opacity_min: .1,
                sync: !1
            }
        },
        size: {
            value: 3,
            random: !0,
            anim: {
                enable: !1,
                speed: 40,
                size_min: .1,
                sync: !1
            }
        },
        line_linked: {
            enable: !0,
            distance: 150,
            color: "#ffffff",
            opacity: .4,
            width: 1
        },
        move: {
            enable: !0,
            speed: 2.5,
            direction: "none",
            random: !1,
            straight: !1,
            out_mode: "out",
            bounce: !1,
            attract: {
                enable: !1,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: "window",
        events: {
            onhover: {
                enable: !0,
                mode: "repulse"
            },
            onclick: {
                enable: !0,
                mode: "push"
            },
            resize: !0
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 95,
                duration: .4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: !0
}

setTimeout(()=>{
    particlesJS("hero-particles", particlesArgs)
},500)
