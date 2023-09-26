import React, { useEffect, useRef } from 'react';
import './Transcript.css';

/* eslint react/prop-types: 0 */
export const Transcript = ({ transcript }) => {
    const ref = useRef();
    const finalTranscript = [];
    let currentSpeaker = undefined;

    for (let i = 0; i < transcript.length; i++) {
        const utterance = transcript[i];
        const isLast = i === transcript.length - 1;

        if (utterance.speaker !== currentSpeaker) {
            currentSpeaker = utterance.speaker;
            finalTranscript.push({ speaker: currentSpeaker, text: [] });
        }

        if (utterance.is_final || isLast) {
            finalTranscript[finalTranscript.length - 1].text.push(
                ...utterance.words.map((i) => i.text)
            );
            continue;
        }
    }

    useEffect(() => {
        // scroll to bottom
        if (ref.current) {
            ref.current.scrollTop = ref.current.scrollHeight;
        }
    }, [transcript]);

    return (
        <div ref={ref} className="InMeeting-transcript">
            {finalTranscript.map((item, index) => (
                <p key={index}>
                    <span className="InMeeting-transcript-speaker">
                        {item.speaker || 'Unknown'}:
                    </span>
                    <span>{item.text.join(' ')}</span>
                </p>
            ))}
        </div>
    );
};

export default Transcript;
