import * as Tone from "tone";
import React, { useEffect, useRef, useState } from 'react';



function useAudioContext() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const mediaStreamRef = useRef<MediaStream | null>(null);
  
    useEffect(() => {
      async function initAudio() {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;
  
          if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext)();
          }
  
          const source = audioContextRef.current.createMediaStreamSource(stream);
          analyserRef.current = audioContextRef.current.createAnalyser();
          analyserRef.current.fftSize = 2048;
          const bufferLength = analyserRef.current.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
  
          source.connect(analyserRef.current);
          analyserRef.current.connect(audioContextRef.current.destination);
  

          
        function findDominantFrequency(dataArray: string | any[] | Uint8Array, sampleRate: number | undefined) {
          let maxVolume = -Infinity;
          let dominantFrequencyIndex = -1;

          for (let i = 0; i < dataArray.length; i++) {
            if (dataArray[i] > maxVolume) {
              maxVolume = dataArray[i];
              dominantFrequencyIndex = i;
            }
          }

          const nyquistFrequency = sampleRate / 2;
          const frequencyStep = nyquistFrequency / dataArray.length;
          return dominantFrequencyIndex * frequencyStep;
        }

        function frequencyToNote(frequency:number) {
          if (frequency === 0) return 'Silence';

          const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
          const noteNumber = 12 * (Math.log(frequency / 440) / Math.LN2) + 69;
          const octave = Math.floor(noteNumber / 12) - 1;
          const note = notes[Math.round(noteNumber % 12)];

          return `${note}${octave}`;
        }
         
          // Start analyzing audio data
          const SILENCE_THRESHOLD = 20; // 设置一个合理的静默阈值

          const SLIDING_WINDOW_SIZE = 10; // 窗口大小
          const MIN_DURATION = 300; // 最小持续时间（毫秒）
          let slidingWindow: string[] = [];
          let startTime: number | null = null;

          function analyzeAudio() {
            analyserRef.current?.getByteFrequencyData(dataArray);

            const sampleRate = audioContextRef.current?.sampleRate;
            const dominantFrequency = findDominantFrequency(dataArray, sampleRate);
            const note = frequencyToNote(dominantFrequency);

            // 更新滑动窗口
            slidingWindow.push(note);
            if (slidingWindow.length > SLIDING_WINDOW_SIZE) {
              slidingWindow.shift();
            }

            // 检查窗口内是否所有音符相同
            const allSame = slidingWindow.every(n => n === note && n !== null);

            if (allSame) {
              if (!startTime) {
                startTime = Date.now();
              } else {
                const currentTime = Date.now();
                if (currentTime - startTime >= MIN_DURATION) {
                  console.log(`Detected Note: ${note} for ${currentTime - startTime} ms`);
                  startTime = null; // 重置计时器
                }
              }
            } else {
              startTime = null; // 重置计时器
            }
          
            requestAnimationFrame(analyzeAudio);
          }

          analyzeAudio();
        } catch (err) {
          console.error('Error accessing microphone:', err);
        }
      }
  
      initAudio();
  
      return () => {
        if (mediaStreamRef.current) {
          mediaStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      };
    }, []);
  
    return [audioContextRef, analyserRef];
  }

export function ToneIdentity() {
    const [audioContext, analyser] = useAudioContext();
    const [detectedNote, setDetectedNote] = useState('No note detected');

    // 假设我们有一个函数可以根据频率返回音符名称
    function frequencyToNote(frequency:number) {
      // 简单示例，实际应用中需要更复杂的算法
      const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const note = Math.round(12 * (Math.log(frequency / 440) / Math.LN2)) + 69;
      const octave = Math.floor((note - 12) / 12);
      return `${notes[note % 12]}${octave}`;
    }


    // 假设这里有一个方法可以从 analyserRef 获取频率并调用 frequencyToNote
    useEffect(() => {
      function detectNote(frequency: number) {
        const note = frequencyToNote(frequency);
        setDetectedNote(note);
      }
  
      // 设置定时器或其他机制定期调用 detectNote
    }, []);

    return (
      <div>
        <h1>Detected Note: {detectedNote}</h1>
      </div>
    );
}
  
