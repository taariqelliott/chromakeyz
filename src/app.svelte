<script lang="ts">
  import { WebMidi } from "webmidi";
  import Icon from "@iconify/svelte";
  import cmajor from "./components/cmajor";

  let activeNotes: any[] = $state([]);
  let currentChordNotes: any[] = $state([]);
  let chordHistory: string[][] = $state([]);
  let midiDeviceDetected = $state(false);
  let currentChordMap = $state(new Map());
  let currentChordName = $state("");

  const closeWindow = () => {
    window.electronAPI.closeApp();
  };

  const minimizeWindow = () => {
    window.electronAPI.minimizeApp();
  };

  const fullscreenWindow = () => {
    window.electronAPI.fullscreenApp();
  };

  const clearChordHistory = () => {
    chordHistory = [];
  };

  const getNoteColor = (note: string) => {
    switch (true) {
      case note.includes("C#"):
        return "text-fuchsia-500";
      case note.includes("D#"):
        return "text-pink-500";
      case note.includes("F#"):
        return "text-purple-500";
      case note.includes("G#"):
        return "text-rose-500";
      case note.includes("A#"):
        return "text-indigo-500";
      case note.includes("C"):
        return "text-green-500";
      case note.includes("D"):
        return "text-teal-500";
      case note.includes("E"):
        return "text-cyan-500";
      case note.includes("F"):
        return "text-blue-500";
      case note.includes("G"):
        return "text-sky-500";
      case note.includes("A"):
        return "text-orange-500";
      case note.includes("B"):
        return "text-yellow-500";
      default:
        return "text-zinc-200";
    }
  };

  const getChordColorClass = (chordName: string) => {
    if (chordName.includes("Dominant")) {
      return "text-pink-500";
    } else if (chordName.includes("Major")) {
      return "text-lime-500";
    } else if (chordName.includes("Minor")) {
      return "text-indigo-500";
    } else if (chordName.includes("Diminished")) {
      return "text-amber-500";
    } else {
      return "text-zinc-200";
    }
  };

  const updateCurrentChordName = () => {
    const activeNotesArray = Array.from(currentChordMap.keys());
    const chordTypes = ["eleventh", "ninth", "seventh", "triads"];
    for (const type of chordTypes) {
      for (const chord of cmajor["C Major"][type]) {
        if (
          chord.notes.length === activeNotesArray.length &&
          chord.notes.every((note: any) => activeNotesArray.includes(note))
        ) {
          currentChordName = chord.name;
          return;
        }
      }
    }
    currentChordName = "";
  };

  // const updateCurrentChordName = () => {
  //     const activeNotesArray = Array.from(currentChordMap.keys());
  //     const chordTypes = ["eleventh", "ninth", "seventh", "triads"];
  //     for (const type of chordTypes) {
  //       for (const chord of cmajor["C Major"][type]) {
  //         if (
  //           chord.notes.length === activeNotesArray.length &&
  //           chord.notes.every((note) => activeNotesArray.includes(note))
  //         ) {
  //           currentChordName = chord.name;
  //           return;
  //         }
  //       }
  //     }
  //     currentChordName = "";
  //   };

  WebMidi.enable({
    sysex: true,
    callback: (err: Error | undefined) => {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {
        if (WebMidi.inputs.length > 0) {
          midiDeviceDetected = true;
          WebMidi.inputs.forEach((input) => {
            input.addListener("noteon", (e) => {
              activeNotes.push({
                identifier: e.note.identifier,
                color: getNoteColor(e.note.identifier),
                number: e.note.number,
              });
              activeNotes.sort((a, b) => a.number - b.number);
              const chord = e.note.identifier.match(/[A-G]#?/)[0];
              currentChordMap.set(chord, (currentChordMap.get(chord) || 0) + 1);
              updateCurrentChordName();

              if (
                !currentChordNotes.some(
                  (note) => note.identifier === e.note.identifier
                )
              ) {
                currentChordNotes.push({
                  identifier: e.note.identifier,
                  number: e.note.number,
                  color: getNoteColor(e.note.identifier),
                });
              }
              currentChordNotes.sort((a, b) => a.number - b.number);
            });

            input.addListener("noteoff", (e) => {
              activeNotes = activeNotes.filter(
                (note) => note.identifier !== e.note.identifier
              );
              const chord = e.note.identifier.match(/[A-G]#?/)[0];
              if (currentChordMap.has(chord)) {
                const count = currentChordMap.get(chord);
                if (count > 1) {
                  currentChordMap.set(chord, count - 1);
                } else {
                  currentChordMap.delete(chord);
                }
              }
              updateCurrentChordName();

              if (activeNotes.length === 0) {
                chordHistory.push(
                  currentChordNotes.map((note) => note.identifier)
                );
                currentChordNotes = [];
                currentChordMap = new Map();
                currentChordName = "";
              }
              if (chordHistory.length > 15) {
                chordHistory.shift();
              }
            });
          });
        } else {
          midiDeviceDetected = false;
          console.log("No MIDI input devices available.");
        }
      }
    },
  });
</script>

<div class="absolute top-2 left-2 text-sm w-full flex flex-row gap-2">
  <button
    class="bg-pink-500 flex items-center justify-center rounded-sm hover:opacity-50 w-4 h-4 text-xs text-pink-900 active:scale-90 transition-all duration-200"
    onclick={closeWindow}
    id="close-window"
    aria-label="Close App"
  >
    <Icon icon="iconamoon:close-fill" width="24" height="24" />
  </button>
  <button
    class="bg-purple-500 flex items-center justify-center rounded-sm hover:opacity-50 w-4 h-4 text-xs text-purple-900 active:scale-90 transition-all duration-200"
    onclick={minimizeWindow}
    id="minimize-window"
    aria-label="Minimize App"
  >
    <Icon icon="iconamoon:sign-minus-fill" width="24" height="24" />
  </button>
  <button
    class="bg-cyan-500 flex items-center justify-center rounded-sm hover:opacity-50 w-4 h-4 text-xs text-cyan-900 active:scale-90 transition-all duration-200"
    onclick={fullscreenWindow}
    id="fullscreen-window"
    aria-label="Fullscreen App"
  >
    <Icon icon="iconamoon:sign-plus-fill" width="24" height="24" />
  </button>
  <div
    class="w-[100%] h-10 mt-[-10px] ml-[-7px]"
    style="-webkit-app-region: drag;"
  ></div>
</div>

<div
  class="flex h-screen flex-col items-center justify-center bg-zinc-900 text-zinc-200"
>
  <h1
    class="absolute right-2 top-1 text-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-clip bg-clip-text text-transparent"
  >
    chromakeyz
  </h1>
  <h2
    class="bg-zinc-800 min-w-[16rem] mb-2 px-2 py-2 rounded-lg min-h-[2.5rem] flex items-center justify-center {getChordColorClass(
      currentChordName
    )}"
  >
    {#if currentChordName.length === 0}
      <span class="opacity-20"></span>
    {:else}
      {currentChordName}
    {/if}
  </h2>
  <div
    class="mx-auto text-lg flex min-h-12 w-[750px] flex-row flex-wrap items-start gap-1 rounded-lg border-2 border-zinc-200 bg-zinc-800 px-2 py-2"
  >
    {#if activeNotes.length === 0}
      <div
        class="flex h-full items-center justify-center text-center text-lg opacity-15"
      >
        Waiting for MIDI input...
      </div>
    {:else}
      {#each activeNotes as note}
        <div class={note.color}>{note.identifier}</div>
      {/each}
    {/if}
  </div>
  <div
    class="mt-2 w-[750px] rounded-lg border-2 border-zinc-200 bg-zinc-800 px-2 py-2 overflow-x-auto"
  >
    {#each Array(15).fill(null) as _, index}
      <div class="flex justify-start text-lg tracking-tighter">
        <span class="max-w-2 pr-8">{index + 1}:</span>
        {#each chordHistory[chordHistory.length - 1 - index] || [] as note, noteIndex}
          <span class={getNoteColor(note)}>{note}</span>
          {#if noteIndex < chordHistory[chordHistory.length - 1 - index]?.length - 1}
            {"-"}
          {/if}
        {/each}
      </div>
    {/each}
  </div>

  <button
    class="mt-2 rounded-lg border-2 border-pink-500 bg-zinc-800 px-2 py-1 text-pink-500 transition-all duration-200 hover:cursor-pointer hover:border-emerald-500 hover:text-emerald-500 active:scale-95"
    onclick={clearChordHistory}>Clear</button
  >

  {#if !midiDeviceDetected}
    <div
      class="absolute bg-zinc-800 text-pink-500 px-2 py-2 rounded-lg bottom-4 right-4 text-sm"
    >
      No MIDI device detected
    </div>
  {/if}
</div>
