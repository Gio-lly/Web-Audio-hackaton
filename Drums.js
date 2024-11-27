document.getElementById("change-page-btn").addEventListener('click',()=>{
    document.querySelector(".console").classList.toggle('hidden');
    document.getElementById("play-bn").classList.toggle('hidden');
    document.getElementById("stop-btn").classList.toggle('hidden');
    Tone.close();
});
///////////////////////////////MIXER///////////////////////////
//filters
const hpf = new Tone.Filter({
    frequency: 800, // Frequenza iniziale del filtro (Hz)
    type: "highpass", // Tipo di filtro: 'lowpass', 'highpass', ecc.
    rolloff: -12, // Pendenza del filtro
  }).toDestination();



//volumes
const kickGain = new Tone.Gain(0.5).toDestination(); // Volume ridotto al 50%
const snareGain = new Tone.Gain(0.5).toDestination(); // Volume ridotto al 50%
const hiHatGain = new Tone.Gain(0.1).toDestination(); // Volume ridotto al 50%




//////////////////////////////////SOUND DESIGN////////////////////////

const kick = new Tone.MembraneSynth().connect(kickGain);
const kickf = new Tone.MembraneSynth().connect(hpf);

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
    frequency: 4000,
    envelope: { attack: 0.001, decay: 0.1, release: 0.01 },
    harmonicity: 5.1,
    modulationIndex: 32
}).connect(hiHatGain);


///////////////////////////////////HARMONY///////////////////////



//////////////////////////////////LOOPS/////////////////////



kickloop = new Tone.Loop((time) => {
    kick.triggerAttackRelease('C1', '8n', time); // Kick on beats 1 and 3
    kick.triggerAttackRelease('C1', '8n', time + Tone.Time('4n')); // Kick on beats 1 and 3

    kick.triggerAttackRelease('C1', '8n', time + Tone.Time('4n') * 2); // Kick on beats 1 and 3
    kick.triggerAttackRelease('C1', '8n', time + Tone.Time('4n') *3); // Kick on beats 1 and 3

    }, '1m');

snareloop = new Tone.Loop((time) => {
    snare.triggerAttackRelease('8n', time + Tone.Time('4n')); // Snare on beats 2 and 4
    
    snare.triggerAttackRelease('8n', time + Tone.Time('4n') *3); // Snare on beats 2 and 4

    }, '1m');

hihatloop = new Tone.Loop((time) => {
    for (let i = 0; i < 8; i++) {
        hiHat.triggerAttackRelease('C6', '16n', time + Tone.Time('8n') * i); // Hi-hat every eighth note
        }

    }, '1m');


drumloop = new Tone.Loop((time) => {
    kick.triggerAttackRelease('C1', '8n', time); // Kick on beats 1 and 3
    kick.triggerAttackRelease('C1', '8n', time + Tone.Time('4n')); // Kick on beats 1 and 3
    snare.triggerAttackRelease('8n', time + Tone.Time('4n')); // Snare on beats 2 and 4
    
    kick.triggerAttackRelease('C1', '8n', time + Tone.Time('4n') * 2); // Kick on beats 1 and 3
    kick.triggerAttackRelease('C1', '8n', time + Tone.Time('4n') *3); // Kick on beats 1 and 3
    snare.triggerAttackRelease('8n', time + Tone.Time('4n') *3); // Snare on beats 2 and 4
    
    for (let i = 0; i < 8; i++) {
        hiHat.triggerAttackRelease('C6', '16n', time + Tone.Time('8n') * i); // Hi-hat every eighth note
        }
    }, '1m');


kickloopfilter = new Tone.Loop((time) => {
    kickf.triggerAttackRelease('C1', '8n', time); // Kick on beats 1 and 3
    kickf.triggerAttackRelease('C1', '8n', time + Tone.Time('4n')); // Kick on beats 1 and 3
    
    kickf.triggerAttackRelease('C1', '8n', time + Tone.Time('4n') * 2); // Kick on beats 1 and 3
    kickf.triggerAttackRelease('C1', '8n', time + Tone.Time('4n') *3); // Kick on beats 1 and 3
    
  
    }, '1m');
    


////////////////////////////STRUCTURE///////////////////////////


