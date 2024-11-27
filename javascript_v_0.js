


///////////////////////////////MIXER///////////////////////////

const kickGain = new Tone.Gain(0.5).toDestination(); // Volume ridotto al 50%
const snareGain = new Tone.Gain(0.5).toDestination(); // Volume ridotto al 50%
const hiHatGain = new Tone.Gain(0).toDestination(); // Volume ridotto al 50%

//////////////////////////////////SOUND DESIGN////////////////////////

const kick = new Tone.MembraneSynth().connect(kickGain);

const snare = new Tone.NoiseSynth({
    "noise": {
        "type": "white",
        "playbackRate" : 0.6
    },
    "envelope": {
        "attackCurve" : "exponential",
        "attack": 0.3,
        "decay": 0.2,
        "sustain": 0,
        "release": 0.2
    }
}
    , '4n').connect(snareGain);

const hiHat = new Tone.MetalSynth({
    frequency: 5000,
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32
}).connect(hiHatGain);



///////////////////////////////////HARMONY///////////////////////



//////////////////////////////////LOOPS/////////////////////


const kickloop = new Tone.Loop(function(time) {     
    //AUDIO
    console.log(time);
    kick.triggerAttackRelease("C2", "4n", time);

    
    //VISUAL
    const circle = document.getElementById('circle');
    Tone.Draw.schedule(() => {
        circle.style.visibility = "visible";
        // Nasconde il cerchio dopo un breve intervallo
        setTimeout(() => {
            circle.style.visibility = "hidden";
        }, 100); // Tempo in millisecondi
    }, time); // Usa time per sincronizzare
},'4n')




////////////////////////////STRUCTURE///////////////////////////



drumloop = new Tone.Loop((time) => {
    kick.triggerAttackRelease('C1', '8n', time); // Kick on beats 1 and 3
    snare.triggerAttackRelease('8n', time + Tone.Time('4n')); // Snare on beats 2 and 4
    snare.triggerAttackRelease('8n', time + Tone.Time('4n') + Tone.Time('2n'));
    
    for (let i = 0; i < 8; i++) {
        hiHat.triggerAttackRelease('C6', '16n', time + Tone.Time('8n') * i); // Hi-hat every eighth note
    }
    }, '1m');



function main_bridge() {

}

function breakdown() {
    
}

function build_up() {

}

function main_drop() {
    
}

function outro() {
    
}


function structure() {
    //intro
    drumloop.start(0).stop('4m')
    drumloop.start('4m').stop('8m')
    

}
 

////////////////////////////// PLAY/STOP /////////////////////////

async function play() {
    const context = Tone.getContext().rawContext

    if (context.state === "suspended") {
        Tone.context.resume()
    } else {
        Tone.start()
        Tone.Transport.bpm.value = 126
        Tone.Transport.start(); // Start the transport which is the main timeline
        structure()
    }

}


async function pauseAudio() {

    await Tone.getContext().rawContext.suspend(); // Sospendi il contesto audio
    console.log("AudioContext sospeso");

}


async function resumeAudio() {

    await Tone.getContext().rawContext.resume(); // Riprendi il contesto audio
    console.log("AudioContext ripreso");

}