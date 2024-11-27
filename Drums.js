document.getElementById("change-page-btn").addEventListener('click',()=>{
    document.querySelector(".console").classList.toggle('hidden');
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


async function pauseAudio() {

    await Tone.getContext().rawContext.suspend(); // Sospendi il contesto audio
    console.log("AudioContext sospeso");

}


async function resumeAudio() {

    await Tone.getContext().rawContext.resume(); // Riprendi il contesto audio
    console.log("AudioContext ripreso");

}
