// chords.js

// Chords in the key of C Major, grouped by chord type (triads, 7th, 9th, 11th)
const cmajor = {
  "C Major": {
    triads: [
      // Triads (major, minor, diminished)
      { name: "C Major Triad", notes: ["C", "E", "G"] },
      { name: "F Major Triad", notes: ["F", "A", "C"] },
      { name: "G Major Triad", notes: ["G", "B", "D"] },
      { name: "D Minor Triad", notes: ["D", "F", "A"] },
      { name: "E Minor Triad", notes: ["E", "G", "B"] },
      { name: "A Minor Triad", notes: ["A", "C", "E"] },
      { name: "B Diminished Triad", notes: ["B", "D", "F"] },
    ],
    seventh: [
      // 7th chords (major7th, minor7th, dominant7th, half-diminished7th)
      { name: "C Major 7th", notes: ["C", "E", "G", "B"] },
      { name: "F Major 7th", notes: ["F", "A", "C", "E"] },
      { name: "D Minor 7th", notes: ["D", "F", "A", "C"] },
      { name: "E Minor 7th", notes: ["E", "G", "B", "D"] },
      { name: "A Minor 7th", notes: ["A", "C", "E", "G"] },
      { name: "G Dominant 7th", notes: ["G", "B", "D", "F"] },
      { name: "B Half-Diminished 7th", notes: ["B", "D", "F", "A"] },
    ],
    ninth: [
      // 9th chords (major9th, minor9th, dominant9th, half-diminished9th)
      { name: "C Major 9th", notes: ["C", "E", "G", "B", "D"] },
      { name: "F Major 9th", notes: ["F", "A", "C", "E", "G"] },
      { name: "D Minor 9th", notes: ["D", "F", "A", "C", "E"] },
      { name: "E Minor 9th", notes: ["E", "G", "B", "D", "F"] },
      { name: "A Minor 9th", notes: ["A", "C", "E", "G", "B"] },
      { name: "G Dominant 9th", notes: ["G", "B", "D", "F", "A"] },
      { name: "B Half-Diminished 9th", notes: ["B", "D", "F", "A", "C"] },
    ],
    eleventh: [
      // 11th chords (major11th, minor11th, dominant11th)
      { name: "C Major 11th", notes: ["C", "E", "G", "B", "D", "F"] },
      { name: "F Major 11th", notes: ["F", "A", "C", "E", "G", "B"] },
      { name: "D Minor 11th", notes: ["D", "F", "A", "C", "E", "G"] },
      { name: "E Minor 11th", notes: ["E", "G", "B", "D", "F", "A"] },
      { name: "A Minor 11th", notes: ["A", "C", "E", "G", "B", "D"] },
      { name: "G Dominant 11th", notes: ["G", "B", "D", "F", "A", "C"] },
      { name: "B Half-Diminished 11th", notes: ["B", "D", "F", "A", "C", "E"] },
    ],
  },
};

// Exporting the chords
export default cmajor;
