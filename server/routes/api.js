import express from 'express';
import { handleError, sanitize } from '../helpers/routing.js';
import { contextHeader, getAppContext } from '../helpers/cipher.js';
import { recallFetch } from '../helpers/recall.js';

import session from '../session.js';
import { zoomApp } from '../config.js';
import db from '../helpers/database.js';
import { anthropicFetch } from '../helpers/anthropic.js';

const router = express.Router();

/*
 * Gets the context of the Zoom App
 */
router.get('/context', async (req, res, next) => {
    try {
        sanitize(req);

        const header = req.header(contextHeader);

        const isZoom = !!(header && getAppContext(header));

        return res.json({
            isZoom,
        });
    } catch (e) {
        next(handleError(e));
    }
});

const validateAppContext = (req) => {
    const header = req.header(contextHeader);

    if (!header || !getAppContext(header)) {
        const e = new Error('Unauthorized');
        e.code = 401;
        throw e;
    }
};

/*
 * Send's a Recall Bot to start recording the call
 */
router.post('/start-recording', session, async (req, res, next) => {
    try {
        sanitize(req);
        validateAppContext(req);

        if (!req.body.meetingUrl) {
            return res.status(400).json({ error: 'Missing meetingUrl' });
        }

        console.log('recall bot start recording', req.body.meetingUrl);

        // @see https://recallai.readme.io/reference/bot_create
        const bot = await recallFetch('/api/v1/bot', {
            method: 'POST',
            body: JSON.stringify({
                bot_name: `${process.env.BOT_NAME} Notetaker`,
                meeting_url: req.body.meetingUrl,
                transcription_options: {
                    provider: 'default',
                },
                real_time_transcription: {
                    destination_url: `${zoomApp.publicUrl}/webhook/transcription?secret=${zoomApp.webhookSecret}`,
                    partial_results: true,
                },
                zoom: {
                    request_recording_permission_on_host_join: true,
                    require_recording_permission: true,
                },
                /* Uncomment this to enable the bot to display an image.
                automatic_video_output: {
                    in_call_recording: {
                      kind: 'jpeg',
                      b64_data: 'YOUR-BASE64-JPEG-GOES-HERE'
                    }
                },
                */
                /* Uncomment this to enable the bot to play audio.
                automatic_audio_output: {
                    in_call_recording: {
                      data: {
                        kind: 'mp3',
                        b64_data: 'YOUR-BASE64-MP3-GOES-HERE'
                      }
                    }
                },
                */
                /* Uncomment this to make the bot send a chat message.
                chat: {
                    on_bot_join: {
                      send_to: 'everyone',
                      message: 'Hello world'
                    }
                },
                */
            }),
        });

        console.log('recall bot', bot);
        req.session.botId = bot.id;

        return res.json({
            botId: bot.id,
        });
    } catch (e) {
        next(handleError(e));
    }
});

/*
 * Tells the Recall Bot to stop recording the call
 */
router.post('/stop-recording', session, async (req, res, next) => {
    try {
        sanitize(req);
        validateAppContext(req);

        if (!req.session.botId) {
            return res.status(400).json({ error: 'Missing botId' });
        }

        await recallFetch(`/api/v1/bot/${req.session.botId}/leave_call`, {
            method: 'POST',
        });

        console.log('recall bot stopped');
        return res.json({});
    } catch (e) {
        next(handleError(e));
    }
});

/*
 * Gets the current state of the Recall Bot
 */
router.get('/recording-state', session, async (req, res, next) => {
    try {
        sanitize(req);
        validateAppContext(req);

        const botId = req.session.botId;

        if (!botId) {
            return res.status(400).json({ error: 'Missing botId' });
        }

        const bot = await recallFetch(`/api/v1/bot/${botId}`, {
            method: 'GET',
        });
        const latestStatus = bot.status_changes.slice(-1)[0].code;

        return res.json({
            state: latestStatus,
            transcript: db.transcripts[botId] || [],
        });
    } catch (e) {
        next(handleError(e));
    }
});

const PROMPTS = {
    _template: `
Human: You are a virtual assistant, and you are taking notes for a meeting. 
You are diligent, polite and slightly humerous at times.
Human: Here is the a transcript of the meeting, including the speaker's name:

Human: <transcript>
{{transcript}}
Human: </transcript>

Human: Only answer the following question directly, do not add any additional comments or information.
Human: {{prompt}}

Assistant:`,
    general_summary: 'Can you summarize the meeting? Please be concise.',
    action_items: 'What are the action items from the meeting?',
    decisions: 'What decisions were made in the meeting?',
    next_steps: 'What are the next steps?',
    key_takeaways: 'What are the key takeaways?',
};

/*
 * Gets a summary of the transcript using Anthropic's Claude model.
 */
router.post('/summarize', session, async (req, res, next) => {
    try {
        sanitize(req);
        validateAppContext(req);

        const botId = req.session.botId;
        const prompt = PROMPTS[req.body.prompt];

        if (!botId) {
            return res.status(400).json({ error: 'Missing botId' });
        }

        if (!prompt) {
            return res.status(400).json({ error: 'Missing prompt' });
        }

        const transcript = db.transcripts[botId] || [];
        const finalTranscript = transcript
            .filter((utterance) => utterance.is_final)
            .map(
                (utterance) =>
                    `Human: ${utterance.speaker || 'Unknown'}: ${utterance.words
                        .map((w) => w.text)
                        .join(' ')}`
            )
            .join('\n');
        const completePrompt = PROMPTS._template
            .replace('{{transcript}}', finalTranscript)
            .replace('{{prompt}}', prompt);

        console.log('completePrompt', completePrompt);

        const data = await anthropicFetch('/v1/complete', {
            method: 'POST',
            body: JSON.stringify({
                model: 'claude-2',
                prompt: completePrompt,
                max_tokens_to_sample: 1024,
            }),
        });

        return res.json({
            summary: data.completion,
        });
    } catch (e) {
        next(handleError(e));
    }
});

export default router;
