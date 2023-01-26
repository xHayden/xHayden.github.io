import { useState, useEffect } from "react";

export default function TypeText(props) {
    const [wordSpeaking, setWordSpeaking] = useState(0);
    const [textIndex, setTextIndex] = useState(0);
    const [timer, setTimer] = useState(0);
    const [displayedText, setDisplayedText] = useState();
    const [paused, setPaused] = useState(props.start == undefined ? false : !props.start);
    const typedText = props.text;
  
    useEffect(() => {
      if (!paused) {
        generateText().then(intro => {
          setDisplayedText(intro);
        });
      }
    }, [timer]);

    useEffect(() => {
        if (props.start !== undefined) setPaused(!props.start);
    }, [props.start])
  
    useEffect(() => {
      setWordSpeaking(0);
      setTextIndex(0);
      const timerInterval = setInterval(() => {
        setTimer(timer => timer + 1);
      }, 50);
      return () => clearInterval(timerInterval);
    }, []);
  
    function generateHiddenTextPreventCLS() {
      let textElements = typedText.map((el, index) => {
        return <span className={el.class} key={index}>
          {el.text}
        </span>
      });
      textElements.push(<span key="|">|</span>);
      return <span>
        {textElements}
      </span>
    }
  
    function pause(timeInMs) {
      return new Promise((resolve, reject) => {
        setPaused(true);
        setTimeout(() => {
          setPaused(false);
          resolve("done");
        }, timeInMs);
      })
    }
  
    async function generateText() {
      let wordsToRender = [];
      for (let i = 0; i < typedText.length; i++) {
        if (i < wordSpeaking) {
          wordsToRender.push(typedText[i]);
        } else if (i == wordSpeaking) {
          let slicedText = { ...typedText[i] };
          slicedText.text = slicedText.text.slice(0, textIndex);
          if (slicedText.text[textIndex - 2] === ".") {
            await pause(300);
          }
          setTextIndex(textIndex + 1);
          if (textIndex == typedText[i].text.length) {
            setWordSpeaking(wordSpeaking + 1);
            setTextIndex(0);
          }
          wordsToRender.push(slicedText);
        }
      }
      if (wordSpeaking == typedText.length) {
        wordsToRender.push({ class: [], text: (timer % 16 > 8) ? "" : "|" });
      } else {
        wordsToRender.push({ class: [], text: "|" });
      }
      let textElements = wordsToRender.map((el, index) => {
        return <span className={el.class} key={index}>
          {el.text}
        </span>
      });
      return <span>
        {textElements}
      </span>
    }
  
      return <div className='md:p-32'>
        <p className='text-3xl md:text-5xl xl:text-6xl font-bold py-4 absolute inline-block max-w-7xl intro-width-fix'>{displayedText}</p>
        <p className='text-3xl md:text-5xl xl:text-6xl font-bold py-4 inline-block invisible max-w-7xl'>{generateHiddenTextPreventCLS()}</p>
      </div>
  }