async function structure() {
    const end = '132m'
    //intro 4m
    kickloop.start(0).stop('8m');
    snareloop.start(0).stop('48m');
    await kickloopfilter.start('8m').stop('32m');
    await hihatloop.start('16m').stop('48m');


    await arpeggio.start('32m').stop('128m');
    await kickloop.start('32m').stop('48m');
    await kalimba1Part.start('48m').stop(end);
    await kalimba2Part.start('48m').stop(end);


    await kickloopfilter.start('64m').stop('78m');
    await snareloop.start('68m').stop('100m');
    await hihatloop.start("72m").stop('96m');
    


    await bass_part.start('78m').stop('104m');
    await kickloop.start('78m').stop('104m');

    // 4m
    
    //verse 16m
    //await kickloop.start('12m').stop('20m')
    //await drumloop.start('20m').stop('32m')

    //bridge 4m
    //await arpeggio.start('32m').stop('48m')
    //verse2 16m

    //main bridge 8m

    //buildup


    //main drop 16m


    //outro
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
let cassa = document.querySelector('.kick');
let rullante = document.querySelector('.snare');
let charlie = document.querySelector('.hihat');
let arpe = document.querySelector('.arpeggio');
let lead = document.querySelector('.lead');
let basso = document.querySelector('.bass');

let isKickActive = false;
let isSnareActive = false;
let isHiHatActive = false;
let isArpeggioActive = false;
let isLeadActive = false;
let isBassActive = false;


cassa.addEventListener('click', () => {
    const context = Tone.getContext().rawContext;
    cassa.classList.toggle('running');
    if (context.state === "suspended") {
        Tone.context.resume();
    } else {
        Tone.start();
        Tone.Transport.bpm.value = 126;
        Tone.Transport.start(); // Inizia il trasporto

        if (isKickActive) {
    
            kickloop.stop();
            isKickActive = false;

        } else {

            Tone.Transport.scheduleOnce((time) => {
                kickloop.start(time);
            }, Tone.Transport.nextSubdivision('4n'));
            isKickActive = true;
        }
    }
});

rullante.addEventListener('click', () => {
    const context = Tone.getContext().rawContext;
    rullante.classList.toggle('running');
    if (context.state === "suspended") {
        Tone.context.resume();
    } else {
        Tone.start();
        Tone.Transport.bpm.value = 126;
        Tone.Transport.start();

        if (isSnareActive) {
            snareloop.stop();
            isSnareActive = false;
        } else {
            Tone.Transport.scheduleOnce((time) => {
                snareloop.start(time);
            }, Tone.Transport.nextSubdivision('4n'));
            isSnareActive = true;
        }
    }
});

charlie.addEventListener('click', () => {
    const context = Tone.getContext().rawContext;
    charlie.classList.toggle('running');
    if (context.state === "suspended") {
        Tone.context.resume();
    } else {
        Tone.start();
        Tone.Transport.bpm.value = 126;
        Tone.Transport.start();

        if (isHiHatActive) {
            hihatloop.stop();
            isHiHatActive = false;
        } else {
            Tone.Transport.scheduleOnce((time) => {
                hihatloop.start(time);
            }, Tone.Transport.nextSubdivision('4n'));
            isHiHatActive = true;
        }
    }
});


arpe.addEventListener('click', () => {
    const context = Tone.getContext().rawContext;
    arpe.classList.toggle('running');
    if (context.state === "suspended") {
        Tone.context.resume();
    } else {
        Tone.start();
        Tone.Transport.bpm.value = 126;
        Tone.Transport.start();

        if (isArpeggioActive) {
            arpeggio.stop();
            isArpeggioActive = false;
        } else {
            Tone.Transport.scheduleOnce((time) => {
                arpeggio.start(time);
            }, Tone.Transport.nextSubdivision('4n'));
            isArpeggioActive = true;
        }
    }
});

// Pulsante per il lead (melodia)
lead.addEventListener('click', () => {
    const context = Tone.getContext().rawContext;
    lead.classList.toggle('running');
    if (context.state === "suspended") {
        Tone.context.resume();
    } else {
        Tone.start();
        Tone.Transport.bpm.value = 126;
        Tone.Transport.start();

        if (isLeadActive) {
            kalimba1Part.stop();
            kalimba2Part.stop();
            isLeadActive = false;
        } else {
            Tone.Transport.scheduleOnce((time) => {
                kalimba1Part.start(time);
                kalimba2Part.start(time);
            }, Tone.Transport.nextSubdivision('4n'));
            isLeadActive = true;
        }
    }
});

// Pulsante per il basso (bass)
basso.addEventListener('click', () => {
    const context = Tone.getContext().rawContext;
    basso.classList.toggle('running');
    if (context.state === "suspended") {
        Tone.context.resume();
    } else {
        Tone.start();
        Tone.Transport.bpm.value = 126;
        Tone.Transport.start();

        if (isBassActive) {
    
            bass_part.stop();
            isBassActive = false;
        } else {

            Tone.Transport.scheduleOnce((time) => {
                bass_part.start(time);
            }, Tone.Transport.nextSubdivision('4n'));
            isBassActive = true;
        }
    }
});
