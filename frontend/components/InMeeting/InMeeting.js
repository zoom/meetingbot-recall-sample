import React, { useEffect, useState } from 'react';
import './InMeeting.css';
import zoomSdk from '@zoom/appssdk';
import appFetch from '../../helpers/fetch';

function InMeeting() {
    const [recordingState, setRecordingState] = useState('stopped');
    const [transcript, setTranscript] = useState([]);

    const toggleRecording = async () => {
        if (recordingState === 'stopped') {
            await startRecording();
        } else {
            await stopRecording();
        }
    };

    const startRecording = async () => {
        setRecordingState('starting');

        // @see https://appssdk.zoom.us/types/ZoomSdkTypes.GetMeetingJoinUrlResponse.html
        const meetingUrl = await zoomSdk.getMeetingJoinUrl();
        const res = await appFetch('/api/start-recording', {
            method: 'POST',
            body: JSON.stringify({
                meetingUrl: meetingUrl.joinUrl,
            }),
        });

        if (res.status > 299) {
            setRecordingState('error');
        }
    };

    const stopRecording = async () => {
        setRecordingState('stopping');
        const res = await appFetch('/api/stop-recording', { method: 'POST' });

        if (res.status > 299) {
            setRecordingState('error');
        }
    };

    useEffect(() => {
        if (!['stopped', 'error'].includes(recordingState)) {
            const interval = setInterval(async () => {
                const res = await appFetch('/api/recording-state', {
                    method: 'GET',
                });
                const { state, transcript } = await res.json();

                if (state === 'in_call_not_recording') {
                    setRecordingState('waiting');
                } else if (state === 'in_call_recording') {
                    setRecordingState('recording');
                } else if (state === 'fatal') {
                    setRecordingState('error');
                } else if (state === 'done') {
                    setRecordingState('stopped');
                }

                setTranscript(transcript);
            }, 2000);

            return () => clearInterval(interval);
        }
    }, [recordingState]);

    return (
        <div className="InMeeting">
            <header>
                <h1>Your AI Notetaker</h1>
            </header>

            <div className="InMeeting-record">
                <button
                    onClick={toggleRecording}
                    disabled={[
                        'starting',
                        'waiting',
                        'stopping',
                        'error',
                    ].includes(recordingState)}
                >
                    {recordingState === 'stopped' && 'Start Recording'}
                    {recordingState === 'recording' && 'Stop Recording'}
                    {recordingState === 'starting' && 'Starting...'}
                    {recordingState === 'stopping' && 'Stopping...'}
                    {recordingState === 'waiting' &&
                        'Waiting for permission...'}
                    {recordingState === 'error' && 'An error occurred'}
                </button>
            </div>

            <div className="InMeeting-transcript">
                <h3>Meeting Transcript</h3>

                {transcript.map((t, i) => (
                    <p key={i}>{JSON.stringify(t)}</p>
                ))}
            </div>
        </div>
    );
}

export default InMeeting;
