// Importa Tone.js (se necessario per il tuo ambiente)
// Assicurati di includere Tone.js nel progetto, ad esempio:
// <script src="https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.45/Tone.min.js"></script>

// Aggiungi pulsanti all'interfaccia utente dinamicamente
document.addEventListener("DOMContentLoaded", () => {
    const playButton = document.createElement("button");
    playButton.textContent = "Play";
    
    const stopButton = document.createElement("button");
    stopButton.textContent = "Stop";

    document.body.appendChild(playButton);
    document.body.appendChild(stopButton);

    // Configura i pulsanti per controllare il playback
    playButton.addEventListener("click", () => {
        Tone.start(); // Necessario per iniziare l'audio in alcuni browser
        // bass_part.start(0);
        // arpeggio.start(0);
        // kalimba1Part.start(0);
        // kalimba2Part.start(0);
        Tone.Transport.start();
        structure();
    });

    stopButton.addEventListener("click", () => {
        bass_part.stop();
        arpeggio.stop();
        kalimba1Part.stop();
        kalimba2Part.stop();
        Tone.Transport.stop();
    });
});
// Imposta il BPM
Tone.Transport.bpm.value = 126;

// Crea un synth semplice per l'arpeggio
const synth = new Tone.Synth().toDestination();

// Sequenza di note dell'arpeggio
const notes = [
  "C4", "D4", "F4", "C4", "D4", "F4", "C4", "D4", 
  "G4", "C4", "D4", "F4", "C4", "D4", "F4", "C4",

  "D4", "F4", "C4", "D4", "F4", "C4", "D4", "G4",
  "C4", "D4", "F4", "C4", "D4", "F4", "C4", "D4",

  "F4", "C4", "D4", "F4", "C4", "D4", "F4", "C4",
  "D4", "G4", "C4", "D4", "F4", "C4", "D4", "F4",

  "C4", "D4", "G4", "C4", "D4", "Bb4", "C5", "C4",
  "D4", "G4", "C4", "D4", "Bb4", "C4", "D4", "F4" 
];

// Durata di ciascuna nota
const duration = "16n";

// Crea una sequenza con Tone.Part
const arpeggio = new Tone.Part((time, note) => {
  synth.triggerAttackRelease(note, duration, time);
}, notes.map((note, index) => [index * Tone.Time(duration), note]));

// Configura il loop della sequenza
arpeggio.loop = true;
arpeggio.loopEnd = "4m"; // Lunghezza del loop di 4 battute

// Creiamo un sintetizzatore per il suono della Kalimba (FM Synth)
const kalimba1 = new Tone.FMSynth({
  harmonicity: 2,
  modulationIndex: 10,
  carrier: {
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.5,
      release: 0.2
    }
  },
  modulator: {
    oscillator: {
      type: "square"
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.2,
      release: 0.3
    }
  }
}).toDestination();

// Creiamo un altro sintetizzatore per la seconda Kalimba (FM Synth)
const kalimba2 = new Tone.FMSynth({
  harmonicity: 2.5,
  modulationIndex: 8,
  carrier: {
    oscillator: {
      type: "sine"
    },
    envelope: {
      attack: 0.05,
      decay: 0.1,
      sustain: 0.4,
      release: 0.3
    }
  },
  modulator: {
    oscillator: {
      type: "square"
    },
    envelope: {
      attack: 0.1,
      decay: 0.2,
      sustain: 0.2,
      release: 0.4
    }
  }
}).toDestination();

// Sequenze di note per le due Kalimbe
const kalimba1_notes = [
  "Bb4", null, "Bb4", null, 
  "A4", null, "A4", null, 
  "G4", null, null, "G4", null, 
  "G4", null, null
];

const kalimba2_notes = [
  "G4", null, "G4", null, 
  "F4", null, "F4", null, 
  "D4", null, null, "D4", 
  null, "D4", null, null
];

// Crea una sequenza per la prima Kalimba
const kalimba1Part = new Tone.Part((time, note) => {
  if (note) {
    kalimba1.triggerAttackRelease(note, "16n", time);
  }
}, kalimba1_notes.map((note, index) => [index * Tone.Time("16n"), note]));

// Crea una sequenza per la seconda Kalimba
const kalimba2Part = new Tone.Part((time, note) => {
  if (note) {
    kalimba2.triggerAttackRelease(note, "16n", time);
  }
}, kalimba2_notes.map((note, index) => [index * Tone.Time("16n"), note]));

// Configura il loop per le Kalimbe
kalimba1Part.loop = true;
kalimba1Part.loopEnd = "1m"; 
kalimba2Part.loop = true;
kalimba2Part.loopEnd = "1m"; 

// Creiamo un synth per il basso (Subtractive Bass Synth)
const bass = new Tone.MonoSynth({
  oscillator: {
    type: "sawtooth"
  },
  filter: {
    type: "lowpass",
    frequency: 200,
    Q: 4
  },
  envelope: {
    attack: 0.1,
    decay: 0.1,
    sustain: 0.7,
    release: 0.2
  },
  filterEnvelope: {
    attack: 0.01,
    decay: 0.1,
    sustain: 0.5,
    release: 0.2,
    baseFrequency: 100,
    octaves: 2
  }
}).toDestination();

// Sequenza di note per il basso
const bass_notes = [
  "G3", "F3", "Eb3", "Eb3",
  "Eb3", "F3", "C3", "C3",
  "C3", "D3", "Eb3", "Eb3", 
  "Eb3", "F3", "G3", "G3"
];

// Durata di ciascuna nota
const bass_duration = "4n";

// Crea una sequenza con Tone.Part per il basso
const bass_part = new Tone.Part((time, note) => {
  bass.triggerAttackRelease(note, bass_duration, time);
}, bass_notes.map((note, index) => [index * Tone.Time(bass_duration), note]));

// Configura il loop della sequenza per il basso
bass_part.loop = true;
bass_part.loopEnd = "4m"; // Lunghezza del loop di 4 battute
