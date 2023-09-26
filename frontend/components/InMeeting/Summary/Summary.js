import React, { useState } from 'react';
import './Summary.css';
import appFetch from '../../../helpers/fetch';

/* eslint react/prop-types: 0 */
export const Summary = ({ transcript }) => {
    const [summaryState, setSummaryState] = useState('none');
    const [prompt, setPrompt] = useState('general_summary');
    const [summary, setSummary] = useState();

    const generateSummary = async () => {
        setSummaryState('summarising');

        const res = await appFetch('/api/summarize', {
            method: 'POST',
            body: JSON.stringify({
                prompt,
            }),
        });

        if (res.status < 299) {
            const data = await res.json();
            setSummaryState('none');
            setSummary(data.summary);
        } else {
            setSummaryState('error');
        }
    };

    return (
        <div className="InMeeting-summary">
            <h3>AI Summary</h3>
            <p className="InMeeting-summary-text">{summary}</p>
            <select value={prompt} onChange={(e) => setPrompt(e.target.value)}>
                <option value="general_summary">Summarize this meeting</option>
                <option value="action_items">Generate action items</option>
                <option value="decisions">Outline decisions made</option>
                <option value="next_steps">Highlight next steps</option>
                <option value="key_takeaways">Find key takeaways</option>
            </select>
            <button
                onClick={generateSummary}
                disabled={
                    transcript.length === 0 ||
                    ['summarising', 'error'].includes(summaryState)
                }
            >
                {summaryState === 'none' && 'Ask Claude'}
                {summaryState === 'summarising' && 'Thinking...'}
                {summaryState === 'error' && 'An Error Occurred'}
            </button>
        </div>
    );
};

export default Summary;
